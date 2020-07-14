<template lang="html">
  <div class="row">
    <div v-if="loading_pending_refunds" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <div v-if="state === 1">
        <div class="body-box col-md-12 table-content">
          <el-table :data="pending_refund_logs" size="medium" :border="false">
            <el-table-column label="Name" prop="name">
              <template slot-scope="scope">
                {{ pending_refund_logs[scope.$index]['name'] }}
              </template>
            </el-table-column>
            <el-table-column label="Vendor" prop="vendor_type">
              <template slot-scope="scope">
                {{ vendor(pending_refund_logs[scope.$index]['vendor_type']) }}
              </template>
            </el-table-column>
            <el-table-column label="Phone Number" prop="phone_no">
              <template slot-scope="scope">
                {{ pending_refund_logs[scope.$index]['phone_no'] }}
              </template>
            </el-table-column>
            <el-table-column label="Submission Date" prop="date">
              <template slot-scope="scope">
                {{
                  getFormattedDate(
                    pending_refund_logs[scope.$index]['date'],
                    'DD/MM/YYYY ',
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column label="Amount" prop="amount">
              <template slot-scope="scope">
                {{ pending_refund_logs[scope.$index]['currency'] }}
                {{ pending_refund_logs[scope.$index]['amount'] }}
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="status">
              <template>
                Pending
              </template>
            </el-table-column>
            <el-table-column label="Action" prop="status">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  class="view-refund-data"
                  @click="openRefundPreview(pending_refund_logs[scope.$index])"
                >
                  View
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else>
        <div class="body-box col-md-12 table-content refunds-dialog">
          <div class="inner-dialog">
            <div class="" style="">
              <i class="el-icon-back edit-back" @click="one_step_back" />
            </div>
            <div class="drag-image">
              <div class="rider-summary-info refunds-rider-details">
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Name
                  </p>
                  <p class="refund-text">{{ requestViewData.name }}</p>
                </div>
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Phone Number
                  </p>
                  <p class="refund-text">{{ requestViewData.phone_no }}</p>
                </div>
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Vendor
                  </p>
                  <p class="refund-text">
                    {{ vendor(requestViewData.vendor_type) }}
                  </p>
                </div>
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Submission Date
                  </p>
                  <p class="refund-text">
                    {{ getFormattedDate(requestViewData.date, 'DD/MM/YYYY ') }}
                  </p>
                </div>
              </div>
              <div class="rider-summary-info">
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Activity Log
                  </p>
                  <p class="refund-text refunds-activity-log">
                    No activity yet
                  </p>
                </div>
              </div>
            </div>
            <div class="main-dialog">
              <div class="documents-summary-info">
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Description
                  </p>
                  <p class="refund-text">{{ requestViewData.description }}</p>
                </div>
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Amount to be refunded
                  </p>
                  <p class="refund-text">
                    {{ requestViewData.currency }} {{ requestViewData.amount }}
                  </p>
                </div>
                <div class="request-refund-inputs">
                  <p class="request-refund-label">
                    Order number
                  </p>
                  <p class="refund-text">{{ requestViewData.order_no }}</p>
                </div>
                <div class="request-refund-inputs" style="padding-bottom: 5%;">
                  <p class="request-refund-label">
                    Documents
                  </p>
                  <div class="download-refund-img">
                    <img
                      class="refund-documents"
                      :src="requestViewData.documents"
                      alt=""
                    />
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    class="approve-refund"
                    @click="approveRefund()"
                    >Approve</el-button
                  >
                  <el-button class="decline-refund" @click="openDeclineDialog()"
                    >Decline</el-button
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="decline-refunds-pop-up">
          <el-dialog
            :visible.sync="addDeclineReasons"
            width="30%"
            class="updateDeclineReasonsDialog"
            :modal-append-to-body="false"
          >
            <div class="decline-refunds-outer">
              <p class="add-refund-reason-setup">
                Decline Reason
              </p>
              <div class="">
                <div class="refund-reason--inner-section">
                  <div class="">
                    <div class="">
                      <textarea
                        name="name"
                        rows="5"
                        class="refund-textarea add-refund-reason"
                        v-model="declineReason"
                      />
                    </div>
                    <div v-if="submitted" class="invalid-decline-reason">
                      Decline Reason is required !
                    </div>
                  </div>
                </div>
              </div>

              <div class="">
                <div class="decline-refund-submit">
                  <el-button
                    class="decline-refund decline-refund-btn"
                    @click="declineRefund()"
                    >Decline</el-button
                  >
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
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
  name: 'Pending',
  components: { Loading },
  data() {
    return {
      loading_pending_refunds: true,
      pending_refund_logs: [],
      vendor_type: [],
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      state: 1,
      requestViewData: {},
      addDeclineReasons: false,
      submitted: false,
      declineReason: '',
    };
  },
  validations: {
    declineReason: { required },
  },
  computed: {
    ...mapGetters(['getSession']),
  },
  watch: {
    getSession(session) {
      return session;
    },
    declineReason() {
      this.submitted = false;
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
      initiate_refund_request: 'request_refund_data',
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
      this.pending_refund_logs = arr.filter(obj => obj.status === 0);
      this.loading_pending_refunds = false;
    },
    vendor(id) {
      let name = '';
      if (Object.keys(this.vendor_type).length > 0) {
        const data = this.vendor_type.find(location => location.id === id);
        name = data.name;
      }
      return name;
    },
    one_step_back() {
      this.state = 1;
      this.requestViewData = {};
    },
    openRefundPreview(data) {
      this.requestViewData = data;
      this.state = 2;
    },
    async approveRefund() {
      const notification = [];
      let actionClass = '';
      const session_data = this.getSession.payload.data;
      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'approve_refund_request',
        apiKey: false,
        params: {
          refund_request_id: this.requestViewData.id,
          rider_id: this.requestViewData.rider_id,
          action_user: session_data.name,
          user_id: session_data.admin_id,
        },
      };
      try {
        const data = await this.initiate_refund_request(payload);
        this.reloadData();
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async declineRefund() {
      const notification = [];
      let actionClass = '';

      const session_data = this.getSession.payload.data;
      if (this.declineReason === '') {
        this.submitted = true;
      } else {
        const payload = {
          app: 'PARTNERS_APP',
          endpoint: 'decline_refund_request',
          apiKey: false,
          params: {
            refund_request_id: this.requestViewData.id,
            rider_id: this.requestViewData.rider_id,
            action_user: session_data.name,
            user_id: session_data.admin_id,
            reason: this.declineReason,
          },
        };
        try {
          const data = await this.initiate_refund_request(payload);
          this.reloadData();
        } catch (error) {
          notification.push('Something went wrong. Please try again.');
          actionClass = 'danger';
        }

        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },
    reloadData() {
      this.addDeclineReasons = false;
      this.submitted = false;
      this.state = 1;
      this.loading_pending_refunds = true;
      this.initiateData();
    },
    openDeclineDialog() {
      this.addDeclineReasons = true;
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
.inner-dialog {
  display: flex;
  flex-wrap: wrap;
}
.drag-image {
  flex: 25%;
  padding: 0px 20px 20px;
  margin-right: 10% !important;
}
.main-dialog {
  flex: 55%;
  padding: 0px 20px 20px;
}
.rider-summary-info{
  border: 1px solid #BEBEBE;
  box-sizing: border-box;
  border-radius: 6px;
  min-height: 130px !important;
  background-color: #FFF;
}
.documents-summary-info{
  border: 1px solid #BEBEBE;
  box-sizing: border-box;
  border-radius: 6px;
  min-height: 460px !important;
  background-color: #FFF;
}
.request-refund-inputs {
  padding: 0px 10px 10px;
}
.request-refund-label {
  font-size: 16px;
  line-height: 21px;
  color: #000000;
  margin-top: 4% !important;
  margin-bottom: 0 !important;
}
.refund-text {
  font-size: 15px;
}
.dialog-footer {
  text-align: center !important;
}
.approve-refund {
  margin-right: 0%;
  width: 22%;
  margin-left: 2%;
  margin-bottom: 3%;
  margin-top: 3%;
}
.decline-refund {
  margin-right: 0%;
  width: 22%;
  margin-left: 2%;
  background: #FF7100;
  color: #FFFFFF;
  margin-bottom: 3%;
  margin-top: 3%;
}
.edit-back {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: .3s;
  line-height: 50px !important;
  cursor: pointer;
  border: 1px solid #555;
  text-align: center;
  font-size: 23px;
  background-color: #FFF;
}
.refunds-dialog{
  margin-top: 2% !important;
}
.refunds-rider-details{
  margin-bottom: 17% !important;
}
.refunds-activity-log{
  margin-top: 9% !important;
}
.download-refund-img {
  max-height: 370px;
}
.refund-documents {
  width: 48%;
  margin-top: 2%;
  max-height: 370px;
}
.view-refund-data{
  width: 65%;
}
.decline-refunds-outer{
  margin-left: 6%;
  margin-right: 6%;
}
.add-refund-reason-setup{
  margin-top: 3%;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 8%;
  color: rgba(0, 0, 0, 0.72);
}
.refund-reason--inner-section{
  margin-bottom: 10%;
}
.refund-textarea {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  outline: 0;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  position: relative;
  font-size: 13px;
}
.refund-textarea:focus,
.refund-textarea:hover,
.refund-textarea:active {
  border: 1px solid #1782c5 !important;
}
.add-refund-reason{
 font: inherit !important;
}
.decline-refund-submit{
  text-align : end ;
}
.decline-refund-btn{
  width: 40% !important;
}
.invalid-decline-reason{
  width: 100%;
  margin-top: .25rem;
  font-size: 100%;
  color: #dc3545;
}
</style>
