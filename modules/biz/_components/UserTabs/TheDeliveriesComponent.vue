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
    <div v-if="transactions.length === 0">No Orders</div>
    <table
      class="table table-bordered"
      :id="`business_deliveries_table_${user}`"
      v-if="transactions.length > 0"
    >
      <thead>
        <tr>
          <td></td>
          <td>Order No</td>
          <td>Date</td>
          <td>Rider</td>
          <td>From</td>
          <td>To</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(delivery, key) in transactions" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ delivery.order_no }}</td>
          <td>
            {{ getFormattedDate(delivery.time_stamp, 'DD/MM/YYYY hh.mm a ') }}
          </td>

          <td>{{ delivery.rider_details.name }}</td>
          <td>{{ delivery.path.from }}</td>
          <td>{{ delivery.path.to }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheDeliveriesComponent',
  props: {
    deliveries: {
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
      this.deliveries.forEach(row => {
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
      this.deliveries.forEach(row => {
        if (!this.currencies.includes(row.currency)) {
          this.currencies.push(row.currency);
        }
      });
    },
  },
};
</script>
