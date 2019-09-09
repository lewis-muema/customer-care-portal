<template>
  <div class="col-sm-12">
    <form @submit.prevent="increaseProximity">
      <div class="form-group">
        <textarea
          type="text"
          v-model="params.reason_description"
          :id="`proximity_reason_${orderNo}`"
          name="reason"
          placeholder="Reason for increasing proximity"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.params.reason_description.$error,
          }"
        >
        </textarea>
        <div
          v-if="submitted && !$v.params.reason_description.required"
          class="invalid-feedback"
        >
          Reason is required
        </div>
      </div>
      <div class="form-group">
        <textarea
          type="text"
          v-model="params.current_driver_location"
          :id="`proximity_rider_location_${orderNo}`"
          name="current_driver_location"
          class="form-control"
          placeholder="Current rider location"
          :class="{
            'is-invalid': submitted && $v.params.current_driver_location.$error,
          }"
        >
        </textarea>
        <div
          v-if="submitted && !$v.params.current_driver_location.required"
          class="invalid-feedback"
        >
          Rider Location is required
        </div>
      </div>

      <div class="form-group">
        <v-select
          :options="options"
          :reduce="point => point.code"
          name="point"
          label="reason"
          placeholder="Select proximity point .."
          class="form-control proximity-point"
          :id="`proximity_point_${orderNo}`"
          v-model="params.point"
          :class="{
            'is-invalid': submitted && $v.params.point.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.params.point.required"
          class="invalid-feedback"
        >
          Proximity point is required
        </div>
      </div>
      <div class="form-group">
        <input
          type="text"
          v-model="params.vendorTypeID"
          :id="`proximity_vendorTypeID_${orderNo}`"
          name="vendorTypeID"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.params.vendorTypeID.$error,
          }"
        />
        <div
          v-if="submitted && !$v.params.vendorTypeID.required"
          class="invalid-feedback"
        >
          Vendor Type ID required
        </div>
      </div>
      <div class="form-group">
        <input
          type="text"
          v-model="params.errandMode"
          :id="`proximity_errandMode_${orderNo}`"
          name="errandMode"
          class="form-control"
          :class="{ 'is-invalid': submitted && $v.params.errandMode.$error }"
        />
        <div
          v-if="submitted && !$v.params.errandMode.required"
          class="invalid-feedback"
        >
          Errand Mode required
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary action-button">
          Submit
        </button>
      </div>
    </form>
    <div></div>
  </div>
</template>
<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'TheProximityComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      vendorTypeID: this.order.rider_details.vendor_type_id,
      errandMode: this.order.order_details.errand_mode,

      options: [
        { code: '1', reason: 'Pickup' },
        { code: '2', reason: 'Destination' },
      ],
      pickupPoximity: {
        1: { pick_up: 5000, destination: 2 },
        21: { pick_up: 5000, destination: 2 },
        2: { pick_up: 10000, destination: 2 },
        3: { pick_up: 10000, destination: 2 },
      },
      destinationPoximity: {
        1: { destination: 5000, pick_up: 2 },
        21: { destination: 5000, pick_up: 2 },
        2: { destination: 10000, pick_up: 2 },
        3: { destination: 10000, pick_up: 2 },
      },
      params: {
        reason_description: '',
        current_driver_location: '',
        point: '',
        vendorTypeID: this.order.rider_details.vendor_type_id,
        errandMode: this.order.order_details.errand_mode,
      },
      submitted: false,
    };
  },
  mounted() {
    // console.log('jkhgfdgh');
  },
  validations: {
    params: {
      reason_description: { required },
      current_driver_location: { required },
      point: { required },
      vendorTypeID: { required },
      errandMode: { required },
    },
  },
  methods: {
    increaseProximity(e) {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'cancel_order',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 1,
          cancel_reason_id: this.reason,
          reason_description: this.description,
        },
      };
      let points = null;
      if (Number(this.params.point) === 1) {
        points = this.pickupPoximity;
      } else {
        points = this.destinationPoximity;
      }
      console.log(this.vendorTypeID, points[this.vendorTypeID]);

      console.log('his.$v.$invalid', this.$v.$invalid);
      console.log(`SUCCESS!! :-)\n\n${JSON.stringify(this.params)}`);
    },
  },
};
</script>
<style scoped>
.form-control {
  height: 40px;
}
.proximity-point {
  padding: 0px !important;
}
</style>
