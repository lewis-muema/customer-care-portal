<template>
  <table class="table table-bordered">
    <tbody>
      <tr>
        <td>Name</td>
        <td>ETA (mins)</td>
        <td>Discount</td>
        <td>Cost</td>

        <td>Return cost</td>
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
        <td>{{ tier.eta / 60 }}</td>
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
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'ThePriceTiersComponent',
  props: {
    orderdetails: {
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
      orderDetails: this.orderdetails,
      priceTiers: this.orderdetails.price_tiers,
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
  },
};
</script>
