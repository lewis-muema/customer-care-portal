<template lang="html">
  <div class="">
    <div class="social-media-tabs">
      <div
        class="social-media-tabs-titles"
        :class="mode === 'ApprovalView' ? 'active-price-configs-tab' : ''"
        @click="mode = 'ApprovalView'"
      >
        Approval
      </div>
    </div>

    <div class="social-media-component">
      <ApprovalView :key="componentKey" v-if="mode === 'ApprovalView'" />
    </div>
  </div>
</template>

<script>
import ApprovalView from './ApprovalViewComponent.vue';

export default {
  name: 'socialMediaBusinessApprovalView',
  components: { ApprovalView },
  data() {
    return {
      mode: 'ApprovalView',
      componentKey: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleTab() {
      this.componentKey += 1;
    },
  },
};
</script>

<style lang="css">
.social-media-tabs {
  display: flex;
  margin-bottom: -1px;
}
.social-media-tabs-titles {
  padding: 15px;
  color: #1b7fc3;
  font-size: 14px;
}
.active-price-configs-tab {
  border-top: 2px solid #1b7fc3;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  border-bottom: 1px solid white;
}
.social-media-component {
  border: 1px solid #ebebeb;
  padding: 30px;
}
</style>
