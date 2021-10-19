<template lang="html">
  <div class="">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Estimated Weight</td>
          <td>
            {{ order_detail.batch_summary.estimated_measure[0].value }}
            {{ order_detail.batch_summary.estimated_measure[0].value_type }}
          </td>
        </tr>
        <tr>
          <td width="50%">Total Volume</td>
          <td>
            {{ order_detail.batch_summary.estimated_measure[1].value }}
            {{ order_detail.batch_summary.estimated_measure[1].value_type }}
          </td>
        </tr>
        <tr>
          <td width="50%">Region</td>
          <td>{{ order_detail.hub.hub_name }}</td>
        </tr>
        <tr>
          <td width="50%">Total Units</td>
          <td>{{ order_detail.batch_summary.total_ordered_items_count }}</td>
        </tr>
        <tr>
          <td width="50%">Waypoints</td>
          <td>{{ order_detail.batch_summary.waypoints }} locations</td>
        </tr>
        <tr>
          <td width="50%">Delivery Cost</td>
          <td>
            {{ order_detail.batch_summary.total_fulfilment_fee }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BatchesDetails',
  data() {
    return {
      order_detail: {},
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.order_detail = this.getTableDetails;
  },
};
</script>

<style lang="css" scoped>
.el-table td {
  border: 1px solid #ebeef5 !important;
}
.el-table tr {
  height: 35px !important;
}
</style>
