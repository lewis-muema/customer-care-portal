<template>
  <table class="table table-bordered">
    <tbody>
      <tr>
        <td>Name</td>
        <td>ETA (mins)</td>
        <td>Discount</td>
        <td>Cost</td>

        <td>Return cost</td>
        <td>cost</td>
      </tr>
      <tr
        v-for="tier in priceTiers"
        :key="tier.index"
        :class="determine_class(tier.best_option)"
      >
        <td>
          {{ tier.tier_name }}
          <span v-if="tier.best_option" class="badge bg-green pull-right">
            Best option
          </span>
        </td>
        <td>45</td>
        <td
          v-html="
            showCurrencyBasedAmounts(orderDetails, rates, tier.discount_amount)
          "
        ></td>
        <td
          v-html="showCurrencyBasedAmounts(orderDetails, rates, tier.cost)"
        ></td>
        <td
          v-html="
            showCurrencyBasedAmounts(orderDetails, rates, tier.return_cost)
          "
        ></td>
        <td>{{ test() }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ThePriceTiersComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
    eta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
      priceTiers: this.order.price_tiers,
      orderNo: this.order.order_details.order_no,
      ETA: this.eta,
    };
  },

  methods: {
    determine_class(bestOption) {
      let rowClass = null;
      if (bestOption) {
        rowClass = 'new_row_heree';
      }
      return rowClass;
    },
    displayDateTime(date) {
      let displayString = '--';
      if (typeof date !== 'undefined') {
        displayString = this.getOrderFormattedDate(date, 'h.mm a Do MMM, YYYY');
      }
      return displayString;
    },
    displayDateRange(dateRange) {
      let displayString = '--';
      if (typeof dateRange !== 'undefined') {
        const range = dateRange.split('to');

        const eta_split = dateRange.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const timeFrom = this.getFormattedDate(start, 'Do MMM, YYYY hh.mm a');
        const timeTo = this.getFormattedDate(end, 'Do MMM, YYYY hh.mm a');
        displayString = `${timeFrom} - ${timeTo}`;
      }
      return displayString;
    },
  },
};
</script>
