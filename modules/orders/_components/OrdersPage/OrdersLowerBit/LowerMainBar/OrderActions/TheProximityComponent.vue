<template>
  <div class="col-sm-12">
    <div>
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
              'is-invalid':
                submitted && $v.params.current_driver_location.$error,
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
            label="reason"
            placeholder="Select proximity point .."
            :id="`proximity_point_${orderNo}`"
            v-model="params.point"
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
    </div>
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
      options: [
        { code: '1', reason: 'Pickup' },
        { code: '2', reason: 'Destination' },
      ],
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

      console.log(`SUCCESS!! :-)\n\n${JSON.stringify(this.params)}`);
    },
  },
};
</script>
