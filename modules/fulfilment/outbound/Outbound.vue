<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="fulfilment-label">Outbound orders</h1>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs">
          <el-tabs v-model="mode">
            <el-tab-pane label="Delivery requests" name="ordersView">
              <OrdersView :key="componentKey" v-if="mode === 'ordersView'" />
            </el-tab-pane>
            <el-tab-pane label="Batched orders" name="batchesView">
              <BatchesView :key="componentKey" v-if="mode === 'batchesView'" />
            </el-tab-pane>
            <el-tab-pane label="Movable units" name="movableUnitsView">
              <MovableUnitsView
                :key="componentKey"
                v-if="mode === 'movableUnitsView'"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrdersView from './_components/OrdersComponent.vue';
import BatchesView from './_components/BatchesComponent.vue';
import MovableUnitsView from './_components/MovableUnitsComponent.vue';

export default {
  name: 'OutboundView',
  components: { OrdersView, BatchesView, MovableUnitsView },
  data() {
    return {
      mode: 'ordersView',
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
