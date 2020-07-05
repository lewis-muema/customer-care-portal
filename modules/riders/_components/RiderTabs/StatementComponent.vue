<template>
  <div>
    <div class="tab-pane" :id="`statement${user.rider_id}`">
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
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Type</th>
            <th>Payment Method</th>
            <th>Reference</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Date</th>
            <th>Pay Narrative</th>
            <th>Narrative</th>
          </tr>
        </thead>
        <tbody v-if="this.transactions.length > 0">
          <tr v-for="statement in transactions" :key="statement.index">
            <td>{{ statement.pay_type }}</td>
            <td>{{ statement.pay_method }}</td>
            <td>{{ statement.txn }}</td>
            <td>
              {{ activeCurrency }}
              {{ new Intl.NumberFormat().format(statement.amount) }}
            </td>
            <td>
              {{ activeCurrency }}
              {{ new Intl.NumberFormat().format(statement.rb) }}
            </td>
            <td>{{ statement.status === 1 ? 'Completed' : 'Incomplete' }}</td>
            <td>
              {{ getFormattedDate(statement.date_time, 'DD/MM/YYYY hh.mm a ') }}
            </td>
            <td>{{ statement.pay_narrative }}</td>
            <td>{{ statement.description }}</td>
          </tr>

          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th colspan="1" class="text-center">Summary</th>
            <th colspan="1" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Running Bal
              <span v-if="this.transactions.length > 0" class="badge"
                >{{ activeCurrency }}
                {{
                  new Intl.NumberFormat().format(Math.round(transactions[0].rb))
                }}</span
              >
              <span v-else class="badge">{{ activeCurrency }} 0</span>
            </td>
            <td>
              Next Transfer
              <span v-if="this.transactions.length > 0" class="badge"
                >{{ user.default_currency }}
                {{
                  new Intl.NumberFormat().format(Math.round(nextTransfer))
                }}</span
              >
              <span v-else class="badge">{{ user.default_currency }} 0</span>
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'StatementComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      riderId: this.user.rider_id,
      nextTransfer: null,
      currencies: [],
      activeCurrency: '',
    };
  },
  computed: {
    transactions() {
      const transactionArray = [];
      this.user.current_list.forEach(row => {
        if (row.currency === this.activeCurrency) {
          transactionArray.push(row);
        }
      });
      return transactionArray;
    },
  },
  mounted() {
    this.transfer();
    this.filterCurrencies();
  },
  methods: {
    ...mapActions({
      next_transfer: 'request_nextTransfer',
    }),
    async transfer() {
      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'rider_next_transfer',
        apiKey: true,
        params: {
          rider_id: this.riderId,
        },
      };

      try {
        const data = await this.next_transfer(payload);
        this.nextTransfer = data.amount;
      } catch (error) {
        return error;
      }
    },
    filterCurrencies() {
      this.activeCurrency = this.user.default_currency;
      this.currencies.push(this.activeCurrency);
      this.user.current_list.forEach(row => {
        if (!this.currencies.includes(row.currency)) {
          this.currencies.push(row.currency);
        }
      });
    },
  },
};
</script>
