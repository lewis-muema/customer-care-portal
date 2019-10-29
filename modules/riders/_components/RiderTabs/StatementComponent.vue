<template>
  <div>
    <div class="tab-pane" :id="`statement${user.rider_id}`">
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
        <tbody v-if="this.user.current_list.length > 0">
          <tr v-for="statement in user.current_list" :key="statement">
            <td>{{ statement.pay_type }}</td>
            <td>{{ statement.pay_method }}</td>
            <td>{{ statement.txn }}</td>
            <td>{{ user.default_currency }} {{ statement.amount }}</td>
            <td>{{ user.default_currency }} {{ statement.rb }}</td>
            <td>{{ statement.status }}</td>
            <td>{{ statement.date_time }}</td>
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
              <span v-if="this.user.current_list.length > 0" class="badge"
                >{{ user.default_currency }}
              </span>
            </td>
            <td>
              Next Transfer
              <span v-if="this.user.current_list.length > 0" class="badge"
                >{{ user.default_currency }}
              </span>
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
  name: 'StatementComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
