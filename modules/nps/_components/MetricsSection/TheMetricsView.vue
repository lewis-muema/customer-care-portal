<template>
  <div class="box box-info">
    <div class="box-body nps-holder">
      <div class="nps-user-holder" v-if="returned">
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
        <span>
          <div v-if="!returned" class="nps-user-holder">
            <div class="text-center">
              Loading NPS Metrics ....
              <i class="fa fa-spinner fa-spin loader"></i>
            </div>
          </div>
          <div class="row" v-else>
            <TheMetricsMainComponent />
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheMetricsView',
  components: {
    TheDatePickerComponent: () =>
      import('~/modules/nps/_components/TheDatePicker'),
    TheMetricsMainComponent: () =>
      import('~/modules/nps/_components/MetricsSection/TheMetricsMainSection'),
  },
  mixins: [NPSMxn],

  data() {
    return {
      returned: false,
    };
  },

  mounted() {
    if (process.client) {
      this.returned = true;
    }
  },
};
</script>
<style scoped>
.nps-user-holder {
  padding-left: 15px;
}
.metrics-header {
  margin-bottom: 29px;
  margin-left: 0;
}
.metrics-date {
  text-align: right;
  margin-left: 6em;
  width: 32%;
}
.metrics-main {
  margin-left: 0;
}
</style>
