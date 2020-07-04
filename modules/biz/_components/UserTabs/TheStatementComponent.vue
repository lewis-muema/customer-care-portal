<template>
  <div class="body-box">
    <div class="currency-holder">
      <div
        class="currency-tabs"
        v-for="(currency, index) in currencies"
        :class="activeCurrency === currency ? 'active-currency-button' : ''"
        @click="activeCurrency = currency"
        :key="index"
      >
        {{ currency }}
      </div>
    </div>
    <div v-if="transactions.length === 0 || payments === null">No Records</div>
    <table
      class="table table-bordered"
      :id="`business_statement_table_${user}`"
      v-if="transactions.length > 0"
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
        <tr v-for="(payment, key) in transactions" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ payment.txn }}</td>
          <td>
            {{ getFormattedDate(payment.date_time, 'DD/MM/YYYY hh.mm a ') }}
          </td>
          <td>{{ activeCurrency }} {{ payment.amount }}</td>
          <td>{{ activeCurrency }} {{ payment.rb }}</td>
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
  data() {
    return {
      currencies: [],
      activeCurrency: '',
    };
  },
  computed: {
    transactions() {
      const transactionArray = [];
      this.payments.forEach(row => {
        if (row.currency === this.activeCurrency) {
          transactionArray.push(row);
        }
      });
      return transactionArray;
    },
  },
  mounted() {
    this.filterCurrencies();
  },
  methods: {
    filterCurrencies() {
      this.activeCurrency = this.currency;
      this.currencies.push(this.activeCurrency);
      this.payments.forEach(row => {
        if (!this.currencies.includes(row.currency)) {
          this.currencies.push(row.currency);
        }
      });
    },
  },
};
</script>
