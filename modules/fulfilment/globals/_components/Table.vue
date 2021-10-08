<template>
  <div class="fulfilment-table-wrapper">
    <el-table
      :data="getTableData"
      ref="tableData"
      style="width: 100%"
      @row-click="rowClicked"
      @selection-change="handleSelectionChange"
    >
      >
      <div
        class="data-info-panel"
        slot="append"
        v-if="getTableData.length == '0'"
      >
        <span v-if="processing"> Fetching data ... </span>
        <span v-else>No Data</span>
      </div>
      <el-table-column :type="checkFulfilmentMultiSelect" width="55">
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
      <el-table-column type="expand" v-if="checkFulfilmentExpand">
        <template>
          <TableDetails />
        </template>
      </el-table-column>
    </el-table>
    <div class="fulfilment-table-loader"></div>
    <div v-observe-visibility="loadMore"></div>
  </div>
</template>
<script>
import moment from 'moment';
import { Loading } from 'element-ui';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import TableDetails from './TableDetails.vue';
import StatusBadge from './StatusBadge.vue';

export default {
  name: 'Table',
  components: {
    TableDetails,
    StatusBadge,
  },
  props: {
    dataProps: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hubs: null,
      processing: false,
      regions: null,
      multipleSelection: [],
      disableCheckBoxPages: [
        'HubsView',
        'ReturnView',
        'Outbound_movableUnitsView',
        'Inbound_batchesView',
      ],
      disableExpandPages: ['HubsView'],
    };
  },
  computed: {
    ...mapGetters({
      getTableProps: 'fulfilment/getTableProps',
      getSearchState: 'fulfilment/getSearchState',
      getPagination: 'fulfilment/getPagination',
      getTableData: 'fulfilment/getTableData',
      getSelectedHubs: 'fulfilment/getSelectedHubs',
      getSelectedRegions: 'fulfilment/getSelectedRegions',
      getProcessingStatus: 'fulfilment/getProcessingStatus',
      getFulfilmentType: 'fulfilment/getFulfilmentType',
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
    checkFulfilmentMultiSelect() {
      let type = '';
      if (!this.disableCheckBoxPages.includes(this.getFulfilmentType)) {
        type = 'selection';
      }
      return type;
    },
    checkFulfilmentExpand() {
      return !this.disableExpandPages.includes(this.getFulfilmentType);
    },
  },
  watch: {
    getSearchState(status) {
      if (!status) {
        this.fetchTableData();
      }
    },
    getSelectedHubs(hubs) {
      this.updateTableData([]);
      this.updatePagination({});

      this.hubs = hubs;
      this.fetchTableData();
    },
    getSelectedRegions(regions) {
      this.updateTableData([]);
      this.updatePagination({});

      this.regions = regions;
      this.fetchTableData();
    },
    getProcessingStatus(status) {
      this.processing = status;
    },
  },
  mounted() {
    this.fetchTableData();
  },
  methods: {
    ...mapMutations({
      updateTableData: 'fulfilment/setTableData',
      updatePagination: 'fulfilment/setPagination',
      updateCheckedOrders: 'fulfilment/setCheckedOrders',
    }),

    fetchTableData(payload = null) {
      this.$store.dispatch(this.dataProps.setter, payload);
    },
    rowClicked(row) {
      this.$refs.tableData.toggleRowExpansion(row);
    },
    formatDate(date) {
      return moment(date).format('hh:mm A DD-MM-YYYY ');
    },
    async loadMore(isVisible) {
      if (!this.processing && isVisible) {
        const nextPage = this.getPagination.page + 1;
        const loadingInstance = Loading.service({
          fullscreen: false,
          target: '.fulfilment-table-loader',
        });
        await this.$store.dispatch(this.dataProps.setter, {
          nextPage,
        });
        loadingInstance.close();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.updateCheckedOrders(this.multipleSelection);
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
.data-info-panel {
  min-height: 60px;
  text-align: center;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.fulfilment-table-loader {
  margin-top: 40px;
}
</style>
