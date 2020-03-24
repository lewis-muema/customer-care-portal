<template>
  <div class="row metrics-sidebar">
    <div class="col-md-12">
      <div class="section-header">Number of Surveys sent</div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Clients surveyed</div>
      <div class="col-md-12 user-count">345</div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Partners surveyed</div>
      <div class="col-md-12 user-count">1444</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheMetricsSidebar',
  props: {
    surveys: {
      type: Object,
      required: true,
    },
  },
  computed: {
    users() {
      const users = ['peer', 'cop', 'partner', 'owner'];
      return users;
    },
    // userCount() {

    // }
  },
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 133%;
}
.metrics-sidebar {
  margin-left: 20px;
}
.user-header {
  font-size: 18px;
  line-height: 28px;
  color: #000000;
  margin-top: 23px;
  margin-bottom: 8px;
}
.user-count {
  font-weight: 600;
  font-size: 20px;
  line-height: 140%;
}
.col-md-12 {
  padding-right: 0;
  padding-left: 0;
}
</style>
