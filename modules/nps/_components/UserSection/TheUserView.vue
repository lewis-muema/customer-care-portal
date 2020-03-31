<template>
  <div class="box box-info">
    <div class="box-body nps-holder">
      <div v-if="surveys === null">
        <div class="text-center">
          Loading User dashboard ....
          <i class="fa fa-spinner fa-spin loader"></i>
        </div>
      </div>
      <div v-else class="nps-user-holder">
        <div class="nps-back-header">
          <nuxt-link class="nps-back-header" to="/nps/dashboard">
            <div class="col-md-5">
              <span
                class="accordion-item-trigger-icon back-icon pull-left"
              ></span>
              <span class="back-text"> Back to Dashboard</span>
            </div>
          </nuxt-link>
        </div>
        <div v-if="returned && surveys.length === 0" class="survey-info">
          <div class="alert alert-info text-center">
            <strong> {{ noDataMsg }}</strong>
          </div>
        </div>
        <div v-else>
          <div class="metrics-header">
            <div class="col-md-6 metrics-text">
              {{ userName }} ( {{ userType }} )
            </div>
          </div>
          <div class="row user-main">
            <div class="col-md-3">
              <TheUserSidebarComponent :meta="metaData" :user-type="userType" />
            </div>
            <div class="col-md-8">
              <TheUserMainComponent :surveys="surveys" :returned="returned" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'TheUserView',
  components: {
    TheUserSidebarComponent: () =>
      import('~/modules/nps/_components/UserSection/TheUserSidebar'),
    TheUserMainComponent: () =>
      import('~/modules/nps/_components/UserSection/TheUserMainSection'),
  },
  data() {
    return {
      metaData: null,
      npsRequestStatus: false,
      surveys: null,
      returned: false,
      noDataMsg: 'There are no surveys recorded for this user',
    };
  },
  computed: {
    ...mapGetters(['getSurveys', 'getCurrentNPSPage']),

    userType() {
      return this.$route.query.respondent_type;
    },
    userID() {
      return this.$route.query.respondent_id;
    },
    userName() {
      const surveys = this.surveys;
      return surveys !== null && surveys.length !== 0
        ? surveys[0].respondent_name
        : 'Not Set';
    },
    lastSurveyDate() {
      const surveys = this.surveys;
      return surveys !== null && surveys.length !== 0
        ? surveys[0].surveyed_on
        : 'Not Set';
    },
  },
  watch: {
    getSurveys(surveyData) {
      const metaData = surveyData.pagination;
      this.surveys = surveyData.data;
      metaData.lastSurveyDate = this.lastSurveyDate;
      this.metaData = metaData;
      this.returned = true;
    },
  },
  mounted() {
    if (process.client) {
      this.setSurveys({
        page: 1,
        params: {
          dismissed: 0,
          respondent_type: this.userType,
          respondent_id: this.userID,
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
.nps-user-holder {
  padding-left: 15px;
}
.metrics-header {
  margin-bottom: 20px;
}
.user-main {
  margin-left: 0;
}
</style>
