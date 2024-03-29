<template>
  <div class="fulfilment-table-wrapper" :key="tableKey">
    <el-table
      :data="getTableData"
      ref="tableData"
      style="width: 100%"
      :row-key="getRowKey"
      :expand-row-keys="expand_keys"
      @row-click="expandTableRow"
      @expand-change="handleRowExpand"
      @selection-change="handleSelectionChange"
      v-loading="fetching"
      header-cell-class-name="mc-seller-header"
    >
      <div
        class="data-info-panel"
        slot="append"
        v-if="getTableData.length === 0 && fetching === false"
      >
        <span>No Data</span>
      </div>

      <el-table-column
        :type="checkFulfilmentMultiSelect"
        class="selectionStatus"
        width="55"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        v-for="(table_data, index) in getTableProps"
        :key="index"
        :label="table_data.name"
        :width="table_data.width"
      >
        <template slot-scope="props">
          <div v-if="table_data.tag === 'order_status'">
            <StatusBadge :status="props.row.order_status" />
          </div>
          <div v-else-if="table_data.tag === 'batch_status'">
            <StatusBadge
              v-if="props.row.batch_status"
              :status="props.row.batch_status"
            />
          </div>
          <div v-else-if="table_data.tag === 'payment_status'">
            <StatusBadge :status="props.row.payment_status" />
          </div>
          <div v-else-if="table_data.tag === 'country'">
            <div class="country-badge">
              {{ orderCountryName(props.row.country) }}
            </div>
          </div>
          <div v-else-if="table_data.tag === 'scheduled_date'">
            {{ formatDate(props.row.scheduled_date) }}
          </div>
          <div v-else-if="table_data.tag === 'fulfilment_fee'">
            {{ props.row.currency }} {{ props.row.fulfilment_fee }}
          </div>
          <div v-else-if="table_data.tag === 'order_amount'">
            {{ props.row.currency }} {{ props.row.order_amount }}
          </div>
          <div v-else-if="table_data.tag === 'amount'">
            {{ props.row.currency }} {{ props.row.amount }}
          </div>
          <div v-else-if="table_data.tag === 'account_created_date'">
            {{ formatDate(props.row.account_created_date) }}
          </div>
          <div v-else-if="table_data.tag === 'completed_date'">
            {{ formatDate(props.row.completed_date) }}
          </div>
          <div v-else-if="table_data.tag === 'created_date'">
            {{ formatDate(props.row.created_date) }}
          </div>
          <div v-else-if="table_data.tag === 'status'">
            <StatusBadge :status="props.row.status" />
          </div>
          <div v-else-if="table_data.tag === 'invoice_amount'">
            {{ props.row.currency }} {{ props.row.invoice_amount }}
          </div>
          <div v-else-if="table_data.tag === 'invoice_download'">
            <div class="mc-seller-download-invoice">
              Download invoice
            </div>
          </div>
          <div v-else-if="table_data.tag === 'seller_redirect'">
            >
          </div>
          <div v-else-if="table_data.tag === 'hub_name'">
            {{ !props.row.hub_name ? '--' : props.row.hub_name }}
          </div>
          <div
            v-else-if="table_data.tag === 'shipping_agent_name'"
            :class="
              !props.row.shipping_agent_name
                ? 'no-assigned-fulfilment-order'
                : ''
            "
          >
            <span>
              {{
                !props.row.shipping_agent_name
                  ? 'Not assigned'
                  : props.row.shipping_agent_name
              }}
            </span>
            <img
              v-if="
                showVehicle(props.row.shipping_agent_vehicle_type) &&
                  props.row.shipping_agent_name
              "
              :src="
                `${webImages}${showVehicle(
                  props.row.shipping_agent_vehicle_type,
                )}`
              "
              class="image"
            />
          </div>
          <div v-else-if="table_data.tag === 'hub_type'">
            {{ props.row.hub_type.replace(/_/g, ' ') }}
          </div>
          <div v-else-if="table_data.tag === 'hub_status'">
            <div
              class="hub-status"
              :class="props.row.activated ? 'active-hub' : 'deactivated-hub'"
            >
              {{ props.row.activated ? 'Active' : 'In active' }}
            </div>
          </div>
          <div v-else-if="table_data.tag === 'activated'">
            <div v-if="props.row.activated" class="active-hub">
              Deactivate
            </div>
            <div v-else class="deactivated-hub">
              Activate
            </div>
          </div>
          <div v-else-if="checkDataAvailability(props.row, table_data.tag)">
            --
          </div>
          <div v-else>
            <span
              v-html="
                smartify_display(
                  returnRestructedPropData(props.row, table_data.tag),
                  20,
                )
              "
            ></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="expand" v-if="checkFulfilmentExpand">
        <template slot-scope="props">
          <InvoiceDetails
            :order-info="props.row"
            v-if="getFulfilmentType === 'invoices'"
          />
          <TableDetails
            :order-info="props.row"
            :page="getFulfilmentType"
            v-if="getFulfilmentType !== 'invoices'"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="fulfilment-table-loader text-center" v-if="fetchMoreLoading">
      <i class="fa fa-spinner fa-spin loader"></i>
    </div>
    <div
      v-observe-visibility="loadMore"
      v-if="infiniteScroll && scrolledToBottom"
    ></div>
  </div>
