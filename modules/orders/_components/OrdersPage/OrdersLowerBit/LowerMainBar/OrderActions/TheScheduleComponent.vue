<template>
  <div>
    <div :id="`response_${orderNo}_schedule`">
      <div :class="displayClass">
        <b>{{ notification }} </b>
      </div>
    </div>
    <form id="dispatch-form" @submit.prevent="setAsReturn">
      <div class="form-group">
        <datetime
          format="YYYY-MM-DD H:i:s"
          width="300px"
          placeholder="2015-12-20 15:15:15"
          v-model="scheduleTime"
        ></datetime>
      </div>
      <div class="form-group">
        <textarea
          class="form-control rounded-0"
          :id="`schedule_reason_${orderNo}`"
          placeholder="Description"
          v-model="scheduleDesription"
        ></textarea>
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
      displayClass: null,
      scheduleTime: '',
      scheduleDesription: '',
    };
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setErrors',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    async setAsReturn() {
      // eslint-disable-next-line prefer-const
      let err = [];
      if (!this.scheduleDesription) {
        err.push('Re-Scheduling reason is required.');
      }
      if (!this.scheduleTime) {
        err.push('Re-Scheduling time is required.');
      }
      this.updateErrors(err);
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
      const data = await this.perform_order_action(payload);
      console.log('datad', data);
      //   const msgClass = this.display_order_action_notification(data.status);
      //   this.displayClass = msgClass;
      //   return (this.notification = data.reason);
    },
  },
};
</script>
<style scoped>
.datetime-picker {
  width: 100% !important;
}
</style>
