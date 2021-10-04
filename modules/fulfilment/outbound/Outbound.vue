<template lang="html">
  <div class="box box-info">
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
import { mapMutations } from 'vuex';

import OrdersView from './_components/OrdersComponent.vue';
import BatchesView from './_components/BatchesComponent.vue';
import MovableUnitsView from './_components/MovableUnitsComponent.vue';
import FiltersBar from '../globals/_components/FiltersBar.vue';

export default {
  name: 'OutboundView',
  components: { OrdersView, BatchesView, MovableUnitsView, FiltersBar },
  data() {
    return {
      mode: 'ordersView',
      componentKey: 0,
      ordersViewTableProps: [
        {
          name: 'Order Number',
          tag: 'order_no',
          width: '130',
        },
        {
          name: 'Status',
          tag: 'status',
          width: '130',
        },
        {
          name: 'Seller',
          tag: 'seller_name',
          width: '',
        },
        {
          name: 'Recipient',
          tag: 'recipient_name',
          width: '',
        },
        {
          name: 'Time',
          tag: 'time_placed',
          width: '150',
        },
        {
          name: 'Destination',
          tag: 'destination_location',
          width: '120',
        },
        {
          name: 'Assigned Batch',
          tag: 'assigned_batch_no',
          width: '130',
        },
        {
          name: 'Rider',
          tag: 'rider_name',
          width: '',
        },
        {
          name: 'Region',
          tag: 'city_name',
          width: '',
        },
      ],
      batchesViewTableProps: [],
      movableUnitsViewTableProps: [],
    };
  },
  computed: {
    getFilteredProps() {
      let data = [];

      if (this.mode === 'ordersView') {
        data = this.ordersViewTableProps;
      } else if (this.mode === 'batchesView') {
        data = this.batchesViewTableProps;
      } else {
        data = this.movableUnitsViewTableProps;
      }
      return data;
    },
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
      setTableProps: 'fulfilment/setTableProps',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      const tabName = `Outbound_${tab.name}`;
      this.updateActivePage(tabName);
      this.setFulfilmentType(tabName);
      this.setTableProps(this.getFilteredProps);
      this.handleTab();
    },
  },
};
</script>