</template>
<script>
import moment from 'moment';
import { Loading } from 'element-ui';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import TableDetails from './TableDetails.vue';
import StatusBadge from './StatusBadge.vue';
import InvoiceDetails from './InvoiceDetails.vue';

export default {
  name: 'Table',
  components: {
    TableDetails,
    StatusBadge,
    InvoiceDetails,
  },
  props: {
    dataProps: {
      type: Object,
      required: true,
    },
    infiniteScroll: {
      type: Boolean,
      default: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    params: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      hubs: null,
      processing: false,
      fetching: false,
      regions: null,
      status: null,
      multipleSelection: [],
      scrolledToBottom: false,
      disableCheckBoxPages: [
        'HubsView',
        'ReturnView',
        'Outbound_movableUnitsView',
        'Inbound_batchesView',
        'all-sellers',
        'deliveryHistory',
        'invoices',
      ],
      disableExpandPages: ['HubsView', 'all-sellers'],
      sellersPage: ['all-sellers', 'deliveryHistory', 'invoices'],
      expand_id: 0,
      expand_keys: [],
      tableKey: 0,
      orders: [],
      fetchMoreLoading: false,
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
      getSelectedStatus: 'fulfilment/getSelectedStatus',
      getSelectedCountry: 'fulfilment/getSelectedCountry',
      getTableDetailKeyMetric: 'fulfilment/getTableDetailKeyMetric',
      getCheckedOrders: 'fulfilment/getCheckedOrders',
      vehicles: 'fulfilment/getVehicles',
      getSearchedEntity: 'fulfilment/getSearchedEntity',
      getStatusChanged: 'fulfilment/getStatusChanged',
      getSelectedDate: 'fulfilment/getSelectedDate',
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
    getSearchedEntity(data) {
      if (!data) {
        this.updateTableData([]);
        this.updatePagination({});
        this.fetchTableData(this.params);
      }
    },
    getSelectedHubs(hub) {
      this.updateTableData([]);
      this.updatePagination({});

      let payload = {
        hub_id: hub,
      };

      payload = hub === 'all' ? this.params : payload;

      this.hubs = hub;
      this.fetchTableData(payload);
    },
    getSelectedRegions(regions) {
      this.updateTableData([]);
      this.updatePagination({});

      this.regions = regions;
      this.fetchTableData();
    },
    getSelectedCountry(val) {
      this.updateTableData([]);
      this.updatePagination({});

      const filtered_status = this.getSelectedStatus;
      let all_status = false;

      let payload = {
        country: val,
      };

      if (filtered_status !== null) {
        if (!filtered_status.includes('all') && filtered_status.length > 0) {
          if (this.sellersPage.includes(this.getFulfilmentType)) {
            payload.payment_status = filtered_status;
          } else {
            payload.status = filtered_status;
          }
        } else {
          all_status = true;
        }
      }

      payload = val === 'All Countries' || all_status ? this.params : payload;
      this.fetchTableData(payload);
    },
    getSelectedStatus(val) {
      this.updateTableData([]);
      this.updatePagination({});

      const supported_countries = this.getSelectedCountry;
      const selected_date = this.getSelectedDate;

      let payload = {};

      if (!val.includes('all') && val.length > 0) {
        if (this.sellersPage.includes(this.getFulfilmentType)) {
          payload.payment_status = val;
        } else {
          payload.status = val;
        }
      }

      if (selected_date !== null && selected_date.length > 0) {
        payload.lowerLimitDate = selected_date(val[0]);
        payload.upperLimitDate = selected_date(val[1]);
      }

      if (
        supported_countries !== 'All Countries' &&
        supported_countries !== null
      ) {
        payload.country = supported_countries;
      }

      payload =
        val.includes('all') && supported_countries === 'All Countries'
          ? this.params
          : payload;

      this.status = val;
      this.fetchTableData(payload);
    },

    getSelectedDate(val) {
      this.updateTableData([]);
      this.updatePagination({});

      const filtered_status = this.getSelectedStatus;
      let all_status = false;
      let payload = {};

      if (val !== null && val.length > 0) {
        payload.lowerLimitDate = this.formatFilterDate(val[0]);
        payload.upperLimitDate = this.formatFilterDate(val[1]);
      }

      if (filtered_status !== null) {
        if (!filtered_status.includes('all') && filtered_status.length > 0) {
          payload.payment_status = filtered_status;
        } else {
          all_status = true;
        }
      }

      payload = val === 'All Countries' || all_status ? this.params : payload;
      this.fetchTableData(payload);
    },

    getProcessingStatus(status) {
      this.processing = status;
      this.tableKey += 1;
    },
    getCheckedOrders(val) {
      this.multipleSelection = val;
      if (val.length === 0) {
        this.tableKey += 1;
      }
    },
    getStatusChanged(status) {
      if (status) {
        this.updateTableData([]);
        this.updatePagination({});
        this.fetchTableData(this.params);
      }
    },
  },
  mounted() {
    this.fetchVehicles();
    this.fetchTableData(this.params);
    this.scroll();
  },
  methods: {
    ...mapMutations({
      updateTableData: 'fulfilment/setTableData',
      updatePagination: 'fulfilment/setPagination',
      updateCheckedOrders: 'fulfilment/setCheckedOrders',
      setSellerPage: 'fulfilment/setSellerPage',
      setSellerInfo: 'fulfilment/setSellerInfo',
    }),
    ...mapActions({
      fetchVehicles: 'fulfilment/fetchVehicles',
    }),

    async fetchTableData(payload = null) {
      this.fetching = true;
      await this.$store.dispatch(this.dataProps.setter, payload);
      this.fetching = false;
    },
    getRowKey(row) {
      const key_value = this.getTableDetailKeyMetric.id;
      return row[key_value];
    },
    expandTableRow(row) {
      const key_value = this.getTableDetailKeyMetric.id;
      if (this.expand_keys.includes(row[key_value])) {
        this.expand_keys = [];
      } else {
        this.expand_id = row[key_value];
        this.expand_keys = [];
        this.expand_keys.push(row[key_value]);
      }

      if (this.getFulfilmentType === 'all-sellers') {
        this.setSellerInfo(row);
        this.setSellerPage('single-seller');
      }
    },
    handleRowExpand(row) {
      const key_value = this.getTableDetailKeyMetric.id;
      if (this.expand_keys.includes(row[key_value])) {
        this.expand_keys = [];
      } else {
        this.expand_id = row[key_value];
        this.expand_keys = [];
        this.expand_keys.push(row[key_value]);
      }
    },
    formatDate(date) {
      return moment(date).format('hh:mm A DD-MM-YYYY ');
    },
    formatFilterDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    checkDataAvailability(row, prop) {
      let data = '';
      if (!prop.includes('.')) {
        data = row[prop];
      } else {
        const split_prop = prop.split('.');
        let table_row = row;
        for (let i = 0; i < split_prop.length; i++) {
          table_row = table_row[split_prop[i]];
        }
        data = table_row;
      }

      return !data;
    },
    returnRestructedPropData(row, prop) {
      if (!prop.includes('.')) {
        return row[prop];
      } else {
        const split_prop = prop.split('.');
        let table_row = row;
        for (let i = 0; i < split_prop.length; i++) {
          table_row = table_row[split_prop[i]];
        }
        return table_row;
      }
    },
    async loadMore(isVisible) {
      if (
        !this.processing &&
        isVisible &&
        this.getPagination.total === this.getPagination.perPage &&
        this.getPagination.page
      ) {
        const nextPage = this.getPagination.page + 1;
        this.fetchMoreLoading = true;
        const loader_payload = {
          offset: nextPage,
        };

        if (
          this.getSelectedCountry !== 'All Countries' &&
          this.getSelectedCountry !== null
        ) {
          loader_payload.country = this.getSelectedCountry;
        }

        if (this.getSelectedStatus !== null) {
          if (
            !this.getSelectedStatus.includes('all') &&
            this.getSelectedStatus.length > 0
          ) {
            loader_payload.status = this.getSelectedStatus;
          }
        }

        if (this.getSelectedDate !== null && this.getSelectedDate.length > 0) {
          loader_payload.lowerLimitDate = this.getSelectedDate(val[0]);
          loader_payload.upperLimitDate = this.getSelectedDate(val[1]);
        }

        await this.$store.dispatch(this.dataProps.setter, loader_payload);
        this.fetchMoreLoading = false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.updateCheckedOrders(this.multipleSelection);
    },
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop,
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          this.scrolledToBottom = true; // replace it with your code
        } else {
          this.scrolledToBottom = false;
        }
      };
    },
    selectable(row, index) {
      const enabled =
        row.order_status === 'ORDER_RECEIVED' ||
        row.order_status === 'ORDER_IN_PROCESSING' ||
        row.order_status === 'ORDER_RESCHEDULED';
      return enabled;
    },
    showVehicle(val) {
      let vendor = null;
      if (!val) {
        return vendor;
      }
      const filteredVehicle = this.vehicles.filter(
        vehicle => vehicle.value === val,
      );
      // eslint-disable-next-line prettier/prettier
      vendor = filteredVehicle.length > 0 ? filteredVehicle[0].image : null;
      return vendor;
    },
    orderCountryName(country) {
      return `${country.charAt(0).toUpperCase()}${country
        .slice(1)
        .toLowerCase()}`;
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
  margin-top: 10px;
  height: 70px;
}
.active-hub {
  color: #0049b7;
  cursor: pointer;
}
.deactivated-hub {
  color: #cc6100;
  cursor: pointer;
}
.hub-status {
  text-align: center;
  width: 70%;
  border-radius: 20px;
  text-transform: capitalize;
  font-weight: 700;
  font-size: 10.5378px;
  line-height: 24px;
}
.hub-status.deactivated-hub {
  background-color: #fddb97;
  color: #9d5004;
}
.hub-status.active-hub {
  background-color: #324ba833;
  color: #324ba8;
}
.image {
  width: 10%;
  margin-left: 7px;
}
.no-assigned-fulfilment-order {
  color: #cacaca;
}
.country-badge {
  text-align: center;
  width: 70%;
  border-radius: 20px;
  text-transform: capitalize;
  font-weight: 700;
  font-size: 10.5378px;
  line-height: 24px;
  background-color: #00c0ef;
  color: #fff;
}
</style>
