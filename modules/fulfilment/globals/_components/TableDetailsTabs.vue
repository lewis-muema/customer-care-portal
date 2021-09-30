<template>
  <el-tabs type="card">
    <el-tab-pane label="Users">Users</el-tab-pane>
    <el-tab-pane label="Items">Items</el-tab-pane>
    <el-tab-pane label="Order Details">Order Details</el-tab-pane>
    <el-tab-pane label="Map">Map</el-tab-pane>
    <el-tab-pane label="Pricing Tiers">Pricing Tiers</el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
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
