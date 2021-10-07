<template>
  <div class="fulfilment-batch-actions">
    <el-row class="text-right pr-2">
      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        :disabled="selectedOrders.length === 0"
        v-if="page === 'Outbound_ordersView'"
        @click="showModal('consolidation', 'Request for consolidation')"
      >
        Request consolidation
      </el-button>

      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        :disabled="selectedOrders.length === 0"
        v-if="page === 'Outbound_batchesView'"
        @click="showModal('movable', 'Create a movable unit')"
      >
        Create movable unit
      </el-button>

      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        :disabled="selectedOrders.length === 0"
        v-if="page === 'Inbound_ordersView'"
        @click="showModal('batching', 'About these orders')"
      >
        Batch orders
      </el-button>
    </el-row>
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="30%">
      <RequestConsolidation v-if="page === 'Outbound_ordersView'" />
      <CreateMovableUnit v-if="page === 'Outbound_batchesView'" />
      <BatchOrders v-if="page === 'Inbound_ordersView'" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'BatchActions',
  components: {
    RequestConsolidation: () => import('../actions/RequestConsolidation'),
    CreateMovableUnit: () => import('../actions/CreateMovableUnit'),
    BatchOrders: () => import('../actions/BatchOrders'),
  },
  props: ['page'],

  data() {
    return {
      selectedOrders: [],
      centerDialogVisible: false,
      title: '',
    };
  },

  computed: {
    ...mapGetters({
      getCheckedOrders: 'fulfilment/getCheckedOrders',
    }),
    modalTitle() {
      const data = {
        Outbound_ordersView: 'Delivery Requests',
        Outbound_batchesView: 'Batched Orders',
        Outbound_movableUnitsView: 'Movable Units',
      };
      return data;
    },
  },
  watch: {
    getCheckedOrders(orders) {
      this.selectedOrders = orders;
    },
  },
  methods: {
    showModal(action, title) {
      this.title = title;
      this.centerDialogVisible = true;
    },
  },
};
</script>

<style>
.fulfilment-batch-actions .el-dialog__title {
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0.112081px;
  color: #000000;
}
.fulfilment-batch-actions .el-dialog__headerbtn .el-dialog__close {
  color: #000000;
  font-weight: 700;
}
.fulfilment-batch-actions .el-dialog__body {
  padding: 13px 20px;
}
</style>
