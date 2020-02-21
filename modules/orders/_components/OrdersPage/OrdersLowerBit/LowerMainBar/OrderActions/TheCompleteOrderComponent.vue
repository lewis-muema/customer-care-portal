<template>
  <span>
    <form
      class="form-inline"
      @submit.prevent="completeOrder"
      ref="form"
      enctype="multipart/form-data"
    >
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
      <div class="form-group col-md-12" :id="`delivery_container_${orderNo}`">
        <label class="col-md-12 uploads">Submit Delivery Notes</label>
        <div
          class="upload-container col-md-6"
          :id="`delivery_images_${orderNo}`"
        >
          <div
            class="scan-container"
            :class="{
              'dnotes-is-invalid': submitted && images.length === 0,
            }"
          >
            <label class="fileContainer">
              <button class="btn btn-default">
                Upload Image(s)
              </button>
              <input multiple type="file" name="files[]" @change="upload" />
            </label>
          </div>
        </div>
        <div
          v-if="submitted && images.length === 0"
          class="dnotes-invalid-feedback"
        >
          Order Delivery Notes are required
        </div>
      </div>
      <div class="border form-group col-md-12 uploads">
        <template v-if="images.length">
          <div
            v-for="(item, index) in images"
            :key="index"
            class="col-md-3 fileContainer"
          >
            <!-- <img :src="item" alt="image" class="preview" /> -->
            <img
              class="signature-img-notes preview"
              :id="`${item}`"
              @click="triggerDnotesModal(item, $event)"
              :src="item"
            />
          </div>
        </template>
      </div>
      <div class="form-group col-md-12">
        <button class="btn btn-primary action-button">
          Complete Order
          <span v-if="loading">
            <i class="fa fa-spinner fa-spin loader"></i
          ></span>
        </button>
      </div>
    </form>
    <TheUploadDnotesModal :order="orderNo" :image="modalImage" />
  </span>
</template>
<script>
import axios from 'axios';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
//
export default {
  name: 'TheCompleteOrderComponent',
  components: {
    TheUploadDnotesModal: () => import('./TheUploadDnotesModal'),
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: null,
      orderNo: this.order.order_details.order_no,
      reason: '',
      submitted: false,
      loading: false,
      isScannerLoaded: false,
      images: [],
      uploadedImages: [],
      dnotes: [],
      url: null,
      modalImage: '',
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
    triggerDnotesModal(image, e) {
      this.modalImage = image;
      $(`#${this.orderNo}`).modal('show');
      e.preventDefault();
    },
    upload(event) {
      if (this.formData === null) {
        this.formData = new FormData(this.$refs.form);
      }
      let url = null;
      for (const key in event.target.files) {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(key)) {
          const file = event.target.files[key];
          this.uploadedImages.push(file);
          url = URL.createObjectURL(file);
          this.images.push(url);
        }
      }
    },
    createFormData() {
      const imagesName = [];
      for (const key in this.uploadedImages) {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(key)) {
          const file = this.uploadedImages[key];
          const ext = file.type.split('/').pop();
          const filename = `${this.orderNo}1-delivery_note-${key}.${ext}`;
          this.formData.append(`files`, file, filename);
          imagesName.push(filename);
        }
      }
      const imageObject = {
        document_tag: 'delivery_note',
        images: imagesName,
        name: 'Delivery Note',
      };
      this.dnotes.push(imageObject);
    },
    // eslint-disable-next-line require-await
    async uploadToS3() {
      const notification = [];
      let actionClass = '';
      let status = false;
      const orderNo = this.orderNo;
      const createData = await this.createFormData();
      const formData = this.formData;

      const s3Details = JSON.stringify({
        bucket: 'sendy-delivery-signatures',
        path: 'rider_delivery_image',
      });

      const url = `${this.config.ADONIS_API}s3/upload?s3=${s3Details}`;
      const jwtToken = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: jwtToken,
        },
      };
      try {
        await axios.post(url, formData, config).then(response => {
          console.log('response images', response);
          if (response.status !== 204) {
            notification.push('Failed to upload dnotes');
            actionClass = 'danger';
          } else {
            status = true;
          }
        });
      } catch (error) {
        console.log('error', error.message);
        notification.push('Failed to upload dnotes');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
      return status;
    },
    // eslint-disable-next-line require-await
    async completeOrder() {
      const notification = [];
      let actionClass = '';
      const orderNo = this.orderNo;
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loading = true;
      const uploadDnotes = await this.uploadToS3();
      if (!uploadDnotes) {
        return;
      }
      const notify = await this.notifyOrdersApp();
      if (!notify) {
        return;
      }

      if (typeof notify !== 'undefined' && notify.status) {
        const payload = {
          app: 'ORDERS_APP',
          endpoint: 'rider_app_deliver',
          apiKey: true,
          params: {
            order_no: orderNo,
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
  width: 10em;
  border-radius: 5px;
  border: 1px dashed #d6d6d6;
  float: none;
  margin: 24% auto;
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
  height: 130px;
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
.fileContainer {
  overflow: hidden;
  position: relative;
}

.fileContainer [type='file'] {
  cursor: pointer;
  display: block;
  font-size: 999px;
  filter: alpha(opacity=0);
  min-height: 100%;
  min-width: 100%;
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: right;
  top: 0;
}
.preview {
  max-height: 110px;
}
</style>
