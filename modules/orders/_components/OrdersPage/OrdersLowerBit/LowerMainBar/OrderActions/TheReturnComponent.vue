<template>
  <div>
    <div :id="`response_${orderNo}_return`">
      <div :class="displayClass">
        <b>{{ notification }} </b>
      </div>
    </div>

    <table class="table table-bordered">
      <tbody>
        <tr>
          <td>One way:</td>
          <td
            v-html="showCurrencyBasedAmounts(order, paymentDetails.cost)"
          ></td>
        </tr>
        <tr>
          <td>Return:</td>
          <td
            v-html="showCurrencyBasedAmounts(order, paymentDetails.return_cost)"
          ></td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="
        moreData.errand_mode === 'one_way' && paymentDetails.cash_status === 1
      "
    >
      <p>
        Advice the user to place another order. <br />
        Making a cash order return from the customer care is
        <strong>currently</strong> not supported.
      </p>
    </div>
    <div
      v-if="
        moreData.errand_mode === 'one_way' && paymentDetails.cash_status !== 1
      "
    >
      <button class="btn btn-primary" @click="setAsReturn()">
        <span class="glyphicon glyphicon-retweet"></span> Set as return
      </button>
    </div>
    <div v-if="moreData.errand_mode === 'return'">
      <p>
        Order Already set as Return
      </p>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheReturnComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      orderCurrency: this.order.order_details.default_currency,
      paymentDetails: this.order.payment_details,
      moreData: this.order.order_details,
      notification: null,
      displayClass: null,
    };
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: 'orders/perform_order_action',
    }),
    async setAsReturn() {
      const notification = [];
      let actionClass = '';

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'return_order_cc',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 2,
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
