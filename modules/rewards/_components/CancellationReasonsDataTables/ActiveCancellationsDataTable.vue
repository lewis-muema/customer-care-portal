<template>
  <div class="table-container">
    <el-table :data="setReallocationReasons" size="medium" :border="false">
      <el-table-column label="Country" prop="country">
        <template slot-scope="scope">
          {{ fetchCountry(setReallocationReasons[scope.$index]['country']) }}
        </template>
      </el-table-column>
      <el-table-column label="Vendor" prop="vendor_type"> </el-table-column>
      <el-table-column
        label="Reallocation reason"
        width="180"
        prop="description"
      >
      </el-table-column>
      <el-table-column label="When to display" width="180" prop="order_status">
        <template slot-scope="scope">
          {{
            formatOrderStatus(
              setReallocationReasons[scope.$index]['order_status'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Date added" prop="date_added">
        <template slot-scope="scope">
          {{
            getFormattedDate(
              setReallocationReasons[scope.$index]['date_added'],
              'DD/MM/YYYY ',
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status">
        <template slot-scope="scope">
          {{ activeStatus(setReallocationReasons[scope.$index]['status']) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" prop="status" class="data" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="
              setReallocationReasons[scope.$index]['status'] === 1
                ? 'action-button--danger'
                : 'action-button--active'
            "
            @click="setStatusState(setReallocationReasons[scope.$index])"
          >
            {{ setStatusText(setReallocationReasons[scope.$index]) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ActiveCancellationsDataTable',
  props: {
    setReallocationReasons: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.action-button--danger {
  background-color: #ff4949;
  border-color: #ff4949;
  color: #fff;
}
.action-button--active {
  background-color: #13ce66;
  border-color: #13ce66;
  color: #fff;
}
.action-button--archive {
  background-color: #3c8dbc;
  border-color: #3c8dbc;
  color: #fff;
}
</style>
