<template>
  <div class="">
    <AddOrder :batch="batchID" v-if="isEditable" />
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
        <el-table-column label="Order No." prop="order_id"> </el-table-column>
        <el-table-column label="Items" prop="ordered_items_count">
        </el-table-column>
        <el-table-column label="Actions" prop="action">
          <template slot-scope="scope">
            <div class="fulfilment-batch-actions">
              <i
                class="el-icon-view view-order"
                @click="viewBatchChildOrder(order_details[scope.$index])"
              >
                <span class="child-order-action">View</span>
              </i>
              <i class="el-icon-delete remove-order" v-if="isEditable">
                <span class="child-order-action">Remove</span>
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
    AddOrder: () => import('../actions/AddOrder'),
    BatchChildOrderDetail,
  },
  data() {
    return {
      order_details: [],
      batchID: null,
      batchDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
    }),
    isEditable() {
      const status = this.getTableDetails.batch_status;
      return (
        status === 'BATCH_IN_COMPOSITION' ||
        status === 'BATCH_IN_HUB_PREPARATION' ||
        status === 'BATCH_PENDING_SHIPPING_ASSIGNMENT'
      );
    },
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
    this.batchID = this.getTableDetails.batch_id;
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
