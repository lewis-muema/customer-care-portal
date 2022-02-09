<template lang="html">
  <div class="">
    <div class="mc-seller-container">
      <div class="mc-seller-tabs">
        <el-tabs v-model="mode" @tab-click="handleClick" :key="componentKey">
          <FiltersBar />
          <el-tab-pane label="Delivery history" name="deliveryHistory">
            <DeliveryHistory
              :key="componentKey"
              v-if="mode === 'deliveryHistory'"
            />
          </el-tab-pane>
          <el-tab-pane label="Invoices" name="invoices">
            <Invoices :key="componentKey" v-if="mode === 'invoices'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import DeliveryHistory from './DeliveryHistory.vue';
import Invoices from './Invoices.vue';
import FiltersBar from '../../globals/_components/FiltersBar.vue';

export default {
  name: 'SingleSeller',
  components: { DeliveryHistory, Invoices, FiltersBar },
  data() {
    return {
      mode: 'deliveryHistory',
      componentKey: 0,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    const page = { name: 'deliveryHistory' };
    this.handleClick(page);
  },
  methods: {
    ...mapMutations({
      setSingleSellerPage: 'fulfilment/setSingleSellerPage',
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
      setTableData: 'fulfilment/setTableData',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(page) {
      this.setTableData([]);
      this.setSingleSellerPage(page.name);
      this.updateActivePage(page.name);
      this.setFulfilmentType(page.name);
      this.handleTab();
    },
  },
};
</script>
