<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="fulfilment-label">Returns</h1>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs" :key="componentKey">
          <FiltersBar />
          <ReturnSection />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import ReturnSection from './_components/ReturnComponent.vue';

import FiltersBar from '../globals/_components/FiltersBar.vue';

export default {
  name: 'ReturnView',
  components: { FiltersBar, ReturnSection },
  data() {
    return {
      mode: 'ReturnView',
      componentKey: 0,
    };
  },
  watch: {},
  mounted() {
    const page = { name: 'ReturnView' };
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
