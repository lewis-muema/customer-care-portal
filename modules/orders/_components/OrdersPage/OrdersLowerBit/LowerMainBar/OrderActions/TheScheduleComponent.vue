<template>
  <div>
    <form id="dispatch-form" @submit.prevent="setAsReturn">
      <div class="form-group">
        <datetime
          format="YYYY-MM-DD H:i:s"
          width="300px"
          v-model="time"
          :id="`schedule_time_${orderNo}`"
          name="time"
          placeholder="2015-12-20 15:15:15"
          class="form-control  proximity-point"
          :class="{
            'is-invalid': submitted && $v.time.$error,
          }"
        >
        </datetime>
        <div v-if="submitted && !$v.time.required" class="invalid-feedback">
          Scheduled time is required
        </div>
      </div>

      <div class="form-group">
        <textarea
          type="text"
          v-model="description"
          :id="`schedule_description_${orderNo}`"
          name="reason"
          placeholder="Reason for Scheduling"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.description.$error,
          }"
        >
        </textarea>
        <div
          v-if="submitted && !$v.description.required"
          class="invalid-feedback"
        >
          Description is required
        </div>
      </div>
      <button class="btn btn-primary action-button">
        Schedule Order
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import datetime from 'vuejs-datetimepicker';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheScheduleComponent',
  components: { datetime },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      paymentDetails: this.order.payment_details,
      moreData: this.order.order_details,
      notification: null,
      displayClass: '',
      time: '',
      description: '',
      submitted: false,
    };
  },
  validations: {
    time: { required },
    description: { required },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    setAsReturn() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const currentDate = moment().toDate();
      const notification = [];
      const actionClass = '';

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'reschedule_order_cc',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 6,
          date_time: this.scheduleTime,
          reallocation_description: this.scheduleDesription,
          reallocation_reason_id: 1,
        },
      };
    },
  },
};
</script>
<style scoped>
.datetime-picker {
  width: 100% !important;
}
input[data-v-4bd11526] {
  height: 40px !important;
}
</style>
