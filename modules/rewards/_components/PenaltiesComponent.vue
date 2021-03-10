<template lang="html">
  <div class="row">
    <div v-if="loading_penalties" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <el-button type="primary" @click="rewardSection" class="add_section"
        >Add penalty<i
          :class="add_btn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i
      ></el-button>
      <form
        id="reallocate-form"
        @submit.prevent="generate_penalty"
        class="form-inline add-reward-section"
        v-if="add_btn"
      >
        <div class="form-group col-md-4 user-input">
          <label class="vat"> Country </label>
          <v-select
            :options="country_code"
            :reduce="name => name.code"
            name="name"
            label="name"
            placeholder="Select "
            class="form-control select user-billing"
            :id="`name`"
            v-model="country"
          >
          </v-select>
          <div v-if="submitted && !$v.country.required" class="rewards_valid">
            Country is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Vendor Type </label>
          <v-select
            :options="vendor_type"
            :reduce="name => name.id"
            multiple
            chips
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="vendorType"
          >
          </v-select>
          <div
            v-if="submitted && !$v.vendorType.required"
            class="rewards_valid"
          >
            Type of vendor is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Penalizing Parameter</label>
          <v-select
            :options="penalizing_data"
            :reduce="name => name.code"
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="penalizing_param"
          >
          </v-select>
          <div
            v-if="submitted && !$v.penalizing_param.required"
            class="rewards_valid"
          >
            Penalizing parameter is required
          </div>
        </div>

        <partner-action-input />

        <div class="form-group col-md-4 user-input">
          <div class="customer-action-input" v-if="showCustomerAction">
            <label class="vat"> Customer action </label>
            <v-select
              :options="penalizing_data"
              :reduce="name => name.code"
              name="name"
              label="name"
              placeholder="Select"
              class="form-control select user-billing"
              :id="`name`"
              v-model="penalizing_param"
            >
            </v-select>
            <div
              v-if="submitted && !$v.penalizing_param.required"
              class="rewards_valid"
            >
              Penalizing parameter is required
            </div>
          </div>
          <div class="blocked-action-input" v-else>
            <label class="vat"> For how long? </label>
            <el-select v-model="blockedHours" placeholder="Hours">
              <el-option
                v-for="(time, index) in blocked_hours"
                :key="index"
                :label="time"
                :value="time"
              >
              </el-option>
            </el-select>
            <div
              v-if="submitted && !$v.blockedHours.required"
              class="rewards_valid"
            >
              Penalizing parameter is required
            </div>
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Message to show partner </label>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="messageToPartner"
          >
          </el-input>
          <div
            v-if="submitted && !$v.reassignment_reason_penalize.required"
            class="rewards_valid"
          >
            Reassignment reason is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Custom action </label>
          <v-select
            :options="partner_actions_data"
            :reduce="name => name.id"
            name="display_name"
            label="display_name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="partnerActions"
          >
          </v-select>
          <div
            v-if="submitted && !$v.partnerActions.required"
            class="rewards_valid"
          >
            Partner action is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Customer action </label>
          <v-select
            :options="penalizing_data"
            :reduce="name => name.code"
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="penalizing_param"
          >
          </v-select>
          <div
            v-if="submitted && !$v.penalizing_param.required"
            class="rewards_valid"
          >
            Penalizing parameter is required
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit">
          <button
            class="btn btn-primary action-button"
            :disabled="checkSubmitStatus()"
          >
            Submit
          </button>
        </div>
      </form>

      <div v-if="submit_status" class="response-section">
        <p class="response-text" v-if="response_status === true">
          <i class="fa fa-spinner fa-spin loader invoice-loader--align"></i>
          Processing your request ....
        </p>
        <p class="response-text" v-else-if="response_status === 'success'">
          <i
            class="fa fa-check-circle invoice-loader--align submit-success"
          ></i>
          Penalty created !!
        </p>
        <p class="response-text" v-else>
          <i
            class="fa fa-exclamation-circle invoice-loader--align submit-error"
          ></i>
          {{ error_msg }}
        </p>
      </div>

      <div class="body-box col-md-12 table-content">
        <el-table :data="penalty_logs" size="medium" :border="false">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="form-inline expand-logs-section">
                <div class="form-group col-md-4 expandable-header">
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
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data"> Penalty message</label>
                  {{ props.row.message }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Country" prop="country">
            <template slot-scope="scope">
              {{ fetchCountry(penalty_logs[scope.$index]['country']) }}
            </template>
          </el-table-column>
          <el-table-column label="Vendor type" prop="vendor_type">
            <template slot-scope="scope">
              {{ vendor(penalty_logs[scope.$index]['vendor_type']) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Penalizing parameter"
            width="180"
            prop="parameter"
          >
            <template slot-scope="scope">
              {{ penalizingParams(penalty_logs[scope.$index]['parameter']) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="180" prop="parameter">
            <template slot-scope="scope">
              {{ penalizingParams(penalty_logs[scope.$index]['parameter']) }}
            </template>
          </el-table-column>
          <el-table-column label="Date Added" prop="from_date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  penalty_logs[scope.$index]['from_date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="status">
            <template slot-scope="scope">
              {{ activeStatus(penalty_logs[scope.$index]['status']) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Actions"
            prop="status"
            class="data"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                :class="
                  penalty_logs[scope.$index]['status'] === 1
                    ? 'action-button--danger'
                    : 'action-button--active'
                "
                @click="handleAction(penalty_logs[scope.$index])"
              >
                {{ actionStatus(penalty_logs[scope.$index]['status']) }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';
import Loading from './LoadingComponent.vue';
import PartnerActionInput from './ReassignOrderInputs/PartnerActionInput';

export default {
  name: 'PenaltiesComponent',
  components: { Loading, PartnerActionInput },
  data() {
    return {
      submitted: false,
      loading_penalties: true,
      submit_status: false,
      response_status: true,
      sendyEntities: [],
      penalty_logs: [],
      error_msg: '',
      add_btn: false,
      message: '',
      showCustomerAction: true,
      blockedHours: null,
      blocked_hours: [1, 2, 4, 6, 12],
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      penalizing_data: [
        { code: 'DELAYED_AT_PICKUP', name: 'Delayed at pick up' },
        { code: 'DELAYED_AT_DELIVERY', name: 'Delayed at delivery ' },
        { code: 'REASSIGNED', name: 'Reassigned orders ' },
      ],
      reasons_data: [
        { code: 3, name: 'Client is not reachable' },
        { code: 5, name: 'I do not have a box' },
        { code: 7, name: `I can't access CBD` },
        { code: 8, name: 'My bike broke-down' },
        { code: 9, name: 'Police arrest' },
        { code: 10, name: 'My Vehicle is Open' },
        { code: 11, name: 'My Vehicle is Closed' },
        { code: 12, name: 'The load cannot fit in my vehicle' },
        { code: 13, name: 'My Vehicle broke down' },
      ],
      partner_actions_data: [
        {
          id: 1,
          action_type: 1,
          name: 'Block',
          display_name: 'Block from dispatch',
          input_datatype: 'Integer',
          user_type: '[1]',
          status: 1,
        },
        {
          id: 2,
          action_type: 1,
          name: 'Penalty_Fee',
          display_name: 'Charge a penalty fee',
          input_datatype: 'Integer',
          user_type: '[1,2]',
          status: 1,
        },
        {
          id: 3,
          action_type: 2,
          name: 'Reallocation',
          display_name: 'Allow partner to reallocate',
          input_datatype: 'Integer',
          user_type: '[1]',
          status: 1,
        },
        {
          id: 4,
          action_type: 2,
          name: 'Reschedule',
          display_name: 'Allow customer to reschedule order',
          input_datatype: 'Integer',
          user_type: '[2]',
          status: 1,
        },
        {
          id: 5,
          action_type: 2,
          name: 'Notification',
          display_name: 'Trigger notification alert',
          input_datatype: 'Integer',
          user_type: '[1,2]',
          status: 1,
        },
      ],
      completed_comp_id: ['GT', 'GET'],
      penalizing_param: '',
      vendor_type: [],
      vendorType: '',
      country: '',
      penalizing_reason: [],
      partnerActions: '',
      messageToPartner: '',
      submit_state: false,
    };
  },
  validations: {
    vendorType: { required },
    country: { required },
    penalizing_param: { required },
    reassignment_reason_penalize: { required },
    messageToPartner: { required },
  },
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
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
    },
    rewardSection() {
      let status = false;
      if (!this.add_btn) {
        status = true;
      }
      this.add_btn = status;
    },
    clearData() {
      this.submit_status = false;
      this.add_btn = false;
      this.country = '';
      this.vendor_type = '';
      this.vendorType = [];
      this.message = '';
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
        this.loading_penalties = false;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    checkSubmitStatus() {
      return this.submit_state;
    },
    generate_penalty() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.submit_status = true;
      this.response_status = true;
      const date_range = moment(this.to_date).diff(moment(this.from_date));
      this.submit_state = true;

      if (this.penalizing_param !== 'REASSIGNED') {
        this.penalizing_reason = [];
      }

      if (
        this.penalizing_param === 'REASSIGNED' &&
        this.penalizing_reason.length === 0
      ) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Reassigned reason to penalize is required!';
      } else if (
        this.orders_parameter === 'ET' &&
        this.penalized_orders > '0'
      ) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg =
          'Order to penalize for should be equal to 0 for the selected comparator !';
      } else if (date_range < 0) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg =
          'Time Range Error : Ensure that From date is not later than the To date';
      } else {
        const payload = {
          app: 'ADONIS_API',
          endpoint: '/penalties',
          apiKey: false,
          params: {
            parameter: this.penalizing_param,
            parameter_comp: this.orders_parameter,
            parameter_value: parseInt(this.penalized_orders, 10),
            parameter_data: this.penalizing_reason,
            block_hours: parseInt(this.blocking_hrs, 10),
            country: this.country,
            vendor_type: parseInt(this.vendorType, 10),
            from_date: moment(this.from_date).format('YYYY-MM-DD'),
            to_date: moment(this.to_date).format('YYYY-MM-DD'),
            message: this.message,
          },
        };

        try {
          const data = true;

          if (data) {
            this.response_status = 'success';

            setTimeout(() => {
              this.loading_penalties = true;
              this.submit_state = false;
              this.initiateData();
            }, 5000);
          } else {
            this.submit_state = false;
            this.response_status = 'error';
            this.error_msg = data;
          }
        } catch (error) {
          this.submit_state = false;
          this.response_status = 'error';
          this.error_msg =
            'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
        }
      }
    },
    vendor(id) {
      let name = '';
      if (Object.keys(this.vendor_type).length > 0) {
        const data = this.vendor_type.find(location => location.id === id);
        name = data.name;
      }
      return name;
    },
    fetchCountry(id) {
      const data = this.country_code.find(location => location.code === id);
      return data.name;
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
    penalizeLabel(val) {
      let resp = 'Orders to penalize for be';
      if (val === 'REASSIGNED') {
        resp = 'Reassign reasons to penalize for ';
      }
      return resp;
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
.response-section {
  width: 95.5%;
  height: 55px;
  background: rgba(255, 255, 255, 0.91);
  border: 2px solid #00ae55;
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 2%;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 28px;
}
.invoice-loader--align {
  margin-left: 2%;
  margin-right: 1%;
}
.submit-success {
  color: #00ae55;
}
.submit-error {
  color: #ff0000;
}
.response-text {
  margin-top: 1%;
}
.invoice-number-highlight {
  color: #00ae55;
}
.table-content {
  max-width: 98%;
  margin-left: 1%;
  margin-top: 2%;
}
.table-background {
  background: #fff;
}
.add_section {
  background: #ffffff;
  border: 1px solid #000000;
  color: #1f1d1d;
  margin-left: 2%;
  width: 15% !important;
  margin-bottom: 1%;
}
.add_section:focus,
.add_section:hover {
  background: #ffffff !important;
  border: 1px solid #000000 !important;
  color: #1f1d1d;
  cursor: pointer;
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
.vat {
  width: 100%;
  margin-left: -15px;
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
.customer-action-input {
  width: 100%;
}
.blocked-action-input {
  width: 100%;
}
.blocked-action-input .el-select {
  position: relative;
  left: -15px;
  width: 100%;
}
.form-inline {
  margin-left: 2%;
}
.vat-inline {
  max-width: 72% !important;
}
.config-input {
  margin-left: -15px;
}
.config-div {
  padding-left: 0;
}
.config {
  width: 100%;
  margin-left: -15px;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
.date-input {
  margin-left: -15px;
  width: 100% !important;
}
.rewards_valid {
  font-size: 14px !important;
  color: #dc3545;
  margin-left: -4% !important;
}
.input-with-select {
  margin-left: -6%;
}
.add-reward-section {
  width: 80% !important;
  min-height: 260px;
}
.user-textarea {
  margin-right: 9%;
}
.message-input {
  margin-left: -5%;
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
.expandable-data {
  width: 100%;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  color: #000000;
  margin-bottom: 3% !important;
}
.expand-logs-section {
  width: 100% !important;
}
.expandable-header {
  margin-bottom: 15px;
  width: 20%;
}
.action-button--archive {
  background-color: #3c8dbc;
  border-color: #3c8dbc;
  color: #fff;
}
</style>
