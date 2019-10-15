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
        <td>{{ determineETA(eta.etc, 'DD/MM/YYYY hh.mm a ') }}</td>
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
    test() {
      console.log('this is the price tiers', this.ETA);
    },
    determineETA() {},
  },
};
</script>
