<template lang="html">
  <div class="box box-info">
    <MapReArrangeView />
    <div class="fulfilment-header">
      <h1 class="fulfilment-label">Outbound orders</h1>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs">
          <el-tabs v-model="mode" @tab-click="handleClick" :key="componentKey">
            <FiltersBar />

            <el-tab-pane label="Delivery requests" name="ordersView">
              <OrdersView :key="componentKey" v-if="mode === 'ordersView'" />
            </el-tab-pane>
            <el-tab-pane label="Batched orders" name="batchesView">
              <BatchesView :key="componentKey" v-if="mode === 'batchesView'" />
            </el-tab-pane>
            <!-- <el-tab-pane label="Movable units" name="movableUnitsView">
              <MovableUnitsView
                :key="componentKey"
                v-if="mode === 'movableUnitsView'"
              />
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import OrdersView from './_components/OrdersComponent.vue';
import BatchesView from './_components/BatchesComponent.vue';
import MovableUnitsView from './_components/MovableUnitsComponent.vue';
import FiltersBar from '../globals/_components/FiltersBar.vue';
import MapReArrangeView from '../globals/_components/actions/MapReArrangeView';

export default {
  name: 'OutboundView',
  components: { OrdersView, BatchesView, FiltersBar, MapReArrangeView },
  data() {
    return {
      mode: 'ordersView',
      componentKey: 0,
      orderTableMetrics: {
        endpoint: 'missioncontrol/orders',
        id: 'order_id',
      },
      batchTableMetrics: {
        endpoint: 'missioncontrol/batches',
        id: 'batch_id',
      },
    };
  },
  watch: {},
  mounted() {
    const page = { name: 'ordersView' };
    this.handleClick(page);
  },
  methods: {
    ...mapMutations({
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
      setTableData: 'fulfilment/setTableData',
      setTableDetailKeyMetric: 'fulfilment/setTableDetailKeyMetric',
      setSelectedCountry: 'fulfilment/setSelectedCountry',
      setSelectedStatus: 'fulfilment/setSelectedStatus',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      this.setTableData([]);
      const tabName = `Outbound_${tab.name}`;
      this.updateActivePage(tabName);
      this.setFulfilmentType(tabName);
      this.handleTab();
      this.setTableMetrics(tab.name);
      this.setSelectedCountry(null);
      this.setSelectedStatus(null);
    },
    setTableMetrics(val) {
      if (val === 'ordersView') {
        this.setTableDetailKeyMetric(this.orderTableMetrics);
      }
      if (val === 'batchesView') {
        this.setTableDetailKeyMetric(this.batchTableMetrics);
      }
    },
  },
};
</script>
