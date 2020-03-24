<template>
  <div class="box box-info">
    <div class="box-body nps-holder">
      <span v-if="surveys === null">
        <div class="text-center">
          Loading NPS Metrics ....
          <i class="fa fa-spinner fa-spin loader"></i>
        </div>
      </span>
      <span v-else>
        <div class="nps-back-header">
          <nuxt-link class="nps-back-header row" to="/nps/dashboard">
            <div class="col-md-5">
              <span
                class="accordion-item-trigger-icon back-icon pull-left"
              ></span>
              <span class="back-text"> Back to Dashboard</span>
            </div>
          </nuxt-link>
        </div>
        <div class="row metrics-header">
          <div class="col-md-6 metrics-text">Metrics</div>
          <div class="col-md-6 pull-right metrics-date">
            <TheDatePickerComponent />
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <TheMetricsSidebarComponent :surveys="surveys" />
          </div>
          <div class="col-md-9">
            <TheMetricsMainComponent />
          </div>
        </div>
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheMetricsView',
  components: {
    TheMetricsSidebarComponent: () =>
      import('~/modules/nps/_components/MetricsSection/TheMetricsSidebar'),
    TheDatePickerComponent: () =>
      import('~/modules/nps/_components/TheDatePicker'),

    TheMetricsMainComponent: () =>
      import('~/modules/nps/_components/MetricsSection/TheMetricsMainSection'),
  },
  mixins: [NPSMxn],

  data() {
    return {
      metaData: null,
      surveys: null,
    };
  },
  computed: {
    ...mapGetters(['getSurveys']),
  },
  watch: {
    getSurveys(surveyData) {
      return (this.surveys = surveyData.data);
    },
  },
  mounted() {
    if (process.client) {
      this.setSurveys({
        page: 1,
        params: {
          date_from: this.firstDayOfCurrentMonth,
          date_to: this.lastDayOfCurrentMonth,
        },
      });
    }
  },
  methods: {
    ...mapActions(['setSurveys']),
  },
};
</script>
<style scoped>
.metrics-header {
  margin-bottom: 29px;
}
.metrics-date {
  text-align: right;
  margin-left: 6em;
  width: 32%;
}
</style>
