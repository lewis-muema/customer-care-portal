<template>
  <section>
    <div v-if="!riderDeliverImg || riderDeliverImg.length === 0">
      No docs found for this delivery
    </div>
    <div v-else class="holder">
      <div class="form-inline" v-for="img in riderImages" :key="img.index">
        <div class="delivery-images__header col-md-12">
          <h3 class="text-center">
            <strong>{{ ` Delivery at waypoint ${img.waypoint_no} ` }}</strong>
          </h3>
          <hr />
        </div>
        <div class="col-md-6">
          <h5>Signature</h5>
          <div class="signature-image">
            <span v-if="isSendyStaff(img.name)" class="signature-text">
              <br />
              <h5 v-if="!isDnoteUpload(img.name)">
                Order completed from cc portal
              </h5>
              <h5 v-if="isDnoteUpload(img.name)">
                Dnote(s) uploaded from cc portal by
                <strong>{{ trimString(img.name) }}</strong>
              </h5>
            </span>
            <span v-else>
              <img
                class="signature-img"
                src="~/assets/images/noimage.png"
                alt="image-missing"
              />
            </span>
          </div>
        </div>
        <div class="col-md-4">
          <strong> Order Signed By: </strong>
          <span v-if="!isDnoteUpload" class="">{{
            img.name !== '' ? img.name : 'Not Set'
          }}</span>
          <span v-if="isDnoteUpload" class="">
            Not Set
          </span>

          <br />
          <strong> Phone Number:</strong>
          <span v-if="!isDnoteUpload" class="">{{
            img.phone_no !== '' ? img.phone_no : 'Not Set'
          }}</span>
          <span v-if="isDnoteUpload" class="">
            Not Set
          </span>
        </div>
        <div class="col-md-12">
          <h5>Delivery Notes</h5>
        </div>
        <div class="col-md-3" v-for="image in img.images" :key="image.index">
          <div class="signature-image">
            <img
              v-if="image"
              class="signature-img-notes"
              :id="`${image}`"
              @click="triggerDnotesModal(image, $event)"
              :src="`${s3Path}${image}`"
              alt="disputed-document"
            />
            <img
              v-else
              class="signature-img"
              src="~/assets/images/noimage.png"
              alt="no document image"
            />
          </div>
        </div>
      </div>
    </div>
    <DeliveryDetailsModals
      :image="modalImage"
      :order="orderNo"
      :path="s3Path"
    />
    <DeliveryDetailsForm :order="order" />
  </section>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheDeliveryDetailsComponent',
  components: {
    DeliveryDetailsModals: () => import('./DeliveryDetailsModals'),
    DeliveryDetailsForm: () => import('./TheDeliveryDetailsForm'),
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modalImage: '',
      orderDetails: this.order,
      orderNo: this.order.order_details.order_no,
      riderDeliverImg: this.order.delivery_details.delivery_images,
      riderID: this.order.rider_details.rider_id,
      dispute_status: this.order.order_details.dispute_status,
      errors: [],
      notifications: '',
      options: [
        { code: '1', reason: 'A delivery document is missing' },
        { code: '2', reason: 'The delivery document is not clear' },
        { code: '3', reason: 'The delivery document is not valid' },
      ],
      optionz: [
        { code: '1', reason: 'The delivery document is there' },
        { code: '2', reason: 'The delivery document is clear' },
        { code: '3', reason: 'The delivery document is valid' },
      ],
      reason: '',
      description: '',
      submitted: false,
      switched: true,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['config']),

    ...mapState(['userData']),
    actionUser() {
      return this.session.payload.data.name;
    },
    riderImages() {
      const riderDeliverImg = this.riderDeliverImg;
      let filtered = riderDeliverImg;
      if (riderDeliverImg.length > 1) {
        // eslint-disable-next-line func-names
        filtered = riderDeliverImg.filter(function(el) {
          return el.images.length !== 0;
        });
      }
      return filtered;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: 'orders/perform_order_action',
    }),
    triggerDnotesModal(image, e) {
      this.modalImage = image;
      $(`#${this.orderNo}`).modal('show');
      e.preventDefault();
    },
    trimString(string) {
      const new_string = string.replace('- upload', '');
      return new_string;
    },
  },
};
</script>
<style scoped>
.signature-image {
  border: 2px solid #f8f8f8;
  height: 200px;
  overflow: auto;
  width: 100%;
}
.signature-img {
  max-width: 60%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.signature-img-notes {
  max-width: 100%;
}
.form-inline {
  background: #ffffff;
  /* border: 2px solid #cccccc; */
  margin-bottom: 15px;
}
.holder {
  background: #f8f8f8;
  padding: 7px;
}
.signature-text {
  text-align: center;
}
.signature-text h5 {
  margin-top: 34px;
  font-size: 13px;
  font-weight: 700;
}
</style>
