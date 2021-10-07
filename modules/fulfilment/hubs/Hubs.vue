<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="fulfilment-label">Hubs</h1>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs" :key="componentKey">
          <HubSection class="hub-margin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import HubSection from './_components/HubsComponent.vue';

export default {
  name: 'HubView',
  components: { HubSection },
  data() {
    return {
      mode: 'HubsView',
      componentKey: 0,
    };
  },
  watch: {},
  mounted() {
    const page = { name: 'HubsView' };
    this.handleClick(page);
  },
  methods: {
    ...mapMutations({
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
      setTableData: 'fulfilment/setTableData',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      this.setTableData([]);
      this.updateActivePage(this.mode);
      this.setFulfilmentType(this.mode);
      this.handleTab();
    },
  },
};
</script>
