<template>
  <div class="metrics-sidebar">
    <div class="col-md-12">
      <div class="section-header">User Summary</div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Number of times surveyed</div>
      <div class="col-md-12 user-count">{{ totalSurveys }}</div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Last Time surveyed</div>
      <div class="col-md-12 user-count">{{ lastDurveyDate }}</div>
    </div>
  </div>
</template>
<script>
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheUserSidebar',
  mixins: [NPSMxn],
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalSurveys() {
      return this.meta !== null ? this.meta.total : 'Not Set';
    },
    lastDurveyDate() {
      return this.meta !== null
        ? this.convertToLocalTime(this.meta.lastSurveyDate, 'LLL')
        : 'Not Set';
    },
  },
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 133%;
  color: #f57f20;
}
.metrics-header {
  margin-top: 20px;
}
.metrics-sidebar {
  margin-bottom: 54px;
}
.user-header {
  font-size: 18px;
  line-height: 140%;
  color: #000000;
  margin-top: 35px;
  margin-bottom: 8px;
  font-weight: 600;
}

.user-count {
  font-weight: 400;
  font-size: 15px;
  line-height: 140%;
  margin-top: 11px;
}
.col-md-12 {
  padding-right: 0;
  padding-left: 0;
}
</style>
