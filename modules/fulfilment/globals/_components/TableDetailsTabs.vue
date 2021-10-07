<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Users" v-if="usersTab.includes(getFulfilmentType)">
      <users />
    </el-tab-pane>
    <el-tab-pane label="Items" v-if="itemsTab.includes(getFulfilmentType)">
      <items />
    </el-tab-pane>
    <el-tab-pane
      label="Order Details"
      v-if="orderDetailsTab.includes(getFulfilmentType)"
    >
      <order-details />
    </el-tab-pane>
    <el-tab-pane
      label="Pricing Tiers"
      v-if="pricingTiersTab.includes(getFulfilmentType)"
    >
      <pricing-tiers />
    </el-tab-pane>
    <el-tab-pane
      :label="batchLabel"
      v-if="batchesTab.includes(getFulfilmentType)"
    >
      <batches />
    </el-tab-pane>
    <el-tab-pane
      label="Batch details"
      v-if="batchesDetailsTab.includes(getFulfilmentType)"
    >
      <batch-details />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapGetters } from 'vuex';
import users from './tabInfo/users.vue';
import items from './tabInfo/items.vue';
import orderDetails from './tabInfo/orderDetails.vue';
import pricingTiers from './tabInfo/pricingTiers.vue';
import batches from './tabInfo/batchesView.vue';
import batchDetails from './tabInfo/batchesDetails.vue';

export default {
  components: {
    users,
    items,
    orderDetails,
    pricingTiers,
    batches,
    batchDetails,
  },
  data() {
    return {
      activeName: 'first',
      usersTab: ['Outbound_ordersView', 'ReturnView'],
      itemsTab: ['Outbound_ordersView', 'ReturnView'],
      orderDetailsTab: ['Outbound_ordersView', 'ReturnView'],
      pricingTiersTab: ['Outbound_ordersView', 'ReturnView'],
      batchesTab: ['Outbound_movableUnitsView'],
      batchesDetailsTab: ['Outbound_movableUnitsView'],
      batch_count: 4,
    };
  },
  computed: {
    ...mapGetters({
      getFulfilmentType: 'fulfilment/getFulfilmentType',
    }),
    batchLabel() {
      return `Batches (${this.batch_count})`;
    },
  },
  methods: {},
};
</script>
<style>
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 4px solid #1b7fc3;
  color: #000;
}
.el-tabs--border-card > .el-tabs__header {
  background-color: #ffffff;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  padding-top: 5px;
}
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #1b7fc3;
}
</style>
