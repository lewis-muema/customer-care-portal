<template>
  <div class="operations-holder">
    <span v-if="alerts === null">
      <div class="text-center">
        Loading live operations dashboard ....
        <i class="fa fa-spinner fa-spin loader"></i>
      </div>
    </span>
    <span v-else>
      <h3 class="main-title">
        {{ isAdmin ? 'Overall Statistics' : 'My Statistics' }}
      </h3>
      <TopBar :is-admin="isAdmin" :meta-data="metaData" />
      <MainContent :alerts="alerts" :loading="loading" />
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
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters([
      'getAlertStatus',
      'getAdminID',
      'getNPSDateRange',
      'getLiveOpsRefresh',
    ]),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    isAdmin() {
      return this.permissions.live_operations_admin;
    },
  },
  watch: {
    getAlertStatus(status) {
      this.alertStatus = status;
      this.retrieveAlerts();
    },
    getAdminID(adminID) {
      this.adminID = adminID;
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
  },
  mounted() {
    this.retrieveAlerts();
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setLiveOpsRefresh',
    }),
    ...mapActions(['request_operational_alerts']),

    async retrieveAlerts() {
      this.loading = true;
      this.requested = true;

      const payload = {
        page: 1,
        limit: 30,
        ...(this.alertStatus !== null && { status: this.alertStatus }),
        ...((this.adminID !== null || this.adminID !== 'all') && {
          assignee: this.adminID,
          date_from:
            this.startDate === null
              ? this.firstDayOfCurrentMonth
              : this.startDate,
          date_to:
            this.endDate === null ? this.lastDayOfCurrentMonth : this.endDate,
        }),
      };

      try {
        const response = await this.request_operational_alerts(payload);
        this.alerts = response.statusCode === 200 ? response.data : null;
        this.metaData = response.statusCode === 200 ? response.meta : null;
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
  },
};
</script>

<style>
@import './_assets/style/liveops.css';
</style>
