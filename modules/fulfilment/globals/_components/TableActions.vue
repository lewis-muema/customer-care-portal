<template>
  <el-row :gutter="2">
    <el-col :span="2">
      <el-button type="primary" class="blue" size="mini" plain
        >Cancel</el-button
      >
    </el-col>
    <el-col :span="2">
      <el-button type="primary" class="blue" size="mini" plain
        >Tickets</el-button
      >
    </el-col>
    <el-col :span="2">
      <el-button type="primary" class="blue" size="mini" plain
        >Delivery Codes</el-button
      >
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'OrderActions',
};
</script>
<style scoped>
.blue {
  color: #528bb8;
  border-color: #528bb8;
  background-color: #ffffff;
}
.blue:hover {
  color: #ffffff;
  background-color: #528bb8;
  border: none;
}
</style>
