<template>
  <div>
    <div class="settings-bar settings-top-bar">
      <div>
        <i class="fa fa-arrow-left settings-icon"></i>
        <h3 @click="back()" class="settings-header">Back to Dashboard</h3>
        <h4 class="criteria-header">Problematic Orders Criteria</h4>
      </div>
    </div>
    <div
      class="settings-bar settings-main-ba"
      v-if="criteria === null && loading"
    >
      <div class="text-center">
        Loading live operations criteria ....
        <i class="fa fa-spinner fa-spin loader"></i>
      </div>
    </div>
    <div class="settings-bar settings-main-bar" v-else>
      <SideBar :criteria="criteria" />
      <MainBar :criteria="criteria" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'Settings',
  components: {
    SideBar: () => import('./_components/settings/SideBar'),
    MainBar: () => import('./_components/settings/MainBar'),
  },
  data() {
    return {
      response_status: '',
      error_msg: '',
      loading: false,
      criteria: null,
    };
  },
  mounted() {
    this.setVendorTypes();
    this.retrieveCriteria();
  },
  methods: {
    ...mapActions([
      'setBusinessUnits',
      'request_live_ops_criteria',
      'setVendorTypes',
    ]),
    back() {
      this.$router.push('/liveOperations');
    },
    async retrieveCriteria() {
      this.loading = true;

      try {
        const response = await this.request_live_ops_criteria();
        this.criteria = response;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
  },
};
</script>

<style>
@import './_assets/style/liveops.css';
</style>
