<template>
  <div>
    <div class="cancel-batch-dialog cancel-batch-action-section">
      <div class="batch-input-label batch-cancel-label">
        Why do you want to cancel?
      </div>
      <el-input
        type="textarea"
        class="batch-cancellation-reason"
        :rows="2"
        placeholder="Please input"
        v-model="cancel_reason"
      >
      </el-input>

      <el-button
        type="danger"
        class="action-submit-button"
        :class="
          !cancel_reason ? 'disabled-batch-order-btn' : 'cancel-batch-order-btn'
        "
        :disabled="!cancel_reason"
        @click="cancelOrder()"
      >
        Cancel order
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'Cancel',
  mixins: [NotificationMxn],
  props: ['details', 'page'],
  data() {
    return {
      cancel_reason: '',
    };
  },
  methods: {
    ...mapActions({
      perform_post_actions: 'fulfilment/perform_post_actions',
    }),
    ...mapMutations({
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    async cancelOrder() {
      // eslint-disable-next-line no-unreachable

      if (!this.cancel_reason) {
        this.doNotification(
          2,
          'Cancel Order Error',
          'Kindly provide cancellation reason',
        );
        return;
      }
      const order_type =
        this.page === 'Outbound_ordersView' ? 'Delivery' : 'Consignment';

      const payload = {
        app: 'AUTH',
        endpoint: 'mission-control-bff/orders/cancel',
        apiKey: false,
        params: {
          order_id: this.details.order_id,
          reason: this.cancel_reason,
          order_type,
          business_id: this.details.business.business_id,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Cancel Order',
            'Order has been cancelled successfully',
          );
          setTimeout(() => {
            this.updateProcessingStatus(true);
          }, 800);
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(res.data, 'errors')) {
            error_response = res.data.errors;
          } else {
            error_response = res.data.message;
          }
          this.doNotification(2, 'Cancel Order Error', error_response);
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
  },
};
</script>

<style lang="css" scoped></style>
