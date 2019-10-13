<template>
  <div>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Errand mode</td>
          <td>
            {{ moreData.errand_mode === 'one_way' ? 'One way' : 'Return' }}
          </td>
        </tr>
        <tr>
          <td>Order Amount</td>
          <td
            v-html="
              showCurrencyBasedAmounts(
                orderDetails,
                currencyConversions,
                calculatedOrderAmount,
              )
            "
          ></td>
        </tr>
        <tr
          v-if="
            paymentDetails.economy_order_cost &&
              riderDetails.vendor_type_id !== 25
          "
        >
          <td>Standard Order Cost</td>
          <td
            v-html="
              showCurrencyBasedAmounts(
                orderDetails,
                currencyConversions,
                paymentDetails.economy_order_cost,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Extra distance amount</td>
          <td
            v-html="
              display_conditional_amounts(
                orderDetails,
                currencyConversions,
                paymentDetails.extra_distance_amount,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Waiting time amount</td>
          <td
            v-html="
              display_conditional_amounts(
                orderDetails,
                currencyConversions,
                paymentDetails.waiting_time_amount,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Distance</td>
          <td>
            {{ moreData.distance_read }}
            kms
          </td>
        </tr>
        <tr>
          <td>Vendor Type</td>
          <td>{{ determine_vendor_name(riderDetails.vendor_type_id) }}</td>
        </tr>
        <tr
          v-if="
            riderDetails.vendor_type_id === 20 && moreData.confirm_status > 0
          "
        >
          <td>Capacity of truck</td>
          <td>{{ riderDetails.load_capacity }} Tonnes</td>
        </tr>
        <tr v-if="riderDetails.vendor_type_id === 20">
          <td>Weight of Load</td>
          <td>{{ moreData.load_weight }} Tonnes</td>
        </tr>
        <tr>
          <td>Loaders needed</td>
          <td>{{ loaderDisplay }}</td>
        </tr>
        <tr></tr>

        <tr>
          <td>Delivery Locations</td>
          <td>{{ moreData.way_points }}</td>
        </tr>
        <tr>
          <td>Rider amount</td>
          <td
            v-html="
              display_conditional_amounts(
                orderDetails,
                currencyConversions,
                riderDetails.rider_cost,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Insurance Amount</td>
          <td
            v-html="
              showCurrencyBasedAmounts(
                orderDetails,
                currencyConversions,
                paymentDetails.insurance_amount,
              )
            "
          ></td>
        </tr>

        <tr>
          <td>Sendy Fee</td>
          <td
            v-html="
              showCurrencyBasedAmounts(
                orderDetails,
                currencyConversions,
                paymentDetails.sendy_fee,
              )
            "
          >
            ?>
          </td>
        </tr>
        <tr>
          <td>Rider cost</td>
          <td
            v-html="
              display_conditional_amounts(
                orderDetails,
                currencyConversions,
                riderDetails.rider_cost,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Cash Status</td>
          <td>
            {{ paymentDetails.cash_status ? 'Yes' : 'No' }}
          </td>
        </tr>
        <tr>
          <td>Cash to collect</td>
          <td
            v-html="
              display_cash_to_collect(
                orderDetails,
                currencyConversions,
                paymentDetails.cash_to_collect,
                paymentDetails.cash_status,
              )
            "
          ></td>
        </tr>
        <tr>
          <td>Carrier type</td>
          <td>{{ display_carrier_type(moreData.carrier_type) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheOrderComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
      riderDetails: false,
      paymentDetails: false,
      moreData: false,
      clientDetails: false,
      calculatedOrderAmount: false,
      currencyConversions: this.rates,
    };
  },
  computed: {
    loaderDisplay() {
      const loaders = this.moreData.no_of_loaders;
      return Number(loaders) === 0 ? '-' : loaders;
    },
  },
  mounted() {
    this.riderDetails = this.orderDetails.rider_details;
    this.paymentDetails = this.orderDetails.payment_details;
    this.moreData = this.orderDetails.order_details;
    this.clientDetails = this.orderDetails.client_details;

    this.calculatedOrderAmount = this.determineOrderAmounts(
      this.paymentDetails.order_amount,
      this.riderDetails.vendor_type_id,
      this.paymentDetails.fixed_cost,
      this.paymentDetails.customer_min_amount,
      this.moreData.confirm_status,
    );
  },
  methods: {
    display_cash_to_collect(
      orderDetails,
      currencyConversions,
      amount,
      cashStatus,
    ) {
      let displayAmount = 0;
      const convertedAmount = this.showCurrencyBasedAmounts(
        orderDetails,
        currencyConversions,
        amount,
      );
      if (cashStatus) {
        displayAmount = convertedAmount;
      }
      return displayAmount;
    },
    display_carrier_type(carrier_type) {
      let type = 'Any';
      if (carrier_type === 0) {
        type = 'No Box';
      } else if (carrier_type === 1) {
        type = 'Box';
      }
      return type;
    },
  },
};
</script>
