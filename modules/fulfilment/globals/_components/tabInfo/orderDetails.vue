<template lang="html">
  <div class="">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Order Number</td>
          <td>{{ order_details.order_id }}</td>
        </tr>
        <tr>
          <td width="50%">Batch</td>
          <td>
            {{
              Object.keys(order_details.batches).length === 0
                ? '--'
                : batch_list.toString()
            }}
          </td>
        </tr>
        <tr>
          <td width="50%">Vendor Type</td>
          <td class="transform-vehicle-name">{{ getVendorType() }}</td>
        </tr>
        <tr>
          <td width="50%">Fulfilment fee</td>
          <td>
            {{ order_details.pricing.currency }}
            {{ order_details.pricing.fulfilment_cost }}
          </td>
        </tr>
        <tr>
          <td width="50%">Number of items</td>
          <td>
            {{ Object.keys(order_details.order_items.items).length }}
            {{
              Object.keys(order_details.order_items.items).length === 1
                ? 'item'
                : 'items'
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrderDetails',
  data() {
    return {
      order_details: {},
      batch_list: [],
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
      getAgentVehicleType: 'fulfilment/getAgentVehicleType',
    }),
  },
  beforeMount() {
    this.order_details = this.getTableDetails;
    this.getBatchList();
  },
  methods: {
    getBatchList() {
      const batches = this.order_details.batches;
      for (let i = 0; i < batches.length; i += 1) {
        this.batch_list.push(batches[i].batch_id);
      }
    },
    getVendorType() {
      const string = this.getAgentVehicleType.replace(/_/g, ' ').toLowerCase();

      return string;
    },
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
