<template>
  <div>
    <div class="cancel-batch-dialog cancel-batch-action-section">
      <div class="batch-input-label">
        Select a day to reschedule order
      </div>
      <el-date-picker
        v-model="selectedDate"
        type="datetime"
        placeholder="Select date and time"
        class="fulfilment-date-class reschedule-fulfilment-date"
      >
      </el-date-picker>
      <el-button
        type="danger"
        class="action-submit-button"
        :class="
          !selectedDate
            ? 'disabled-batch-order-btn'
            : 'reschedule-batch-order-btn'
        "
        :disabled="!selectedDate"
      >
        Submit
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Schedule',
  data() {
    return {
      selectedDate: '',
    };
  },
};
</script>

<style lang="css" scoped></style>
