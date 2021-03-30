<template>
  <el-table :data="penaltiesData" size="medium" :border="false">
    <el-table-column type="expand">
      <template slot-scope="props">
        <div class="form-inline row">
          <div
            v-if="props.row.action_data.message"
            class="form-group col-md-6 expandable-header"
          >
            <label class="expandable-data">
              {{ mapActionsId(props.row.action_id) }} message</label
            >
            {{ props.row.action_data.message }}
          </div>
          <div class="form-group col-md-6 expandable-header">
            <label class="expandable-data">
              {{ actionType(props.row.action_id) }}
            </label>
            {{ mapActionsId(props.row.action_id) }}
            {{ actionPenalty(props.row) }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Country" prop="country">
      <template slot-scope="scope">
        {{ fetchCountry(penaltiesData[scope.$index]['country']) }}
      </template>
    </el-table-column>
    <el-table-column label="Vendor type" prop="vendor_type">
      <template slot-scope="scope">
        {{ vendor(penaltiesData[scope.$index]['vendor_type_id']) }}
      </template>
    </el-table-column>
    <el-table-column label="Penalizing parameter" width="180" prop="parameter">
      <template slot-scope="scope">
        {{
          reallocationReasonMap(penaltiesData[scope.$index]['reallocation_id'])
        }}
      </template>
    </el-table-column>
    <el-table-column label="Action" width="250" prop="block_hours">
      <template slot-scope="scope">
        {{ mapActionsId(penaltiesData[scope.$index]['action_id']) }}
      </template>
    </el-table-column>
    <el-table-column label="Date Added" prop="updated_at">
      <template slot-scope="scope">
        {{
          getFormattedDate(
            penaltiesData[scope.$index]['updated_at'],
            'DD/MM/YYYY ',
          )
        }}
      </template>
    </el-table-column>
    <el-table-column label="Status" prop="status">
      <template slot-scope="scope">
        {{ activeStatus(penaltiesData[scope.$index]['status']) }}
      </template>
    </el-table-column>
    <el-table-column label="Actions" prop="status" class="data" width="200">
      <template slot-scope="scope">
        <el-button
          size="mini"
          :class="
            penaltiesData[scope.$index]['status'] === 1
              ? 'action-button--danger'
              : 'action-button--active'
          "
          @click="handleAction(penaltiesData[scope.$index])"
        >
          {{ actionStatus(penaltiesData[scope.$index]['status']) }}
        </el-button>
        <el-button
          v-if="penaltiesData[scope.$index]['status'] === 0"
          size="mini"
          class="action-button--archive"
          @click="handleArchive(penaltiesData[scope.$index])"
        >
          Archive
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import penalties_datatable_mixin from '@/mixins/penalties_datatable_mixin';

export default {
  name: 'NonPenalizingDataTable',
  mixins: [penalties_datatable_mixin],
  props: {
    penaltiesData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.expandable-data {
  width: 100%;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  color: #000000;
  margin-bottom: 3% !important;
  display: flex;
  justify-content: flex-start;
}
.expand-logs-section {
  width: 100% !important;
}
.expandable-header {
  margin-bottom: 15px;
  width: 20%;
}
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
