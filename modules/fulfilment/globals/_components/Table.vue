<template>
  <div class="fulfilment-table-wrapper">
    <el-table
      :data="orders.data"
      ref="tableData"
      style="width: 100%"
      @row-click="rowClicked"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="expand">
        <template>
          <TableDetails />
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status" width="130">
        <template slot-scope="props">
          <StatusBadge :status="props.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="Client" prop="customer_name"> </el-table-column>
      <el-table-column label="Order No" prop="order_no"> </el-table-column>
      <el-table-column label="Time" prop="time_placed" width="150">
        <template slot-scope="props">
          {{ formatDate(props.row.time_placed) }}
        </template>
      </el-table-column>
      <el-table-column label="Pickup" prop="pickup_location" width="180">
      </el-table-column>
      <el-table-column
        label="Delivery"
        prop="delivery_location"
      ></el-table-column>
      <el-table-column label="Rider" prop="rider_name"> </el-table-column>
      <el-table-column label="Region" prop="city_name">
        <template slot-scope="props">
          <div>{{ props.row.city_name }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableDetails from './TableDetails.vue';
import StatusBadge from './StatusBadge.vue';

export default {
  name: 'Table',
  components: {
    TableDetails,
    StatusBadge,
  },
  computed: {
    ...mapState('fulfilment', ['orders']),
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    ...mapActions({
      fetchOrders: 'fulfilment/fetchOrders',
    }),
    rowClicked(row) {
      this.$refs.tableData.toggleRowExpansion(row);
    },
    formatDate(date) {
      return moment(date).format('hh:mm A DD-MM-YYYY ');
    },
  },
};
</script>
<style scoped>
.el-table__expand-column .cell {
  display: none;
}
.region-label {
  background-color: #324ba8;
  color: #ffffff;
  padding: 5px;
  border-radius: 44px;
  width: 40%;
  text-align: center;
  display: inline-block;
}
</style>
