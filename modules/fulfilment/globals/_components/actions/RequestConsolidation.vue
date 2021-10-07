<template>
  <div>
    <div class="item item-label">Orders selected</div>
    <div class="item item-value">5 orders</div>
    <div class="item item-label mt-8">Number of Items</div>
    <div class="item item-value">22</div>

    <el-button type="primary" class="full-width action-submit-button">
      Request for consolidation
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'RequestConsolidation',
};
</script>
<style scoped>
.item {
  font-size: 16px;
  line-height: 27px;
  letter-spacing: 0.112081px;
  color: #000000;
}
.item-value {
  margin-bottom: 1em;
}
</style>
