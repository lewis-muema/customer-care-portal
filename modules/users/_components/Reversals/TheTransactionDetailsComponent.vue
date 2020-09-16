<template>
  <div v-if="reversalCategory === 'reversal'">
    <p>
      <span class="p-label">Total Credit Amount </span>:
      <span class="p-data">
        {{ transactionDetails.currency }}
        {{ transactionDetails.total_credit_amount }}</span
      >
    </p>
    <p>
      <span class="p-label">Total Debit Amount </span>:
      <span class="p-data">
        {{ transactionDetails.currency }}
        {{ transactionDetails.total_debit_amount }}</span
      >
    </p>
    <p v-if="transactionDetails.order">
      <span class="p-label">OrderNo. </span>:
      <span class="p-data">
        {{ transactionDetails.order_info.order_no }}
      </span>
    </p>
    <p v-if="transactionDetails.order">
      <span class="p-label">Date </span>:
      <span class="p-data">
        {{
          this.getOrderFormattedDate(
            transactionDetails.order_info.date,
            'dddd. hh:mm a Do MMM, YYYY',
          )
        }}</span
      >
    </p>
  </div>
  <div v-else>
    <p>
      <span class="p-label">Total Invoice Amount </span>:
      <span class="p-data">
        {{ transactionDetails.currency }}
        {{ transactionDetails.invoice_amount }}</span
      >
    </p>
    <p>
      <span class="p-label">Total VAT Amount </span>:
      <span class="p-data">
        {{ transactionDetails.currency }}
        {{ transactionDetails.vat_amount }}</span
      >
    </p>
  </div>
</template>
<script>
export default {
  name: 'TransactionsDetails',
  props: ['transactionDetails', 'reversalCategory'],
};
</script>
