<template>
  <div class="body-box">
    <div v-if="payments.length === 0 || payments === null">No Records</div>
    <table
      class="table table-bordered"
      :id="`business_statement_table_${user}`"
      v-if="payments.length > 0"
    >
      <thead>
        <tr>
          <td></td>
          <td>Txn</td>
          <td>Date</td>
          <td>Amount</td>
          <td>Rb</td>
          <td>Method</td>
          <td>Narrative</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, key) in payments" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ payment.txn }}</td>
          <td>
            {{ getFormattedDate(payment.date_time, 'DD/MM/YYYY hh.mm a ') }}
          </td>
          <td>{{ currency }} {{ payment.amount }}</td>
          <td>{{ currency }} {{ payment.rb }}</td>
          <td>{{ payment.pay_method }}</td>
          <td>{{ payment.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheStatementComponent',
  props: {
    payments: {
      type: Array,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
};
</script>
