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
import { mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'penalizingDataTable',
  props: {
    penaltyLogs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      comparator: [
        { code: 'ET', name: 'Equal to' },
        { code: 'GT', name: 'Greater than' },
        { code: 'LT', name: 'Less than' },
        { code: 'GET', name: 'Greater than or equal to' },
        { code: 'LET', name: 'Less than or equal to' },
      ],
      all_reasons_data: [],
      map_actions_data: [
        {
          id: 1,
          name: 'Block',
          display_name: 'Block from dispatch',
        },
        {
          id: 2,
          name: 'Penalty_Fee',
          display_name: 'Charge a penalty fee',
        },
        {
          id: 3,
          name: 'Reallocation',
          display_name: 'Allow partner to reallocate',
        },
        {
          id: 4,
          name: 'Reschedule',
          display_name: 'Allow customer to reschedule order',
        },
        {
          id: 5,
          name: 'Notification',
          display_name: 'Trigger notification alert',
        },
      ],
      penalizing_data: [
        { code: 'DELAYED_AT_PICKUP', name: 'Delayed at pick up' },
        { code: 'DELAYED_AT_DELIVERY', name: 'Delayed at delivery ' },
        { code: 'REASSIGNED', name: 'Reassigned orders ' },
      ],
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      vendor_type: [],
    };
  },
  created() {
    this.fetchVendorTypes();
    this.fetchAllReassignmentReasons();
  },
  methods: {
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      fetch_all_reallocation_reason: 'fetch_all_reallocation_reason',
    }),
    async fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'VENDORS',
        endpoint: 'types',
        apiKey: false,
        params: {
          pickup_country_code: 'KE',
          dropoff_country_code: 'KE',
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        this.vendor_type = data.vendor_types;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchAllReassignmentReasons() {
      const results = await this.fetch_all_reallocation_reason();
      this.all_reasons_data = results.data;
    },
    reassignData(param, comparator, value) {
      let resp = '';
      if (Object.keys(this.comparator).length > 0) {
        if (param === 'REASSIGNED') {
          const response = [];
          const arr = JSON.parse(value);
          for (let i = 0; i < arr.length; i++) {
            const reallocationData = this.all_reasons_data.find(
              location => location.reallocation_id === arr[i],
            );
            if (reallocationData === undefined) return 'Not found!';
            response.push(reallocationData.description);
            resp = response.toString();
          }
        } else {
          const data = this.comparator.find(
            location => location.code === comparator,
          );
          resp = `${data.name} ${value} orders`;
        }
      }
      return resp;
    },
    penalizeLabel(val) {
      let resp = 'Orders to penalize for be';
      if (val === 'REASSIGNED') {
        resp = 'Reassign reasons to penalize';
      }
      return resp;
    },
    fetchCountry(id) {
      const data = this.country_code.find(location => location.code === id);
      return data.name;
    },
    vendor(id) {
      let name = '';
      if (Object.keys(this.vendor_type).length > 0) {
        const data = this.vendor_type.find(location => location.id === id);
        name = data.name;
      }
      return name;
    },
    penalizingParams(id) {
      let name = '';
      if (Object.keys(this.penalizing_data).length > 0) {
        const data = this.penalizing_data.find(
          location => location.code === id,
        );
        name = data.name;
      }
      return name;
    },
    actionType(actionId) {
      if (actionId <= 3) {
        return 'Partner action';
      } else if (actionId === 4) {
        return 'Customer action';
      } else if (actionId === 5) {
        return 'Partner action / Customer action';
      }
    },
    actionPenalty(action) {
      if (action.action_id === 1) {
        return `for ${action.block_hours} hours`;
      } else if (action.action_id === 2) {
        const currency = action.currency === null ? '' : action.currency;
        return `of ${currency} ${action.penalty_fee}`;
      } else {
        return '';
      }
    },
    mapActionsId(actionId) {
      if (!actionId) return '';
      const actionInfo = this.map_actions_data.filter(
        action => action.id === actionId,
      );
      return actionInfo[0].display_name;
    },
    activeStatus(state) {
      let status = 'Deactivated';
      if (state === 1) {
        status = 'Active';
      }
      return status;
    },
    actionStatus(state) {
      let status = 'Activate';
      if (state === 1) {
        status = 'Deactivate';
      }
      return status;
    },
    async handleAction(row) {
      let data = {};
      data = row;
      if (row.status === 1) {
        data.status = 0;
        data.from_date = moment(row.from_date).format('YYYY-MM-DD');
        data.to_date = moment(row.to_date).format('YYYY-MM-DD');
      } else {
        data.status = 1;
        data.from_date = moment(row.from_date).format('YYYY-MM-DD');
        data.to_date = moment(row.to_date).format('YYYY-MM-DD');
      }

      const payload = {
        app: 'ADONIS_API',
        endpoint: `/penalties/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_reward(payload);
        this.loading_penalties = true;
        this.initiateData();
      } catch (error) {
        this.loading_penalties = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async handleArchive(row) {
      let data = {};
      data = row;

      data.status = 2;
      data.from_date = moment(row.from_date).format('YYYY-MM-DD');
      data.to_date = moment(row.to_date).format('YYYY-MM-DD');

      const payload = {
        app: 'ADONIS_API',
        endpoint: `/penalties/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_reward(payload);
        this.loading_penalties = true;
        this.initiateData();
      } catch (error) {
        this.loading_penalties = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
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
