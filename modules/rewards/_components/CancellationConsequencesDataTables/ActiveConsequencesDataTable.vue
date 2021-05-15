<template>
  <div class="table-container">
    <el-table
      :data="activeCancellationConsequences"
      height="500"
      size="medium"
      :border="false"
    >
      <el-table-column label="Country" prop="country">
        <template slot-scope="scope">
          {{
            fetchCountry(
              activeCancellationConsequences[scope.$index]['country_code'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Vendor" prop="vendor_type_names">
        <template slot-scope="scope">
          {{
            formatVendorTypeNames(
              activeCancellationConsequences[scope.$index]['vendor_type_names'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="Cancellation reason"
        width="200"
        prop="cancellation_reason_name"
      >
      </el-table-column>
      <el-table-column label="Actions" width="200" prop="actions">
        <template slot-scope="scope">
          {{
            getActionTypes(
              activeCancellationConsequences[scope.$index]['actions'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Date added" prop="date_created">
        <template slot-scope="scope">
          {{
            getFormattedDate(
              activeCancellationConsequences[scope.$index]['date_created'],
              'DD/MM/YYYY ',
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status">
        <template slot-scope="scope">
          {{
            activeStatus(activeCancellationConsequences[scope.$index]['status'])
          }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" prop="status" class="data" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="
              activeCancellationConsequences[scope.$index]['status'] === 1
                ? 'action-button--danger'
                : 'action-button--active'
            "
            @click="
              setStatusState(activeCancellationConsequences[scope.$index])
            "
          >
            {{
              loading(
                activeCancellationConsequences[scope.$index]['id'],
                activeCancellationConsequences,
              )
                ? 'Processing...'
                : setStatusText(activeCancellationConsequences[scope.$index])
            }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CancellationReasonsForm from '@/modules/rewards/_components/CancellationReasonsForm';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ActiveConsequencesDataTable',
  data() {
    return {
      selectedCancellationReason: null,
      dialogFormVisible: false,
      formData: {},
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      activeCancellationConsequences: 'getActiveCancellationConsequences',
      active_countries: 'getActiveCountries',
      actions_data: 'getCancellationActions',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  created() {
    console.log('TABLE ', this.activeCancellationConsequences);
  },
  methods: {
    ...mapActions({
      update_cancellation_status: 'update_cancellation_reason',
    }),
    fetchCountry(code) {
      if (!code) return '';
      const data = this.active_countries.find(
        location => location.country_code === code,
      );
      return data.country_name;
    },
    getActionTypes(actionsArray) {
      const actionTypeArray = [];
      actionsArray.forEach(action => actionTypeArray.push(action.action_type));
      const duplicateCleanArray = [...new Set(actionTypeArray)];
      const actionData = this.mapActionTypesToAction(duplicateCleanArray);

      const actionName = actionData.map(action => {
        return action.display_name;
      });

      return actionName.toString();
    },
    mapActionTypesToAction(actionsIdArray) {
      const dataArray = [];
      actionsIdArray.map(actionType => {
        const data = this.actions_data.filter(
          action => action.id === actionType,
        );
        dataArray.push(...data);
      });
      return dataArray;
    },
    formatVendorTypeNames(vendorNamesArray) {
      if (!vendorNamesArray.length) return '';
      const formattedNames = vendorNamesArray.map(vendor => {
        return ` ${vendor}`;
      });
      return formattedNames.toString();
    },
    activeStatus(status) {
      return status === 1 ? 'Active' : 'Deactivated';
    },
    setStatusText(row) {
      return row.status === 1 ? 'Deactivate' : 'Activate';
    },
    getCurrentUsersCountryCode() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray);
    },
    loading(currentRow, selectedRow) {
      return currentRow === selectedRow;
    },
    async setStatusState(row) {
      this.selectedCancellationReason = row.id;
      const payload = {
        country_code: row.country_code,
        vendor_type_ids: this.convertStringToNumArray(row.vendor_type_ids),
        applicable_order_status: this.convertStringToNumArray(
          row.applicable_order_status,
        ),
        admin_id: this.getSession.payload.data.admin_id,
        status: row.status === 1 ? 2 : 1,
        cancel_reason: row.cancellation_reason,
        cancellation_reason_id: row.id,
        country_filter: this.getCurrentUsersCountryCode(),
      };

      await this.update_cancellation_status(payload);
      setTimeout(() => {
        this.selectedCancellationReason = null;
      }, 3000);
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
