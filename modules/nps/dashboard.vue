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
        <TheTopSection :surveys="surveys" />
        <TheMainSection :surveys="surveys" :meta-data="metaData" />
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import order_store from './_store';
import RegisterStoreModule from '@/mixins/register_store_module';
import TheTopSection from './_components/TheTopSection';
import TheMainSection from './_components/TheMainSection';

export default {
  name: 'TheNpsDashboardComponent',
  components: {
    TheTopSection,
    TheMainSection,
  },
  data() {
    return {
      metaData: null,
      npsRequestStatus: false,
      surveys: null,
    };
  },
  computed: {
    ...mapGetters(['getNPSRequest', 'getSurveys', 'getCurrentNPSPage']),
  },
  watch: {
    getNPSRequest(status) {
      this.npsRequestStatus = status;
    },
    getSurveys(surveyData) {
      const metaData = surveyData.pagination;
      this.setCurrentNPSPage(metaData.page);
      this.setLastNPSPage(metaData.lastPage);
      this.metaData = metaData;
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
        },
      });
    }
  },
  methods: {
    ...mapMutations(['setNPSRequest', 'setCurrentNPSPage', 'setLastNPSPage']),
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
