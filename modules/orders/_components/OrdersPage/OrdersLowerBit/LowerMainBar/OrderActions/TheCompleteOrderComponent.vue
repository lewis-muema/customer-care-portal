<template>
  <span>
    <form
      class="form-inline"
      @submit.prevent="completeOrder"
      ref="form"
      enctype="multipart/form-data"
    >
      {{ loading }}
      <div class="col-md-12 uploads text-primary">
        Maximum Dnote size is 10mb. Resize the Dnote if this limit is exceeded.
      </div>
      <div class="form-group col-md-12">
        <label class="reason">Reason</label>
        <textarea
          type="text"
          v-model="reason"
          :id="`completion_reason_${orderNo}`"
          name="reason"
          class="form-control"
          placeholder="Order completion reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </textarea>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
          Order Completion Reason is required
        </div>
      </div>

      <div class="form-group col-md-6 bill-check">
        <input
          type="radio"
          v-model="dnotesRequired"
          :id="`dnotesRequired_true_${orderNo}`"
          name="dnotesRequired"
          class=" radio form-control"
          value="yes"
          :class="{
            'is-invalid': submitted && $v.dnotesRequired.$error,
          }"
        />
        <label class="charge_commission--label">
          &nbsp; Requires Delivery Notes</label
        >
        <div
          v-if="submitted && !$v.dnotesRequired.required"
          class="invalid-feedback"
        >
          Delivery Notes option is required
        </div>
      </div>
      <div class="form-group col-md-6 bill-check">
        <input type="radio" v-model="dnotesRequired" value="no" />
        <label class="charge_commission--label">
          &nbsp;Does not require Delivery Notes</label
        >
      </div>
      <div v-if="submitted && dnotesRequired === null" class="invalid-feedback">
        dnotesRequired required
      </div>
      <div
        class="form-group col-md-12"
        :id="`delivery_container_${orderNo}`"
        v-if="dnotesRequired === 'yes'"
      >
        <label class="col-md-12 uploads">Submit Delivery Notes</label>
        <div v-if="largeImageUploading" class="col-md-12 uploads text-primary">
          {{ largeImage }} is bigger that 10mb. Compressing file
          <i class="fa fa-spinner fa-spin"></i>
        </div>
        <div
          class="upload-container col-md-6"
          :id="`delivery_images_${orderNo}`"
        >
          <div
            class="scan-container"
            :class="{
              'dnotes-is-invalid':
                submitted && dnotesRequired === 'yes' && images.length === 0,
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
      largeImageUploading: false,
      largeImage: '',
      dnotes: [],
      url: null,
      modalImage: '',
      dnotesRequired: null,
    };
  },
  validations: {
    reason: { required },
    dnotesRequired: { required },
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
      log_cc_action: 'log_cc_action',
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
          const fileSize = file.size / 1000000;
          if (fileSize > 10) {
            this.handleFiles(file);
          } else {
            this.uploadedImages.push(file);
          }
          url = URL.createObjectURL(file);
          this.images.push(url);
        }
      }
    },
    handleFiles(file) {
      const ext = file.type.split('/').pop();
      const filename = file.name;
      const lastModified = file.lastModified;
      const type = file.type;
      this.largeImage = filename;
      this.largeImageUploading = true;

      const img = document.createElement('img');
      const reader = new FileReader();
      reader.onload = e => {
        img.src = e.target.result;
        if (img !== null || img !== '') {
          img.onload = n => {
            const canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataurl = canvas.toDataURL('image/png');
            const bytes =
              dataurl.split(',')[0].indexOf('base64') >= 0
                ? atob(dataurl.split(',')[1])
                : '';

            const mime = dataurl
              .split(',')[0]
              .split(':')[1]
              .split(';')[0];
            const max = bytes.length;
            const ia = new Uint8Array(max);
            for (let i = 0; i < max; i++) {
              ia[i] = bytes.charCodeAt(i);
            }

            const newImageFileFromCanvas = new File([ia], filename, {
              type: mime,
              lastModified,
            });

            this.uploadedImages.push(newImageFileFromCanvas);
            this.largeImageUploading = false;
          };
        }
      };
      reader.readAsDataURL(file);
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

      for (const [name, value] of formData) {
        formData.delete('files[]');
      }
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
          if (response.status !== 204) {
            notification.push('Failed to upload dnotes');
            actionClass = 'danger';
          } else {
            status = true;
          }
        });
      } catch (error) {
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
      const uploadDnotes =
        this.dnotesRequired === 'yes' ? await this.uploadToS3() : true;
      if (!uploadDnotes) {
        this.loading = false;
        return;
      }
      const notify = await this.notifyOrdersApp();
      if (!notify) {
        this.loading = false;
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
          if (data.status) {
            const log = await this.logAction();
          }
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        } catch (error) {
          notification.push(
            'Failed to complete order. Try again or contact Tech Support',
          );
          actionClass = 'danger';
        }
        await this.updateClass(actionClass);
        await this.updateErrors(notification);
        this.loading = false;
      }
    },
    async logAction() {
      const logspayload = {
        order_no: this.orderNo,
        reason: this.reason,
      };
      const data = await this.log_cc_action(logspayload);
      return data.status;
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
        this.loading = false;
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    setDnoteRequirements(status) {
      this.dnotesRequired = status;
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
.form-inline .radio {
  width: 4%;
}
.radio:focus {
  border: 2px solid red;
}
.text-primary {
  color: #3c8dbc !important;
}
</style>
