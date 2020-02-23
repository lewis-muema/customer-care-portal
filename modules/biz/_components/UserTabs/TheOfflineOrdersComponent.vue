<template>
  <div class="body-box">
    <div v-if="fetch_offline_orders === true">
      <p>
        Fetching Offline Orders Logs ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else-if="fetch_offline_orders === 'fail'">
      <p>
        Failed to retrieve Offline Orders Logs . Kindly retry again.
      </p>
    </div>
    <div v-else-if="fetch_offline_orders === 'no_data'">
      <p>
        No Offline Orders Logs
      </p>
    </div>
    <div v-else>
      <div class="">
        <el-table :data="tableData" size="medium" :border="false">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.partners">
                <el-table-column label="Partner name" prop="rider_name">
                </el-table-column>
                <el-table-column
                  label="Partner phone number"
                  prop="rider_phone"
                >
                </el-table-column>
                <el-table-column label="Days worked" prop="days">
                </el-table-column>
                <el-table-column label="Amount billed" prop="amount">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="Date Range" prop="range"> </el-table-column>
          <el-table-column
            label="Total partner cost"
            prop="total_partner_amount"
            width="150"
          >
          </el-table-column>
          <el-table-column
            label="Sendy take amount"
            prop="sendy_take_amount"
            width="150"
          >
          </el-table-column>
          <el-table-column
            label="Amount billed to customer"
            prop="bill_amount"
            width="200"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapMutations, mapActions } from 'vuex';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

export default {
  name: 'TheInvoiceLogsComponent',
  props: {
    user: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fetch_offline_orders: true,
      invoice: [],
      start_date: '',
      end_date: '',
      tableData: [],
    };
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  mounted() {
    this.fetchOfflineOrdersLogs();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      request_offline_logs: 'request_invoice_logs',
    }),

    async fetchOfflineOrdersLogs() {
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/offline_billing_logs',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 26,
          action_data: {
            cop_id: this.user,
            action_user: this.actionUser,
            _user_id: this.session.payload.data.admin_id,
            _user_email: this.session.payload.data.email,
          },
          request_id: '1611',
          action_user: this.actionUser,
        },
      };
      try {
        const res = await this.request_offline_logs(payload);
        const error = !this.status ? res.error : '';

        if (!res.data.length > 0) {
          this.fetch_offline_orders = 'no_data';
        } else {
          this.fetch_offline_orders = false;
        }
        const data = res.data;

        for (let i = 0, iLen = data.length; i < iLen; i += 1) {
          data[i].range = `${data[i].from} - ${data[i].to}`;
        }

        return (this.tableData = data);
      } catch (error) {
        this.fetch_offline_orders = 'fail';
      }
    },
  },
};
</script>
<style lang="css">
.el-table__row {
  height: 44px !important;
}
.el-table thead {
  color: #606266 !important;
}
.el-table {
  color: #555 !important;
  font-size: 13px !important;
}
.el-table .cell {
  line-height: 20px !important;
}

.el-table td,
.el-table th {
  padding: 10px 0 ;
}
.el-table--border td,
.el-table th.is-leaf {
  border-bottom: 1px solid #dcdfe6 ;
}

.el-table--border td,
.el-table--border th,
.el-table--border th {
  border-right: 1px solid #dcdfe6 ;
}

.el-table--border,
.el-table--group {
  border: 1px solid #dcdfe6 ;
}
.table-bordered td,
.table-bordered th {
  border: none ;
}
.el-table__expanded-cell {
  background-color: white ;
}
.el-table__expanded-cell:hover {
    background-color: white !important;
}

.el-table td,
.el-table th {
  padding: 0px ;
}
.el-table th,
.el-table tr {
  height: 41px !important;
}
.el-table{
  background-color: #f9f9f9 ;
}
.expanded{
  color: #212529;
  background-color: rgba(0,0,0,.075) !important;
}
.search-outer{
  margin-top: 3.7%;
}
.search-btn--inline{
  width: 52% !important;
  margin-left: 23%;
}
</style>
