<template>
  <div>
    <div class="tab-pane" :id="`loans${user.rider_id}`">
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
            <th>Narrative</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in user.loans_list" :key="loan">
            <td>{{ loan.pay_type }}</td>
            <td>{{ loan.pay_method }}</td>
            <td>{{ loan.txn }}</td>
            <td>{{ user.default_currency }} {{ loan.amount }}</td>
            <td>{{ user.default_currency }} {{ Math.round(loan.rb) }}</td>
            <td>{{ loan.status }}</td>
            <td>{{ loan.date_time }}</td>
            <td>{{ loan.description }}</td>
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Running Bal
              <span class="badge"
                >{{ user.default_currency }}
                {{ Math.round(user.loans_list[0].rb) }}</span
              >
            </td>
            <td>
              Next Transfer
              <span class="badge"
                >{{ user.default_currency }}
                {{ Math.round(user.loans_list[0].rb) }}</span
              >
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoansComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
