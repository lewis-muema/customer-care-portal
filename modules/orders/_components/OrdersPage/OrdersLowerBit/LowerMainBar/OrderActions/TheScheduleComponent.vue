<template>
  <div>
    <form id="dispatch-form" @submit.prevent="rescheduleOrder">
      <div class="form-group">
        <VueCtkDateTimePicker
          class="pick-delivery-docs-date form-control"
          v-model="time"
          formatted="YYYY-MM-DD HH:mm:00"
          format="YYYY-MM-DD HH:mm:00 "
          output-format="YYYY-MM-DD HH:mm:00"
          label="Schedule Date"
          hint=""
          :no-header="true"
          :no-button-now="true"
          input-size="sm"
          :class="{
            'is-invalid': submitted && $v.time.$error,
          }"
        />
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
    async rescheduleOrder() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const notification = [];
      let actionClass = '';

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'reschedule_order_cc',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 6,
          date_time: this.convertGMTToUTC(this.time).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
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
//
</script>

<style scoped>
.pick-delivery-docs-date {
  margin-right: 1%;
  height: 45px;
  border-style: solid;
  border-width: 0.2px;
  border-color: #cccccc;
  padding-left: 0;
}
.header-picker[data-v-6d49f11d] {
  display: none !important;
}
datepicker-controls {
  background: #3c8dbc !important;
}
.header-picker {
  padding: 0 !important;
  background-color: #fff !important;
  display: none !important;
}
.datetimepicker .datepicker {
  min-width: 372px !important;
  width: 376px !important;
}
textarea.form-control {
  height: auto;
  width: 98%;
}
</style>
