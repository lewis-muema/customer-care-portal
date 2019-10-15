<template>
  <div>
    <div class="tab-pane" id="saving<?php echo $unique_rider_id;?>">
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
        <tbody>
          <tr v-for="saving in user.savings_list" :key="saving">
            <td>{{ saving.pay_type }}</td>
            <td>{{ saving.pay_method }}</td>
            <td>{{ saving.txn }}</td>
            <td>{{ saving.amount }}</td>
            <td>{{ saving.rb }}</td>
            <td>{{ saving.status }}</td>
            <td>{{ saving.date_time }}</td>
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Running Bal
              <span class="badge"></span>
            </td>
            <td>
              Next Transfer
              <span class="badge"></span>
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
  name: 'SavingsComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
