<template>
  <el-tabs type="card">
    <el-tab-pane label="Users">
      <users />
    </el-tab-pane>
    <el-tab-pane label="Items">
      <items />
    </el-tab-pane>
    <el-tab-pane label="Order Details">
      <order-details />
    </el-tab-pane>
    <el-tab-pane label="Pricing Tiers">
      <pricing-tiers />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import users from './tabInfo/users.vue';
import items from './tabInfo/items.vue';
import orderDetails from './tabInfo/orderDetails.vue';
import pricingTiers from './tabInfo/pricingTiers.vue';

export default {
  components: { users, items, orderDetails, pricingTiers },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style>
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 3px solid #1b7fc3;
  color: #000;
}
</style>
