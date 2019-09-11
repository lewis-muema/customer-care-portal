<template>
  <div>
    <form id="cancel-form" @submit.prevent="cancelOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          label="reason"
          placeholder="Select Reason for cancelling..."
          :id="`cancel_reason_${orderNo}`"
          v-model="reason"
        >
        </v-select>
      </div>
      <div class="form-group">
        <textarea
          class="form-control rounded-0"
          :id="`cancel_description_${orderNo}`"
          placeholder="Description"
          v-model="description"
        ></textarea>
      </div>
      <button class="btn btn-primary action-button">
        Cancel Order
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheCancelComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      errors: [],
      notifications: '',
      options: [
        { code: '1', reason: 'No partner' },
        { code: '2', reason: 'Delay' },
        { code: '3', reason: 'Customer error' },
      ],
      placeholderItem: 'select reason for cancelling ..', // find value in selector items
      reason: '',
      description: '',
    };
  },
  computed: {
    ...mapState(['userData']),

    getSelectorPlaceholder() {
      return this.placeholderItem;
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
    myFunction(item, index, arr) {
      arr[index] = item;
      console.log('arr', arr);
    },
    async cancelOrder() {
      let err = [];
      let actionClass = '';

      if (!this.reason) {
        err.push('Cancellation reason is required.');
        actionClass = 'danger';
      }
      if (!this.description) {
        err.push('Cancellation description is required.');
        actionClass = 'danger';
      }

      if (err.length === 0) {
        err = [];
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
        try {
          const data = await this.perform_order_action(payload);

          err.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        } catch (error) {
          err.push('Something went wrong. Try again or contact Tech Support');
          actionClass = 'danger';
        }
      }
      this.updateClass(actionClass);
      this.updateErrors(err);
    },
  },
};
</script>
