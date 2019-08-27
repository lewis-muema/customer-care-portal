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
};
</script>
