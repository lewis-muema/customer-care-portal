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
      <el-table-column
        v-for="(table_data, index) in getTableProps"
        :key="index"
        :label="table_data.name"
        :width="table_data.width"
      >
        <template slot-scope="props">
          <div v-if="table_data.tag === 'status'">
            <StatusBadge :status="props.row.status" />
          </div>
          <div v-else-if="table_data.tag === 'time_placed'">
            {{ formatDate(props.row.time_placed) }}
          </div>
          <div v-else>
            {{ props.row[table_data.tag] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions, mapGetters } from 'vuex';
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
    ...mapGetters({
      getTableProps: 'fulfilment/getTableProps',
    }),
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
