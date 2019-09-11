<template>
  <div class="body-box">
    <div v-if="quotes === null">
      Requesting Quotes ...
    </div>
    <div v-if="status">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th>Partner</th>
            <th>Phone Number</th>
            <th>Quotation</th>
            <th>Vehicle</th>
            <th>Actions</th>
          </tr>
          <template v-for="quote in quotes">
            <tr
              @click="toggle(quote.order_bid_id)"
              :class="{ opened: opened.includes(quote.order_bid_id) }"
              :key="quote.order_bid_id"
            >
              <td>{{ quote.owner_name }}</td>
              <td>{{ quote.owner_phone }}</td>
              <td>{{ quote.bid_amount }}</td>
              <td>{{ quote.registration_no }}</td>
              <td>
                <button
                  id="accept-quote-btn"
                  class="btn btn-primary qoute--btn-accept"
                  @click="acceptQoute(quote)"
                >
                  Accept Qoute
                </button>
              </td>
            </tr>
            <tr v-if="opened.includes(quote.order_bid_id)" :key="quote.index">
              <td colspan="5">
                <div class="qoute--details-wrap">
                  <div class="qoute--vehicle-details">
                    <div class="qoute--vehicle-details-title">
                      Driver
                    </div>
                    <div class="qoute--vehicle-details-description">
                      {{ quote.rider_name }} - {{ quote.rider_phone }}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else>
      No Bidding records available for order...
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheQuotesComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      opened: [],
      orderNo: this.order.order_details.order_no,
      status: false,
      quotes: null,
      notification: null,
    };
  },
  mounted() {
    this.quoteListRequest();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      request_quotes_list: '$_orders/request_quotes_list',
      perform_order_action: '$_orders/perform_order_action',
    }),
    async quoteListRequest() {
      const payload = {
        app: 'NODE_PRIVATE_API',
        endpoint: 'list_order_bids',
        apiKey: false,
        params: { order_no: this.orderNo },
      };

      try {
        const response = await this.request_quotes_list(payload);
        this.status = response.data.status;
        this.quotes = response.data.data;
        console.log('quotes', response.data.data);
      } catch (error) {
        this.notification = 'Failed to retrieve bidding records';
        this.quotes = this.notification;
      }
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    async acceptQoute(quote) {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'bid_cc',
        apiKey: true,
        params: {
          order_no: quote.order_no,
          action_id: 24,
          bid_amount: quote.bid_amount,
          currency: quote.currency,
          order_bid_id: quote.order_bid_id,
          currency: quote.currency,
          owner_id: quote.owner_id,
          registration_no: quote.registration_no,
          rider_id: quote.rider_id,
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
table {
  width: 100%;
  border: 1px solid #ccc;
}

td {
  padding: 2px;
  border: 1px solid #ccc;
}

.opened {
  background-color: #fdfdfd;
}
.qoute--btn-accept {
  height: 30px;
  padding-top: 2px;
  font-size: 12px;
  width: 100px;
}
</style>
