<template>
  <el-table :data="penaltyLogs" size="medium" :border="false">
    <el-table-column type="expand">
      <template slot-scope="props">
        <div class="form-inline expand-logs-section">
          <div
            v-if="props.row.parameter && props.row.parameter !== 'REASSIGNED'"
            class="form-group col-md-3 expandable-header"
          >
            <label class="expandable-data">
              {{ penalizeLabel(props.row.parameter) }}</label
            >
            {{
              reassignData(
                props.row.parameter,
                props.row.parameter_comp,
                props.row.parameter_data,
              )
            }}
          </div>
          <div
            v-if="props.row.message"
            class="form-group col-md-3 expandable-header"
          >
            <label class="expandable-data">
              {{ mapActionsId(props.row.action_id) }} message</label
            >
            {{ props.row.message }}
          </div>
          <div
            v-if="props.row.parameter === 'REASSIGNED'"
            class="form-group col-md-3 expandable-header"
          >
            <label class="expandable-data">
              {{ actionType(props.row.action_id) }}
            </label>
            {{ mapActionsId(props.row.action_id) }}
            {{ actionPenalty(props.row) }}
          </div>

          <div
            v-if="props.row.from_date"
            class="form-group col-md-3 expandable-header"
          >
            <label class="expandable-data"> From</label>
            {{ getFormattedDate(props.row.from_date, 'DD/MM/YYYY ') }}
          </div>
          <div
            v-if="props.row.to_date"
            class="form-group col-md-3 expandable-header"
          >
            <label class="expandable-data"> To</label>
            {{ getFormattedDate(props.row.to_date, 'DD/MM/YYYY ') }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Country" prop="country">
      <template slot-scope="scope">
        {{ fetchCountry(penaltyLogs[scope.$index]['country']) }}
      </template>
    </el-table-column>
    <el-table-column label="Vendor type" prop="vendor_type">
      <template slot-scope="scope">
        {{ vendor(penaltyLogs[scope.$index]['vendor_type']) }}
      </template>
    </el-table-column>
    <el-table-column label="Penalizing parameter" width="180" prop="parameter">
      <template slot-scope="scope">
        <span v-if="penaltyLogs[scope.$index]['parameter'] !== 'REASSIGNED'">
          {{ penalizingParams(penaltyLogs[scope.$index]['parameter']) }}
        </span>
        <span v-else>
          {{
            reassignData(
              penaltyLogs[scope.$index]['parameter'],
              penaltyLogs[scope.$index]['parameter_comp'],
              penaltyLogs[scope.$index]['parameter_data'],
            )
          }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="Action" width="250" prop="block_hours">
      <template slot-scope="scope">
        {{ mapActionsId(penaltyLogs[scope.$index]['action_id']) }}
      </template>
    </el-table-column>
    <el-table-column label="Date Added" prop="updated_at">
      <template slot-scope="scope">
        {{
          getFormattedDate(
            penaltyLogs[scope.$index]['updated_at'],
            'DD/MM/YYYY ',
          )
        }}
      </template>
    </el-table-column>
    <el-table-column label="Status" prop="status">
      <template slot-scope="scope">
        {{ activeStatus(penaltyLogs[scope.$index]['status']) }}
      </template>
    </el-table-column>
    <el-table-column label="Actions" prop="status" class="data" width="200">
      <template slot-scope="scope">
        <el-button
          size="mini"
          :class="
            penaltyLogs[scope.$index]['status'] === 1
              ? 'action-button--danger'
              : 'action-button--active'
          "
          @click="handleAction(penaltyLogs[scope.$index])"
        >
          {{ actionStatus(penaltyLogs[scope.$index]['status']) }}
        </el-button>
        <el-button
          v-if="penaltyLogs[scope.$index]['status'] === 0"
          size="mini"
          class="action-button--archive"
          @click="handleArchive(penaltyLogs[scope.$index])"
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
  name: 'penalizingDataTable',
  mixins: [penalties_datatable_mixin],
  props: {
    penaltyLogs: {
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
