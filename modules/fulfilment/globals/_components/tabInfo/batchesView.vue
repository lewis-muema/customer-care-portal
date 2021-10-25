<template lang="html">
  <div class="">
    <div class="add-batch-container">
      <el-button type="primary" class="add-batch-section">
        + Add to batch
      </el-button>
    </div>
    <div class="body-box col-md-12 movable-units-batch-table">
      <el-table :data="order_details" size="medium" :border="false">
        <el-table-column label="Status" prop="status" width="100">
          <template slot-scope="scope">
            <StatusBadge
              :status="order_details[scope.$index]['order_status']"
            />
          </template>
        </el-table-column>
        <el-table-column label="Destination" prop="destination_description">
        </el-table-column>
        <el-table-column label="Batch No." prop="most_recent_batch_id">
        </el-table-column>
        <el-table-column label="Packages" prop="ordered_items_count">
        </el-table-column>
        <el-table-column label="Actions" prop="action">
          <template slot-scope="scope">
            <div class="fulfilment-batch-actions">
              <i
                class="el-icon-view view-order"
                @click="viewBatchChildOrder(order_details[scope.$index])"
              >
                View
              </i>
              <i class="el-icon-delete remove-order">
                Remove
              </i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="getDialogTitle()"
      :visible.sync="batchDialogVisible"
      width="30%"
    >
      <BatchChildOrderDetail />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import StatusBadge from '../StatusBadge.vue';
import BatchChildOrderDetail from './BatchChildOrderDetail.vue';

export default {
  name: 'BatchesView',
  components: {
    StatusBadge,
    BatchChildOrderDetail,
  },
  data() {
    return {
      order_details: [],
      batchDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
    }),
  },
  watch: {
    batchDialogVisible(val) {
      if (!val) {
        this.setBatchChildOrderDetails({});
      }
    },
  },
  beforeMount() {
    this.order_details = this.getTableDetails.orders;
  },
  methods: {
    ...mapMutations({
      setBatchChildOrderDetails: 'fulfilment/setBatchChildOrderDetails',
      setBatchChildOrderDialog: 'fulfilment/setBatchChildOrderDialog',
    }),
    viewBatchChildOrder(data) {
      this.setBatchChildOrderDetails(data);
      this.batchDialogVisible = true;
    },
    getDialogTitle() {
      return `Fulfilment order ${
        !this.getBatchChildOrderDetails
          ? ''
          : this.getBatchChildOrderDetails.order_id
      } details`;
    },
  },
};
</script>

<style lang="css" scoped></style>
