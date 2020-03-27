<template>
  <div>
    <div class="row survey" :key="surveyComponentKey">
      <div v-if="!returned" class="survey-info">
        <div class="text-center">
          <i class="fa fa-spinner fa-spin loader"></i>
        </div>
      </div>
      <div v-if="returned && surveyData.length === 0" class="survey-info">
        <div class="alert alert-info text-center">
          <strong> {{ noDataMsg }}</strong>
        </div>
      </div>

      <div
        v-for="(survey, index) in surveyData"
        :key="index"
        class="survey-info"
        v-else
      >
        <div :class="`row group-border border_${survey.respondent_group} `">
          <div :class="`col-md-1 score-display`">
            <div :class="`score ${survey.respondent_group}`">
              {{ survey.score }}
            </div>
          </div>
          <div class="col-md-10">
            <div class="survey-top">
              <span class="survey-header">
                <nuxt-link
                  class="survey-header"
                  :to="
                    `/nps/user?respondent_type=${survey.respondent_type}&respondent_id=${survey.respondent_id}`
                  "
                  >{{ survey.respondent_name }}</nuxt-link
                ></span
              >
              <span class="survey-period pull-right">
                {{ getDateFromNow(survey.surveyed_on) }}
              </span>
            </div>

            <div class="survey-body">{{ survey.comments }}</div>
          </div>
        </div>
        <div class="tag-holder row">
          Add tag
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheSurveyComponent',
  mixins: [NPSMxn],

  props: {
    surveyData: {
      type: Array,
      required: true,
    },
    returned: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      noDataMsg: 'There are no surveys matching this criteria',
      filters: false,
    };
  },
};
</script>
<style scoped>
.survey {
  margin-top: 20px;
  margin-top: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-top: 23px;
  padding-bottom: 23px;
}
.survey-info {
  width: 97%;
  margin-bottom: 20px;
  border-radius: 5px;
  margin-left: 18px;
  box-shadow: 0 0 1em #e6e7e8;
}
.bottom-pages {
  margin-left: 75%;
  flex: none;
  width: auto;
}
.score {
  padding-top: 2px;
  width: 37px;
  border-radius: 100px;
  color: #ffffff;
  font-weight: 700;
  font-size: 21px;
  height: 37px;
  text-align: center;
}
.passive {
  background: #6b8399;
}
.promoter {
  background: #21a642;
}
.detractor {
  background: #d9372b;
}
.score-display {
  margin-top: auto;
  margin-bottom: auto;
}

.group-border {
  overflow-y: auto;
  width: 100%;
  border: 1px solid #ebf1f7;
  margin-right: 0;
  margin-left: 0;
}
.tag-holder {
  padding: 9px 10px;
  border: none;
  width: 100%;
  color: #000000;
  margin-right: 0;
  margin-left: 0;
  background: #ecf0f5;
}
.survey-top {
  padding: 5px 0;
}
.survey-body {
  margin-bottom: 23px;
}
.survey-header {
  font-size: 17px;
  color: #f57f20;
  font-weight: 600;
  cursor: pointer;
}
.survey-period {
  color: #000000;
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
}
</style>
