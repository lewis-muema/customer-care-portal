<template>
  <div>
    <div class="cancel-batch-dialog cancel-batch-action-section">
      <div class="batch-input-label batch-cancel-label">
        Why do you want to cancel?
      </div>
      <el-input
        type="textarea"
        class="batch-cancellation-reason"
        :rows="2"
        placeholder="Please input"
        v-model="cancel_reason"
      >
      </el-input>

      <el-button
        type="danger"
        class="action-submit-button"
        :class="
          !cancel_reason ? 'disabled-batch-order-btn' : 'cancel-batch-order-btn'
        "
        :disabled="!cancel_reason"
      >
        Cancel order
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cancel',
  data() {
    return {
      cancel_reason: '',
    };
  },
};
</script>

<style lang="css" scoped></style>
