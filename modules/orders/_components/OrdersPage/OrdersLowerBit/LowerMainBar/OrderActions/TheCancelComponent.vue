<template>
  <div>
    <div :id="`response_${orderNo}_cancel`" v-html="notifications"></div>
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="error in errors" :key="error.index">
          <b>{{ error }}</b>
        </li>
      </ul>
    </div>
    <form id="cancel-form" @submit.prevent="cancelOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          label="reason"
          :placeholder="getSelectorPlaceholder"
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
import { mapState, mapActions } from 'vuex';

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
    ...mapActions({
      cancel_order: '$_orders/cancel_order',
    }),
    async cancelOrder() {
      if (!this.reason) {
        this.errors.push('Cancellation reason required.');
      }
      if (!this.description) {
        this.errors.push('Cancellation description required.');
      }

      if (this.reason && this.description) {
        this.errors = [];
        const payload = {
          cancel_reason_id: this.reason,
          order_no: this.orderNo,
          reason_description: this.description,
        };
        try {
          const data = await this.cancel_order(payload);
          this.notifications = this.display_notification(
            data.reason,
            data.status,
          );
        } catch (error) {
          this.errors.push(
            'Something went wrong. Try again or contact Tech Support',
          );
        }
      }
    },
  },
};
</script>
