<template>
  <div>
    <div class="col-md-12">
      <div class="section-header">NPS Survey History</div>
    </div>
    <div>
      <TheSurveyComponent :survey-data="surveys" :returned="returned" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheUserMainSection',

  components: {
    TheSurveyComponent: () =>
      import('~/modules/nps/_components/MainSection/TheSurveyComponent'),
  },
  props: {
    surveys: {
      type: Array,
      required: true,
    },
    returned: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 125%;
  color: #000000;
}
</style>
