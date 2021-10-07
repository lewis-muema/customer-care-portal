<template lang="html">
  <div class="">
    <div class="add-batch-container">
      <el-button type="primary" class="add-batch-section">
        + Add to batch
      </el-button>
    </div>
    <div class="body-box col-md-12 movable-units-batch-table">
      <el-table :data="batches_data" size="medium" :border="false">
        <el-table-column label="Status" prop="status" width="100">
          <template slot-scope="scope">
            <StatusBadge :status="batches_data[scope.$index]['status']" />
          </template>
        </el-table-column>
        <el-table-column label="Destination" prop="destination">
        </el-table-column>
        <el-table-column label="Batch No." prop="batch_no"> </el-table-column>
        <el-table-column label="Packages" prop="package_no"> </el-table-column>
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
import StatusBadge from '../StatusBadge.vue';

export default {
  name: 'BatchesView',
  components: {
    StatusBadge,
  },
  data() {
    return {
      batches_data: [
        {
          status: 'pending',
          destination: 'Ruiru View',
          batch_no: 'AWHDHDDN',
          package_no: 3,
        },
        {
          status: 'pending',
          destination: 'Ruiru View',
          batch_no: 'AWHDHDDN',
          package_no: 3,
        },
        {
          status: 'pending',
          destination: 'Ruiru View',
          batch_no: 'AWHDHDDN',
          package_no: 3,
        },
        {
          status: 'pending',
          destination: 'Ruiru View',
          batch_no: 'AWHDHDDN',
          package_no: 3,
        },
      ],
    };
  },
};
</script>

<style lang="css" scoped></style>
