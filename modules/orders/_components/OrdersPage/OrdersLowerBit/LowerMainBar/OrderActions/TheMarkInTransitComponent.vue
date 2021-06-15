<template>
  <form id="mark-transit-form" @submit.prevent="markInTransit">
    <div class="mark-transit">
      <h5>The button below will set the order to In Transit status</h5>
      <br />
    </div>
    <button class="btn btn-primary action-button">
      Mark Order In Transit
    </button>
  </form>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheMarkInTransitComponent',
  props: {
    order: {
      type: Object,
      required: true,
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
    async markInTransit() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'rider_app_pick_up',
        apiKey: true,
        params: {
          order_no: this.order.order_details.order_no,
          rider_phone: this.order.rider_details.phone_no,
          sim_card_sn: this.order.rider_details.serial_no,
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
</script>
<style scoped>
.mark-transit h5 {
  font-size: 14px;
}
</style>
