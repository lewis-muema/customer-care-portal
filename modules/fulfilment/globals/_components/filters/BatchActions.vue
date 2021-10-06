<template>
  <div class="fulfilment-batch-actions">
    <el-row class="text-right pr-2">
      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        v-if="page === 'Outbound_ordersView'"
      >
        Request consolidation
      </el-button>

      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        v-if="page === 'Outbound_batchesView'"
      >
        Create movable unit
      </el-button>

      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        v-if="page === 'Inbound_ordersView'"
      >
        Batch orders
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BatchActions',
  props: ['page'],
};
</script>

<style></style>
