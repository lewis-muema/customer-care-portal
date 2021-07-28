<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="350px"
    :modal="false"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div>
      <i class="fa fa-check-circle fa-5x submit-success"></i>
    </div>
    <div class="mt-1">
      <span class="title"> Submitted </span>
      <div class="mt-1 sub-text">
        Offline order submitted and an invoice sent to <br />
        {{ customerName }}.
      </div>
      <hr />
      <el-button
        type="primary"
        class="primary-blue"
        @click="$emit('close', false)"
      >
        Close
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SubmitModal',
  props: ['dialogVisible', 'customerName'],
  data() {
    return {};
  },
};
</script>

<style scoped>
.sub-text {
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  color: #000000;
}
.primary-blue {
  width: 100%;
  color: white;
  background: #324ba8;
}
</style>
