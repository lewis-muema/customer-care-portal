<template>
  <div class="">
    <AddOrder :batch="batchID" />
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
          <template>
            <div class="fulfilment-batch-actions">
              <i class="fa fa-eye view-order" aria-hidden="true">
                <span> View </span>
              </i>
              <i class="fa fa-trash remove-order" aria-hidden="true">
                Remove
              </i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StatusBadge from '../StatusBadge.vue';

export default {
  name: 'BatchesView',
  components: {
    StatusBadge,
    AddOrder: () => import('../actions/AddOrder'),
  },
  data() {
    return {
      order_details: [],
      batchID: null,
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.order_details = this.getTableDetails.orders;
    this.batchID = this.getTableDetails.batch_id;
  },
};
</script>

<style lang="css" scoped></style>
