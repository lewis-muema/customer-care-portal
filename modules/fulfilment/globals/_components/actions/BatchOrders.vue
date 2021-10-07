<template>
  <div>
    <el-row class="batch-details-holder">
      <el-col :span="12">Estimated weight : 400kgs </el-col>
      <el-col :span="12"> Total quantity : 40</el-col>
      <el-col :span="12"> Region : Makadara, Nairobi</el-col>
      <el-col :span="12">Waypoints : 5 locations </el-col>
    </el-row>

    <el-button type="primary" class="full-width action-submit-button">
      Batch
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'BatchOrders',
};
</script>

<style scoped>
.batch-details-holder {
  background: #f8fafb;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  padding: 16px;
}
</style>
