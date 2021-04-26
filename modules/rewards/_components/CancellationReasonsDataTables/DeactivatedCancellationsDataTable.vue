<template>
  <div class="table-container">
    <el-table :data="setCancellationReasons" size="medium" :border="false">
      <el-table-column label="Country" prop="country">
        <template slot-scope="scope">
          {{
            fetchCountry(setCancellationReasons[scope.$index]['country_code'])
          }}
        </template>
      </el-table-column>
      <el-table-column label="Vendor" prop="vendor_type_names">
        <template slot-scope="scope">
          {{
            formatVendorTypeNames(
              setCancellationReasons[scope.$index]['vendor_type_names'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="Cancellation reason"
        width="180"
        prop="cancellation_reason"
      >
      </el-table-column>
      <el-table-column
        label="When to display"
        width="180"
        prop="order_status_names"
      >
        <template slot-scope="scope">
          {{
            formatOrderStatus(
              setCancellationReasons[scope.$index]['order_status_names'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Date added" prop="date_created">
        <template slot-scope="scope">
          {{
            getFormattedDate(
              setCancellationReasons[scope.$index]['date_created'],
              'DD/MM/YYYY ',
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status">
        <template slot-scope="scope">
          {{ activeStatus(setCancellationReasons[scope.$index]['status']) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" prop="status" class="data" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="
              setCancellationReasons[scope.$index]['status'] === 1
                ? 'action-button--danger'
                : 'action-button--active'
            "
            @click="setStatusState(setCancellationReasons[scope.$index])"
          >
            {{ setStatusText(setCancellationReasons[scope.$index]) }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openEditDialog(setCancellationReasons[scope.$index])"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Edit Cancellation Reason"
      :visible.sync="dialogFormVisible"
      append-to-body
    >
      <cancellation-reasons-form
        @showDialog="closeDialog"
        :form-data-type="formData"
      />
    </el-dialog>
  </div>
</template>

<script>
import CancellationReasonsForm from '@/modules/rewards/_components/CancellationReasonsForm';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DeactivatedCancellationsDataTable',
  components: {
    CancellationReasonsForm,
  },
  data() {
    return {
      dialogFormVisible: false,
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      formData: {},
    };
  },
  computed: {
    ...mapGetters({
      setCancellationReasons: 'getDeactivatedCancellationReasons',
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  methods: {
    ...mapActions({
      update_cancellation_status: 'update_cancellation_reason',
    }),
    fetchCountry(id) {
      if (!id) return '';
      const data = this.country_code.find(location => location.code === id);
      return data.name;
    },
    formatOrderStatus(orderStatus) {
      if (!orderStatus.length) return '';
      const formattedStatus = orderStatus.map(status => {
        return ` ${status}`;
      });
      return formattedStatus.toString();
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
    openEditDialog(row) {
      this.dialogFormVisible = true;
      this.recordData = row;
      this.formData = {
        data: row,
        operation: 'edit',
      };
    },
    closeDialog(showDialog) {
      this.dialogFormVisible = showDialog;
    },
    convertStringToNumArray(arrayAsString) {
      const finalArray = [];
      const initArr = arrayAsString.split(',');

      for (let i = 0; i < initArr.length; i++) {
        if (i === 0) {
          const firstValue = initArr[0].split('[')[1];
          finalArray.push(parseInt(firstValue));
        } else if (i === initArr.length - 1) {
          const lastValue = initArr[i].split(']')[0];
          finalArray.push(parseInt(lastValue));
        } else {
          finalArray.push(parseInt(initArr[i]));
        }
      }

      return [...new Set(finalArray)];
    },
    async setStatusState(row) {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      const countryCode = countryCodeArray.split('"')[1];

      const payload = {
        country_code: row.country_code,
        vendor_type_ids: this.convertStringToNumArray(row.vendor_type_ids),
        applicable_order_status: this.convertStringToNumArray(
          row.applicable_order_status,
        ),
        admin_id: this.getSession.payload.data.admin_id,
        status: row.status === 1 ? 2 : 1,
        cancellation_reason_id: row.id,
        cancel_reason: row.cancellation_reason,
        country_filter: countryCode,
      };
      await this.update_cancellation_status(payload);
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
