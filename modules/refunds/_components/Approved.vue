<template lang="html">
  <div class="row">
    <div v-if="loading_approved_refunds" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <div class="body-box col-md-12 table-content">
        <el-table :data="approved_refunds_logs" size="medium" :border="false">
          <el-table-column label="Name" prop="name">
            <template slot-scope="scope">
              {{ approved_refunds_logs[scope.$index]['name'] }}
            </template>
          </el-table-column>
          <el-table-column label="Vendor" prop="vendor_type">
            <template slot-scope="scope">
              {{ vendor(approved_refunds_logs[scope.$index]['vendor_type']) }}
            </template>
          </el-table-column>
          <el-table-column label="Phone Number" prop="phone_no">
            <template slot-scope="scope">
              {{ approved_refunds_logs[scope.$index]['phone_no'] }}
            </template>
          </el-table-column>
          <el-table-column label="Submission Date" prop="date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  approved_refunds_logs[scope.$index]['date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount">
            <template slot-scope="scope">
              {{ approved_refunds_logs[scope.$index]['currency'] }}
              {{ approved_refunds_logs[scope.$index]['amount'] }}
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="status">
            <template>
              Approved
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import moment from 'moment';
import Loading from './LoadingComponent.vue';

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

export default {
  name: 'Declined',
  components: { Loading },
  data() {
    return {
      submitted: false,
      loading_approved_refunds: true,
      approved_refunds_logs: [],
      vendor_type: [],
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
    };
  },
  validations: {},
  computed: {
    ...mapGetters(['getSession']),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  mounted() {
    this.initiateData();
  },

  methods: {
    ...mapActions({
      perform_user_action: 'perform_user_action',
      request_vendor_types: 'request_vendor_types',
      request_rewards: 'requestRewards',
      request_refund_data: 'request_refund_data',
    }),
    initiateData() {
      this.fetchVendorTypes();
      this.requestRewards();
    },
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
    async requestRewards() {
      const session_data = this.getSession.payload.data;
      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'cc_refund_requests',
        apiKey: false,
        params: {
          action_user: session_data.name,
          user_id: session_data.admin_id,
        },
      };
      const arr = await this.request_refund_data(payload);
      this.approved_refunds_logs = arr.filter(obj => obj.status === 1);
      this.loading_approved_refunds = false;
    },
    vendor(id) {
      let name = '';
      if (Object.keys(this.vendor_type).length > 0) {
        const data = this.vendor_type.find(location => location.id === id);
        name = data.name;
      }
      return name;
    },
  },
};
</script>

<style lang="css" scoped>
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline {
  width: 50% !important ;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
  height: 2%;
}
.user-input {
  margin-bottom: 15px;
}
.form-inline {
  margin-left: 2%;
}
.centre-loader {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.outline-inner-data {
  width: 100%;
}
.invoice-loader--align {
  margin-left: 2%;
  margin-right: 1%;
}
.table-content {
  max-width: 98%;
  margin-left: 1%;
  margin-top: 2%;
}
.table-background {
  background: #fff;
}
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
.user-input {
  margin-bottom: 15px;
}
.form-inline {
  margin-left: 2%;
}

.action-button--danger{
  background-color: #ff4949;
  border-color: #ff4949;
  color: #fff;
}
.action-button--active{
  background-color: #13ce66;
  border-color: #13ce66;
  color: #fff;
}
.action-button--archive{
  background-color: #3c8dbc;
  border-color: #3c8dbc;
  color: #fff;
}
</style>
