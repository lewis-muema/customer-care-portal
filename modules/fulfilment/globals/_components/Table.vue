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
    <div class="fulfilment-pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="getPagination.total"
        :page-size="getPagination.perPage"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
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
    ...mapState('fulfilment', ['orders', 'pagination']),
    ...mapGetters({
      getTableProps: 'fulfilment/getTableProps',
      getPagination: 'fulfilment/getPagination',
    }),
    currentPage: {
      get() {
        return this.$store.state.fulfilment.pagination.page;
      },
      set(value) {
        this.$store.commit('fulfilment/setPagination', {
          ...this.getPagination,
          page: value,
        });
      },
    },
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
    handleCurrentChange(val) {
      this.fetchOrders({ currentPage: val });
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
.fulfilment-pagination {
  display: flex;
  justify-content: center;
}
.el-pagination {
  width: 35%;
}
</style>
