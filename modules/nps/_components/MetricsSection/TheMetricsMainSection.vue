<template>
  <div class="col-md-12 row" :key="metricsComponent">
    <div class="col-md-3">
      <TheMetricsSidebarComponent
        :customers="customerTotal"
        :customer-status="isCustomersDone"
        :partner-status="isPartnersDone"
        :partners="partnerTotal"
        :owners="owners"
        :owner-status="isOwnerDone"
      />
    </div>
    <div class="col-md-9">
      <div class="row main-metric-section">
        <div class="col-md-12">
          <div class="section-header">Survey activity per account</div>
        </div>
        <div class="row">
          <div
            v-for="(userType, index) in userTypes"
            :key="index"
            class="col-md-6 metrics-holder"
          >
            <div class="user-header">{{ userType.title }}</div>
            <div
              class="row"
              v-if="filter(userMetrics, userType.user).length === 0"
            >
              <div class="loader"></div>
            </div>
            <div v-else>
              <div
                v-for="(metrics, index) in filter(userMetrics, userType.user)"
                :key="index"
                class="row"
              >
                <div
                  v-for="(subSection, i) in metrics.child"
                  :key="i"
                  class="col-md-4 sub-holder"
                >
                  <div class="sub-section-heading">{{ subSection.name }}</div>
                  <div class="sub-section-value">{{ subSection.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheMetricsMainSection',
  components: {
    TheMetricsSidebarComponent: () =>
      import('~/modules/nps/_components/MetricsSection/TheMetricsSidebar'),
  },
  mixins: [NPSMxn],

  data() {
    return {
      peerSurveys: [],
      copSurveys: [],
      MBUSurveys: [],
      FBUSurveys: [],
      EBUSurveys: [],
      ownerSurveys: [],
      peerTotal: null,
      ownerTotal: null,
      fbuTotal: null,
      ebuTotal: null,
      mbuTotal: null,
      copTotal: null,
      customerTotal: null,
      partnerTotal: null,
      owners: null,
      peer: false,
      cop: false,
      mbu: false,
      ebu: false,
      fbu: false,
      owner: false,
      isPeerDone: false,
      iscopDone: false,
      isOwnerDone: false,
      isMBUDone: false,
      isEBUDone: false,
      isFBUDone: false,
      isCustomersDone: false,
      isPartnersDone: false,
      isRequestDone: false,
      returned: false,
      accountType: null,
      businessUnits: null,
      startDate: null,
      endDate: null,
      filters: false,
      startProcess: false,
      userTypes: [
        { user: 'peer', title: 'Client Peer' },
        { user: 'cop', title: 'Client Business' },
        { user: 'mbu', title: 'Partner MBU' },
        { user: 'ebu', title: 'Partner EBU' },
        { user: 'fbu', title: 'Partner FBU' },
        { user: 'owner', title: 'Owner' },
      ],

      userMetrics: [],
    };
  },
  computed: {
    ...mapGetters(['getSurveys', 'getNPSDateRange']),

    params() {
      const respondent_type = this.accountType;
      const business_unit_abbr = this.businessUnits;
      const date_from =
        this.startDate === null ? this.firstDayOfCurrentMonth : this.startDate;
      const date_to =
        this.endDate === null ? this.lastDayOfCurrentMonth : this.endDate;

      const params = {
        date_from,
        date_to,
      };
      for (const param in params) {
        if (params[param] === null || params[param] === undefined) {
          delete params[param];
        }
      }
      return params;
    },
  },
  watch: {
    async getNPSDateRange(dateRange) {
      this.startProcess = false;
      await this.reset();
      this.filters = true;
      this.forceRerender();

      this.startDate = dateRange.startDate;
      this.endDate = dateRange.endDate;
      await this.performRequests();
    },
    async isRequestDone(status) {
      if (status) {
        await this.performRequests();
      }
    },
    async MBUSurveys(surveys) {
      this.isRequestDone = false;

      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];
      const data = {
        user: 'mbu',
        child: childData,
      };
      await this.userMetrics.push(data);
      // eslint-disable-next-line prettier/prettier
      this.mbuTotal = this.showTotals(surveys);
      this.isMBUDone = true;
      this.isRequestDone = true;
    },
    async EBUSurveys(surveys) {
      this.isRequestDone = false;

      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];
      const data = {
        user: 'ebu',
        child: childData,
      };
      await this.userMetrics.push(data);
      this.ebuTotal = this.showTotals(surveys);
      this.isEBUDone = true;
      this.isRequestDone = true;
    },
    async FBUSurveys(surveys) {
      this.isRequestDone = false;

      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];
      const data = {
        user: 'fbu',
        child: childData,
      };
      await this.userMetrics.push(data);
      this.fbuTotal = this.showTotals(surveys);
      this.isFBUDone = true;
      this.isRequestDone = true;
      this.isPartnersDone = true;
    },
    async ownerSurveys(surveys) {
      this.isRequestDone = false;

      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];
      const data = {
        user: 'owner',
        child: childData,
      };
      await this.userMetrics.push(data);
      this.ownerTotal = this.showTotals(surveys);

      this.isOwnerDone = true;
      this.isRequestDone = true;
    },
    async peerSurveys(surveys) {
      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];

      const data = {
        user: 'peer',
        child: childData,
      };
      await this.userMetrics.push(data);
      this.peerTotal = this.showTotals(surveys);
      this.isPeerDone = true;
      this.isRequestDone = true;
    },
    async copSurveys(surveys) {
      this.isRequestDone = false;

      // eslint-disable-next-line prettier/prettier
      const childData = typeof surveys[0] !== 'undefined' ? await this.populateChildMetrics(surveys) : [];

      const data = {
        user: 'cop',
        child: childData,
      };
      await this.userMetrics.push(data);
      this.copTotal = this.showTotals(surveys);
      this.iscopDone = true;
      this.isRequestDone = true;
      this.isCustomersDone = true;
    },
    isCustomersDone(status) {
      if (status) {
        this.customerTotal = this.peerTotal + this.copTotal;
      }
    },
    isPartnersDone(status) {
      if (status) {
        this.partnerTotal = this.mbuTotal + this.ebuTotal + this.fbuTotal;
      }
    },
    isOwnerDone(status) {
      this.owners = this.ownerTotal;
    },
    getSurveys(surveyData) {
      if (!this.isPeerDone) {
        this.peerSurveys = [];
        this.peerSurveys.push(surveyData);
      }
      if (this.isPeerDone && !this.iscopDone) {
        this.copSurveys = [];
        this.copSurveys.push(surveyData);
      }
      if (this.valid('mbu')) {
        this.MBUSurveys = [];
        this.MBUSurveys.push(surveyData);
      }
      if (this.valid('fbu')) {
        this.FBUSurveys = [];
        this.FBUSurveys.push(surveyData);
      }
      if (this.valid('ebu')) {
        this.EBUSurveys = [];
        this.EBUSurveys.push(surveyData);
      }
      if (this.valid('owner')) {
        this.ownerSurveys = [];
        this.ownerSurveys.push(surveyData);
      }
    },
  },
  async mounted() {
    this.startProcess = true;
    const peerData = await this.performRequests();
  },
  methods: {
    ...mapActions(['setSurveys']),

    calculatePercentage(value, total) {
      return value !== 0 && total !== 0 ? (value * 100) / total : 0;
    },
    showTotals(surveys) {
      return typeof surveys[0] !== 'undefined' && surveys !== null
        ? surveys[0].pagination.total
        : null;
    },
    populateChildMetrics(data) {
      let result = [];
      if (data !== null && typeof data[0] !== 'undefined') {
        // eslint-disable-next-line prettier/prettier
        const pagination =  data !== null ? data[0].pagination : null;
        const surveyData = data !== null ? data[0].data : null;
        const meta = data !== null ? data[0].meta : null;
        const total = pagination.total;
        const commentedPerc = this.calculatePercentage(meta.commented, total);
        const respondedPerc = this.calculatePercentage(meta.responded, total);
        const dismissedPerc = this.calculatePercentage(meta.dismissed, total);

        result = [
          {
            name: 'No. Surveyed',
            value: total,
          },
          {
            name: 'No. Responses',
            value: meta.responded,
          },
          {
            name: 'No. Dismissed',
            value: meta.dismissed,
          },
          {
            name: '% Commented',
            value: `${commentedPerc.toFixed(1)}%`,
          },
          {
            name: '% Responded',
            value: `${respondedPerc.toFixed(1)}%`,
          },
          {
            name: '% Dismissed',
            value: `${dismissedPerc.toFixed(1)}%`,
          },
        ];
      }

      return result;
    },
    reset() {
      this.userMetrics = [];
      this.isPeerDone = false;
      this.iscopDone = false;
      this.isOwnerDone = false;
      this.isMBUDone = false;
      this.isEBUDone = false;
      this.isFBUDone = false;
      this.isCustomersDone = false;
      this.isPartnersDone = false;
      this.isRequestDone = false;
      this.peerTotal = null;
      this.ownerTotal = null;
      this.fbuTotal = null;
      this.ebuTotal = null;
      this.mbuTotal = null;
      this.copTotal = null;
      this.customerTotal = null;
      this.partnerTotal = null;
    },

    async performRequests() {
      const peerRequest = this.valid('peer') ? await this.getPeerSurveys() : '';
      // eslint-disable-next-line prettier/prettier
      const copRequest = this.valid('cop') ? await this.getBusinessSurveys() : '';
      const mbuRequest = this.valid('mbu') ? await this.getMBUSurveys() : '';
      const ebuRequest = this.valid('ebu') ? await this.getEBUSurveys() : '';
      const fbuRequest = this.valid('fbu') ? await this.getFBUSurveys() : '';
      // eslint-disable-next-line prettier/prettier
      const ownerRequest = this.valid('owner') ? await this.getOwnerSurveys(): '';
    },
    valid(user) {
      let valid = false;
      switch (user) {
        case 'peer':
          valid = !this.isPeerDone;
          break;
        case 'cop':
          valid = this.isPeerDone && !this.iscopDone;
          break;
        case 'mbu':
          valid = this.isPeerDone && this.iscopDone && !this.isMBUDone;
          break;
        case 'ebu':
          // eslint-disable-next-line prettier/prettier
          valid = this.isPeerDone && this.iscopDone && this.isMBUDone && !this.isEBUDone;
          break;
        case 'fbu':
          // eslint-disable-next-line prettier/prettier
          valid = this.isPeerDone && this.iscopDone && this.isMBUDone && this.isEBUDone && !this.isFBUDone;
          break;
        case 'owner':
          // eslint-disable-next-line prettier/prettier
          valid = this.isPeerDone && this.iscopDone && this.isMBUDone && this.isEBUDone && this.isFBUDone && !this.isOwnerDone;
          break;
        default:
      }
      return valid;
    },
    filter(metricsArray, userType) {
      const metrics = metricsArray.filter(metric => metric.user === userType);
      return metrics;
    },
    async getPeerSurveys() {
      this.accountType = 'peer';
      await this.sendRequest(this.params, 'peer', null);
    },
    async getBusinessSurveys() {
      this.accountType = 'cop';
      await this.sendRequest(this.params, 'cop', null);
    },
    async getMBUSurveys() {
      this.accountType = 'partner';
      await this.sendRequest(this.params, 'partner', 'MBU');
    },
    async getEBUSurveys() {
      this.accountType = 'partner';
      await this.sendRequest(this.params, 'partner', 'EBU');
    },
    async getFBUSurveys() {
      this.accountType = 'partner';
      await this.sendRequest(this.params, 'partner', 'FBU');
    },
    async getOwnerSurveys() {
      this.accountType = 'owner';
      await this.sendRequest(this.params, 'owner', null);
    },
    async sendRequest(payload, userType, businessUnit) {
      this.returned = false;
      const params = this.isEmpty(payload) ? '' : payload;
      params.respondent_type = userType;
      if (businessUnit !== null) {
        params.business_unit_abbr = businessUnit;
      }
      await this.setSurveys({
        page: 1,
        params,
      });
    },
  },
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 133%;
}
.metrics-holder {
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
  margin-right: 3em;
  margin-top: 3em;
  max-width: 46%;
  padding-top: 12px;
}
.user-header {
  font-size: 20px;
  line-height: 32px;
  color: #0f4271;
}
.sub-section-heading {
  font-size: 14px;
  line-height: 28px;
  color: #6b8399;
}
.sub-section-value {
  font-weight: 600;
  font-size: 20px;
  line-height: 140%;
  color: #000000;
}
.main-metric-section {
  margin-right: 29px;
  margin-bottom: 29px;
  margin-left: 0;
}
.sub-holder {
  margin-bottom: 20px;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 2s linear infinite;
  float: none;
  margin: auto;
  margin-bottom: 1em;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
