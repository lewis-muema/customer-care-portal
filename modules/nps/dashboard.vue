<template>
  <div class="box box-info">
    <div class="box-body nps-holder">
      <span v-if="surveys === null">
        <div class="text-center">
          Loading NPS dashboard ....
          <i class="fa fa-spinner fa-spin loader"></i>
        </div>
      </span>
      <span v-else>
        <TheTopSection :surveys="surveys" :meta-data="totals" />
        <TheMainSection :surveys="surveys" :meta-data="metaData" />
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import RegisterStoreModule from '@/mixins/register_store_module';
import NPSMxn from '@/mixins/nps_mixin';
import order_store from './_store';
import TheTopSection from './_components/TheTopSection';
import TheMainSection from './_components/TheMainSection';

export default {
  name: 'TheNpsDashboardComponent',
  components: {
    TheTopSection,
    TheMainSection,
  },
  mixins: [NPSMxn],
  data() {
    return {
      metaData: null,
      npsRequestStatus: false,
      surveys: null,
      totals: null,
      filters: {},
    };
  },
  computed: {
    ...mapGetters([
      'getNPSRequest',
      'getSurveys',
      'getCurrentNPSPage',
      'getNPSMetaData',
      'getNPSFilters',
    ]),
  },
  watch: {
    getNPSFilters(filters) {
      this.filters = filters;
    },
    getNPSMetaData(value) {
      this.totals = value;
    },
    totals(value) {
      this.totals = value;
      this.setNPSMetaData(value);
    },
    getSurveys(surveyData) {
      const metaData = surveyData.pagination;
      const totals = surveyData.meta;
      this.setCurrentNPSPage(metaData.page);
      this.setLastNPSPage(metaData.lastPage);
      this.metaData = metaData;
      this.totals = totals;
      this.setNPSMetaData(totals);
      return (this.surveys = surveyData.data);
    },
  },
  created() {
    this.registerOrdersStore();
  },
  mounted() {
    if (process.client) {
      this.setSurveys({
        page: 1,
        params: {
          dismissed: 0,
          date_from: this.firstDayOfCurrentMonth,
          date_to: this.lastDayOfCurrentMonth,
        },
      });
    }
  },
  methods: {
    ...mapMutations([
      'setNPSRequest',
      'setCurrentNPSPage',
      'setLastNPSPage',
      'setNPSMetaData',
    ]),
    ...mapActions(['setSurveys']),

    registerOrdersStore() {
      // eslint-disable-next-line no-underscore-dangle
      const moduleIsRegistered =
        // eslint-disable-next-line no-underscore-dangle
        this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_nps', order_store);
      }
    },
  },
};
</script>
