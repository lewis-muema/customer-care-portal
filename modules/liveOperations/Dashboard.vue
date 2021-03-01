<template>
  <div class="operations-holder">
    <span v-if="alerts === null && loading">
      <div class="text-center">
        Loading live operations dashboard ....
        <i class="fa fa-spinner fa-spin loader"></i>
      </div>
    </span>
    <span v-else>
      <h3 class="main-title">
        {{ isAdmin ? 'Overall Statistics' : 'My Statistics' }}
      </h3>
      <TopBar
        :is-admin="isAdmin"
        :meta-data="metaData"
        @searchedOrder="handleOrderSearch"
      />
      <div v-if="searchedOrderStatus" class="search-hlder">
        <div class=" text-right">
          <i class="fa fa-arrow-left settings-icon"></i>
          <h3 @click="backToList()" class="settings-header">
            Back to List
          </h3>
        </div>
      </div>
      <MainContent
        :alerts="alerts"
        :loading="loading"
        :availability-msg="availabilityMsg"
      />
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import LiveOpsMxn from '@/mixins/live_ops_mixin';

export default {
  name: 'Dashboard',
  components: {
    TopBar: () => import('./_components/TopBar'),
    MainContent: () => import('./_components/MainContent'),
  },
  mixins: [LiveOpsMxn],

  data() {
    return {
      alerts: null,
      loading: false,
      requested: false,
      metaData: null,
      alertStatus: null,
      adminID: null,
      activeDates: null,
      startDate: null,
      endDate: null,
      alertID: null,
      vendorTypes: [],
      adminIDs: [],
      alertIDs: [],
      availabilityMsg: null,
      searchedOrderStatus: false,
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters([
      'getAlertStatus',
      'getAdminID',
      'getNPSDateRange',
      'getLiveOpsRefresh',
      'getAlertType',
      'getSelectedVendors',
      'getSelectedAdmins',
      'getSelectedAlerts',
      'getSelectedOrder',
      'getSearchedOrderStatus',
    ]),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    loggedUser() {
      return this.userData.payload.data.admin_id;
    },
    isAdmin() {
      return this.permissions.live_operations_admin;
    },
  },
  watch: {
    getSearchedOrderStatus(status) {
      this.searchedOrderStatus = status;
    },
    getAlertStatus(status) {
      this.alertStatus = status;
      this.retrieveAlerts();
    },
    getAdminID(adminID) {
      this.adminID = adminID === 'all' ? null : adminID;
      this.retrieveAlerts();
    },
    getNPSDateRange(dateRange) {
      this.startDate = dateRange.startDate;
      this.endDate = dateRange.endDate;
      this.retrieveAlerts();
    },
    getLiveOpsRefresh(status) {
      if (status) {
        this.retrieveAlerts();
      }
      this.updateSearchState(false);
    },
    getAlertType(alertID) {
      this.alertID = alertID === 'all' ? null : alertID;
      this.retrieveAlerts();
    },
    getSelectedVendors(data) {
      this.vendorTypes = data.length === 0 ? null : data;
      this.retrieveAlerts();
    },
    getSelectedAdmins(data) {
      this.adminIDs = data.length === 0 ? null : data;
      this.retrieveAlerts();
    },
    getSelectedAlerts(data) {
      this.alertIDs = data.length === 0 ? null : data;
      this.retrieveAlerts();
    },
  },
  mounted() {
    this.retrieveAlerts();
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setLiveOpsRefresh',
      updateSearchedOrderStatus: 'setSearchedOrderStatus',
    }),
    ...mapActions(['request_operational_alerts', 'request_order_alerts']),
    async retrieveOrderAlerts(orderNo) {
      this.loading = true;
      this.requested = true;
      const arr = [];

      const payload = {
        orderNo,
      };

      try {
        const res = await this.request_order_alerts(payload);
        const dt = res.status === 200 ? arr.push(res.data) : null;
        this.alerts = arr;

        this.availabilityMsg = !res.response.data.status
          ? res.response.data.message
          : '';
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.loading = false;
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async retrieveAlerts() {
      const endDate =
        this.endDate !== null
          ? this.formatDate(this.endDate, 'YYYY-MM-DD')
          : this.lastDayOfCurrentMonth;
      const startDate =
        this.startDate !== null
          ? this.formatDate(this.startDate, 'YYYY-MM-DD')
          : this.firstDayOfCurrentMonth;
      const adminID = this.adminID === 'all' ? null : this.adminID;
      const alertID = this.alertID === 'all' ? null : this.alertID;

      this.loading = true;
      this.requested = true;

      const payload = {
        page: 1,
        limit: 30,
        date_from: startDate,
        date_to: endDate,
        status: this.alertStatus,
        assignee: this.isAdmin ? this.adminIDs : this.loggedUser,
        alert_type_id: this.alertIDs,

        vendor_type_id: this.vendorTypes,
      };
      // eslint-disable-next-line guard-for-in
      for (const param in payload) {
        if (payload[param] === null || payload[param] === undefined) {
          delete payload[param];
        }
      }

      try {
        const response = await this.request_operational_alerts(payload);
        this.alerts = response.statusCode === 200 ? response.data : null;
        this.metaData = response.statusCode === 200 ? response.meta : null;
        this.availabilityMsg =
          this.alerts.length === 0 || this.alerts === null
            ? 'No problematic orders found.'
            : '';
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async handleOrderSearch(searchedOrder) {
      if (searchedOrder !== null) {
        await this.retrieveOrderAlerts(searchedOrder);
      }
    },
    backToList() {
      this.updateSearchedOrderStatus(false);
      this.retrieveAlerts();
    },
  },
};
</script>

<style>
@import './_assets/style/liveops.css';
</style>
