<template>
  <div>
    <div class="tab-pane" :id="`savings${user.rider_id}`">
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
            <th>Description</th>
          </tr>
        </thead>
        <tbody v-if="this.user.savings_list.length > 0">
          <tr v-for="saving in user.savings_list" :key="saving.index">
            <td>{{ saving.pay_type }}</td>
            <td>{{ saving.pay_method }}</td>
            <td>{{ saving.txn }}</td>
            <td>
              {{ user.default_currency }}
              {{ new Intl.NumberFormat().format(saving.amount) }}
            </td>
            <td>
              {{ user.default_currency }}
              {{ new Intl.NumberFormat().format(saving.rb) }}
            </td>
            <td>{{ saving.status === 1 ? 'Completed' : 'Incomplete' }}</td>
            <td>
              {{ getFormattedDate(saving.date_time, 'DD/MM/YYYY hh.mm a ') }}
            </td>
            <td>{{ saving.description }}</td>
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
              <span v-if="this.user.savings_list.length > 0" class="badge"
                >{{ user.default_currency }}
                {{
                  new Intl.NumberFormat().format(
                    Math.round(user.savings_list[0].rb),
                  )
                }}</span
              >
              <span v-else class="badge">{{ user.default_currency }} 0</span>
            </td>
            <td>
              Next Transfer
              <span v-if="this.user.current_list.length > 0" class="badge"
                >{{ user.default_currency }}
                {{
                  new Intl.NumberFormat().format(Math.round(this.nextTransfer))
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
  name: 'SavingsComponent',
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
    };
  },
  mounted() {
    this.transfer();
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
  },
};
</script>
