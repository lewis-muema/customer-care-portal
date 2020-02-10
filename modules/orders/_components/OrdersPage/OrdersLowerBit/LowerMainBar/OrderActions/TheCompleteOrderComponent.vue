<template>
  <form @submit.prevent="completeOrder" class="form-inline">
    <div class="form-group col-md-12">
      <label class="reason">Reason</label>
      <textarea
        type="text"
        v-model="reason"
        :id="`completion_reason_${orderNo}`"
        name="reason"
        class="form-control"
        placeholder="Order completion order"
        :class="{
          'is-invalid': submitted && $v.reason.$error,
        }"
      >
      </textarea>
      <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
        Order Completion Reason is required
      </div>
    </div>
    <div class="form-group col-md-12">
      <label class="col-md-12 uploads">Submit Delivery Notes</label>
      <div
        class="upload-container col-md-6"
        :id="`delivery_images_${orderNo}`"
        :class="{
          'dnotes-is-invalid': submitted && dnotes.length === 0,
        }"
      >
        <vue-upload-multiple-image
          @upload-success="uploadImageSuccess"
          @before-remove="beforeRemove"
          @edit-image="editImage"
          @data-change="dataChange"
          :data-images="images"
          :drag-text="uploadText"
          :browse-text="browseText"
          :mark-is-primary-text="empty"
          :primary-text="empty"
          :show-primary="showPrimary"
        ></vue-upload-multiple-image>
      </div>
      <div class="upload-container col-md-6">
        <div class="scan-container" :id="`scanned_images_${orderNo}`">
          <button class="btn btn-default">Scan Images</button>
        </div>
      </div>
      <div
        v-if="submitted && dnotes.length === 0"
        class="dnotes-invalid-feedback"
      >
        Order Delivery Notes are required
      </div>
    </div>
    <div class="form-group col-md-12">
      <button type="button" @click="scanToJpg">Scan</button>

      <div id="images"></div>
      <button class="btn btn-primary action-button">
        Complete Order
        <span v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </div>
  </form>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

import VueUploadMultipleImage from 'vue-upload-multiple-image';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    VueUploadMultipleImage,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      reason: '',
      submitted: false,
      loading: false,
      images: [
        {
          path:
            'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
          caption: 'Elephant',
        },
      ],
      uploadText: 'Upload Image(s)',
      browseText: 'browse',
      markIsPrimary: 'test image',
      empty: '',
      showPrimary: false,
      dnotes: [
        {
          document_tag: 'delivery_note',
          images: ['AP77ZE878-4UQ3-delivery_note-0.jpg'],
          name: 'Delivery Note',
        },
      ],
    };
  },
  validations: {
    reason: { required },
  },
  computed: {
    ...mapState(['userData', 'config']),
    signedBy() {
      return `Sendy Staff - ${this.userData.payload.data.name}`;
    },
    userPhone() {
      return this.userData.payload.data.phone;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    async completeOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loading = true;
      // Notify orders app of uploaded dnotes
      const notify = await this.notifyOrdersApp();
      if (typeof notify !== 'undefined' && notify.status) {
        // complete/deliver the order.
        const payload = {
          app: 'ORDERS_APP',
          endpoint: 'rider_app_deliver',
          apiKey: true,
          params: {
            order_no: this.orderNo,
            rider_phone: this.order.rider_details.phone_no,
            sim_card_sn: this.order.rider_details.serial_no,
          },
        };
        try {
          const data = await this.perform_order_action(payload);
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        } catch (error) {
          notification.push(
            'Failed to complete order. Try again or contact Tech Support',
          );
          actionClass = 'danger';
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },
    scanToJpg() {
      scanner.scan(displayImagesOnPage, {
        output_settings: [
          {
            type: 'return-base64',
            format: 'jpg',
          },
        ],
      });
    },
    async notifyOrdersApp() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'rider_app_delivery_image',
        apiKey: true,
        params: {
          delivery_image: this.dnotes,
          is_saved_to_s3: true,
          mobile_no: this.userPhone,
          name: this.signedBy,
          order_no: this.orderNo,
          rider_phone: this.order.rider_details.phone_no,
          sim_card_sn: this.order.rider_details.serial_no,
          type: 'jpg',
          version_code: 1000000000,
          waypoint_no: 0,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        // console.log('response', data);
        if (data.status) {
          return data;
        } else {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    uploadImageSuccess(formData, index, fileList) {
      const fd = new FormData();
      fd.append('file', fileList);
      console.log('fd', fd);
      console.log('data', formData, index, fileList);
      const url = `${this.config.ADONIS_API}orders/${this.orderNo}/upload`;
      console.log('config', this.config.ADONIS_API);
      const jwtToken = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtToken,
        },
      };
      // Upload image api
      axios.post(url, { data: fd }, config).then(response => {
        console.log('response images', response);
      });
    },
    beforeRemove(index, done, fileList) {
      console.log('index', index, fileList);
      // eslint-disable-next-line no-restricted-globals
      const r = confirm('remove image');
      if (r === true) {
        done();
        // eslint-disable-next-line no-empty
      } else {
      }
    },
    editImage(formData, index, fileList) {
      console.log('edit data', formData, index, fileList);
    },

    dataChange(data) {
      console.log('changed', data);
    },
  },
};
</script>
<style scoped>
.btn-group > .btn-group:not(:last-child) > .btn,
.btn-group > .btn:not(:last-child):not(.dropdown-toggle) {
  margin-right: 6em;
}
.uploads {
  justify-content: left;
  margin-left: -1em;
  margin-bottom: 10px;
  font-weight: 600;
}
.reason {
  font-weight: 600;
}
.btn-default {
  cursor: pointer;
  margin-right: 6em;
  width: 8em;
  border-radius: 5px;
  border: 1px dashed #d6d6d6;
  float: none;
  margin: 36% auto;
}
.upload-container {
  display: flex;
  justify-content: left;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.scan-container {
  width: 190px;
  height: 180px;
  border: 1px dashed #d6d6d6;
  border-radius: 4px;
  background-color: #fff;
}
.dnotes-invalid-feedback {
  /* display: none; */
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
.dnotes-is-invalid {
  border-color: #dc3545;
}
.loader {
  color: #ffffff;
}
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
