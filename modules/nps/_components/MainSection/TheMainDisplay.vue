<template>
  <span class="survey-info-holder">
    <div class="col-md-12 main-holder">
      <div class="row date-info">
        <div class="col-md-6 pull-right">&nbsp;</div>
        <div class="row datepicker col-md-6">
          <div class="col-md-9 main-date">
            <TheDatePickerComponent />
          </div>
          <div v-if="!dateFilters" class="col-md-3 date-icon">
            <i class="fa fa-times-circle-o"></i>
          </div>
        </div>
      </div>
      <div class="row" :key="surveyTotalsComponentKey">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-secondary">
            <span v-if="!returned">Loading...</span>
            <span v-else>{{ metaInfo.total }} Responses</span>
          </button>
          <button
            v-for="(data, index) in commentsData"
            :key="index"
            type="button"
            class="btn btn-default"
            :class="{ active: index === activeItem }"
            @click="toggleComments(index, data.value)"
          >
            {{ data.title }}
          </button>
        </div>
      </div>
      <div>
        <TheSurveyComponent :survey-data="surveyData" :returned="returned" />
      </div>
    </div>
    <div class="row" v-if="returned && surveyData.length !== 0">
      <div class="col-md-4 pull-right bottom-pages">
        <div class="btn-group pagination" role="group">
          <button type="button" class="btn btn-default pages-number">
            <span class="pages-holder">
              Page {{ currentNPSPage }} of {{ lastNPSPage }}
            </span>
          </button>
          <button
            type="button"
            class="btn btn-default page"
            @click="previous()"
            :disabled="isPreviousDisabled"
          >
            <span class="accordion-item-trigger-icon previous"></span>
          </button>
          <button
            type="button"
            class="btn btn-default page"
            @click="next()"
            :disabled="isNextDisabled"
          >
            <span class="accordion-item-trigger-icon next"></span>
          </button>
        </div>
      </div>
    </div>
  </span>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheMainDisplay',
  components: {
    TheDatePickerComponent: () =>
      import('~/modules/nps/_components/TheDatePicker'),
    TheSurveyComponent: () =>
      import('~/modules/nps/_components/MainSection/TheSurveyComponent'),
  },
  mixins: [NPSMxn],
  props: {
    surveys: {
      type: Array,
      required: true,
    },
    metaData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeItem: 0,
      isActive: false,
      commentsStatus: null,
      group: null,
      countries: null,
      totalSurveys: null,
      surveyComponentKey: 0,
      surveyTotalsComponentKey: 1,
      requestedSurveys: null,
      requestedMetaData: null,
      accountType: null,
      activeBusinessUnits: null,
      requestedPage: 1,
      noDataMsg: 'There are no surveys matching this criteria',
      filters: false,
      returned: true,
      totalDetractors: 10,
      totalPassives: 10,
      totalPromoters: 10,
      startDate: null,
      endDate: null,
      dateFilters: false,
      commentsData: [
        {
          value: null,
          title: 'All',
          class: 'all active',
        },
        {
          value: 1,
          title: 'With Comments',
          class: 'comments',
        },
        {
          value: 0,
          title: 'Without Comments',
          class: 'no-comments',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getSurveys',
      'getNPSActiveGroup',
      'getNPSCommentStatus',
      'getActiveCountries',
      'getActiveAccountTypes',
      'getActiveBusinessUnits',
      'getCurrentNPSPage',
      'getLastNPSPage',
      'getNPSDateRange',
    ]),
    ...mapState(['currentNPSPage', 'lastNPSPage']),

    isNextDisabled() {
      return this.requestedPage === this.lastNPSPage;
    },
    isPreviousDisabled() {
      return this.requestedPage === 1;
    },
    metaInfo() {
      return this.filters ? this.requestedMetaData : this.metaData;
    },
    surveyData() {
      return this.filters ? this.requestedSurveys : this.surveys;
    },
    params() {
      const respondent_group = this.group;
      const comments = this.commentsStatus;
      const country_code = this.countries;
      const respondent_type = this.accountType;
      const business_unit_abbr = this.activeBusinessUnits;

      const date_from =
        this.startDate === null ? this.firstDayOfCurrentMonth : this.startDate;
      const date_to =
        this.endDate === null ? this.lastDayOfCurrentMonth : this.endDate;

      const dismissed = 0;

      const params = {
        dismissed,
        respondent_group,
        comments,
        country_code,
        respondent_type,
        business_unit_abbr,
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
    getSurveys(surveyData) {
      this.requestedSurveys = surveyData.data;
      const metaData = surveyData.pagination;
      this.requestedMetaData = metaData;

      this.setCurrentNPSPage(metaData.page);
      this.setLastNPSPage(metaData.lastPage);
      const updateMeta = this.setNPSMetaData(surveyData.meta);
      this.returned = true;
    },

    getNPSCommentStatus(status) {
      this.requestedSurveys = [];
      this.filters = true;
      this.sendRequest(this.params);
    },
    getNPSActiveGroup(group) {
      this.requestedSurveys = [];
      this.filters = true;
      this.group = group;
      this.sendRequest(this.params);
    },
    getActiveAccountTypes(accounts) {
      this.requestedSurveys = [];
      this.filters = true;
      this.accountType = accounts;
      const recentAccount = accounts.slice(-1).pop();
      if (accounts.length !== 0 && accounts.slice(-1).pop() === 'partner') {
        return;
      } else {
        this.sendRequest(this.params);
      }
    },
    getActiveCountries(countries) {
      this.requestedSurveys = [];
      this.countries = countries;
      this.filters = true;
      this.sendRequest(this.params);
    },
    getNPSDateRange(dateRange) {
      this.requestedSurveys = [];
      this.startDate = dateRange.startDate;
      this.endDate = dateRange.endDate;
      this.filters = true;
      this.sendRequest(this.params);
      this.dateFilters = true;
    },
    getActiveBusinessUnits(units) {
      this.requestedSurveys = [];
      this.filters = true;
      this.activeBusinessUnits = units;
      this.sendRequest(this.params);
    },
  },

  methods: {
    ...mapMutations([
      'setNPSCommentStatus',
      'setSurveys',
      'setCurrentNPSPage',
      'setLastNPSPage',
      'setNPSMetaData',
      'setNPSFilters',
    ]),
    ...mapActions(['setSurveys']),
    sendRequest(payload) {
      this.returned = false;
      const params = this.isEmpty(payload) ? '' : payload;
      this.setNPSFilters(params);
      if (this.requestedPage === null) {
        this.returned = true;
        this.noDataMsg = 'There are no more surveys matching these criteria';
      } else {
        this.setSurveys({
          page: this.requestedPage,
          params,
        });
      }
      this.forceRerender();
    },
    next() {
      const currentPage = this.currentNPSPage;
      const lastPage = this.lastNPSPage;
      this.requestedPage = currentPage < lastPage ? currentPage + 1 : null;
      this.requestedSurveys = [];
      this.filters = true;
      this.sendRequest(this.params);
    },
    previous() {
      const currentPage = this.currentNPSPage;
      const lastPage = this.lastNPSPage;
      this.requestedPage = currentPage > 1 ? currentPage - 1 : null;
      this.requestedSurveys = [];
      this.filters = true;
      this.sendRequest(this.params);
    },
    forceRerender() {
      this.surveyComponentKey += 1;
      this.paginationComponentKey += 1;
      this.surveyComponentKey += 1;
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    },
    toggleComments(index, group) {
      const arr = [];
      this.isActive = !this.isActive;
      this.activeItem = index;
      this.commentsStatus = group;
      this.setNPSCommentStatus(group);
    },
  },
};
</script>
<style scoped>
.survey-info-holder {
  width: 100%;
}
.datepicker {
  background: #f5f7fa;
  border-radius: 5px;
  margin-top: 34px;
  color: #000000;
  text-align: right;
  max-width: 50%;
  margin-left: 0%;
  padding-right: 20px;
}
.date-label {
  margin-left: 35px;
}
.date-info {
  padding-left: 7em;
  margin-bottom: 20px;
}
.fa-times-circle-o {
  color: #6b8399;
  font-size: 18px;
}
.btn-warning {
  background: #f7974a;
  border-radius: 5px;
  color: #ffffff;
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
  padding: 0;
}

.btn {
  border: none;
  font-weight: 600;
}
.btn-group {
  width: 100%;
}
.btn-secondary {
  background: #ffffff;
  border-radius: 5px;
  color: #000000;
  text-align: right;
  line-height: 140%;
  font-size: 16px;
}
.comments {
  border-radius: 5px 0px 0px 5px !important;
  border: 0 1px 0 0 solid red !important;
}
.no-comments {
  border-radius: 0px 5px 5px 0px;
}
.btn-default {
  background: #f5f7fa;
  color: #000000;
  line-height: 28px;
  border-right: 2px solid #bfd1e3;
}
.active {
  background: #093359;
  color: #ffffff;
  box-shadow: none;
}
.previous {
  -webkit-transform: translateY(-2px) rotate(130deg);
}
.next {
  -webkit-transform: translateY(-2px) rotate(315deg);
}
.page {
  background: #ffffff;
  border: 1px solid #bfd1e3;
  margin-right: 16px;
  width: 37px;
  height: 37px;
  border-radius: 100%;
  border-top-right-radius: 100% !important;
  border-bottom-right-radius: 100% !important;
  border-top-left-radius: 100% !important;
  border-bottom-left-radius: 100% !important;
  padding-top: 10px;
}
.pages-number {
  background: #ffffff;
  border-right: none;
}
.bottom-pages {
  margin-left: 75%;
  flex: none;
  width: auto;
}
.main-date {
  padding-right: 0px;
}
.date-icon {
  text-align: left;
  padding-top: 10px;
  font-size: 18px;
  padding-left: 0;
}
</style>
