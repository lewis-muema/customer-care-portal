<template>
  <div>
    <div :id="`response_${orderNo}_dispatch`"></div>
    <form id="dispatch-form" @submit.prevent="dispatchOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          label="reason"
          :placeholder="getSelectorPlaceholder"
          :id="`dispatch_reason_${orderNo}`"
          v-model="reason"
        >
        </v-select>
      </div>
      <div class="form-group">
        <p>The order will be broadcasted to all the riders near the pickup</p>
      </div>
      <button class="btn btn-primary action-button">
        Dispatch Order
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheDispatchComponent',
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
        { code: '2', reason: 'Rider without a box' },
        { code: '11', reason: 'Rider Unreachable' },
        { code: '12', reason: 'Rider rejected' },
      ],
      placeholderItem: 'select reason for dispatching ..', // find value in selector items
      reason: '',
      description: '',
    };
  },
  computed: {
    ...mapState(['userData', 'errors', 'notification']),

    getSelectorPlaceholder() {
      return this.placeholderItem;
    },
  },
  methods: {
    ...mapMutations({
      updateNotification: 'setNotification',
      updateErrors: 'setErrors',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    // eslint-disable-next-line require-await
    async dispatchOrder() {
      let err = [];
      if (!this.reason) {
        err.push('Dispatch reason is required.');
      }
      this.updateErrors(err);

      if (this.reason) {
        err = [];
        const batchNo = this.order.order_details.batch_no;
        const payload = {
          app: 'ORDERS_APP',
          endpoint: 'dispatch_order_cc',
          apiKey: true,
          params: {
            order_no: this.orderNo,
            batch_no: batchNo !== null ? batchNo : '',
            action_id: 6,
          },
        };
        // try {
        const data = await this.perform_order_action(payload);
        this.notifications = this.display_notification(
          data.reason,
          data.status,
        );
        // } catch (error) {
        // this.errors.push(
        //   'Something went wrong. Try again or contact Tech Support',
        // );
        // }
      }
    },
  },
};
</script>
