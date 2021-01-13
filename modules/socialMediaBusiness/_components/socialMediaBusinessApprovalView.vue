<template lang="html">
  <div class="">
    <div class="social-media-tabs">
      <div
        class="social-media-tabs-titles"
        :class="mode === 'PendingView' ? 'active-price-configs-tab' : ''"
        @click="mode = 'PendingView'"
      >
        Pending
      </div>
      <div
        class="social-media-tabs-titles"
        :class="mode === 'ApprovedView' ? 'active-price-configs-tab' : ''"
        @click="mode = 'ApprovedView'"
      >
        Approved
      </div>
      <div
        class="social-media-tabs-titles"
        :class="mode === 'RejectedView' ? 'active-price-configs-tab' : ''"
        @click="mode = 'RejectedView'"
      >
        Rejected
      </div>
    </div>

    <div class="social-media-component">
      <PendingView :key="componentKey" v-if="mode === 'PendingView'" />
      <ApprovedView :key="componentKey" v-if="mode === 'ApprovedView'" />
      <RejectedView :key="componentKey" v-if="mode === 'RejectedView'" />
    </div>
  </div>
</template>

<script>
import PendingView from './PendingViewComponent.vue';
import ApprovedView from './ApprovedViewComponent.vue';
import RejectedView from './RejectedViewComponent.vue';

export default {
  name: 'socialMediaBusinessApprovalView',
  components: { ApprovedView, PendingView, RejectedView },
  data() {
    return {
      mode: 'PendingView',
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
