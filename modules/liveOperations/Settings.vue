<template>
  <div>
    <div class="settings-bar settings-top-bar">
      <div>
        <i class="fa fa-arrow-left settings-icon"></i>
        <h3 @click="back()" class="settings-header">Back to Dashboard</h3>
        <h4 class="criteria-header">Problematic Orders Criteria</h4>
      </div>
    </div>
    <div class="settings-bar settings-main-bar">
      <SideBar />
      <MainBar />
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
  mounted() {
    this.setBusinessUnits();
  },
  methods: {
    ...mapActions(['setBusinessUnits']),
    back() {
      this.$router.push('/liveOperations');
    },
  },
};
</script>

<style>
@import './_assets/style/liveops.css';
</style>
