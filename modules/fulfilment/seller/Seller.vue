<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="fulfilment-label">Seller</h1>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs" :key="componentKey">
          <!-- Seller view -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ReturnView',
  components: {},
  data() {
    return {
      mode: 'SellerView',
      componentKey: 0,
    };
  },
  watch: {},
  mounted() {
    const page = { name: 'SellerView' };
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
