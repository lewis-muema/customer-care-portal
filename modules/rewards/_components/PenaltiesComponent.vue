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
            :options="active_countries"
            :reduce="name => name.country_code"
            name="country_name"
            label="country_name"
            placeholder="Select "
            class="form-control select user-billing"
            :id="`name`"
            @input="getSelectedCountryCode"
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

        <div class="full-width" v-if="penalizing_param === 'REASSIGNED'">
          <partner-action @actionValues="getActionValues" />
        </div>
        <div class="remove-margin row" v-else>
          <div class="form-group col-md-4 user-input">
            <label class="vat"> Orders to penalize for</label>
            <el-input
              placeholder="Please input"
              v-model="penalized_orders"
              class="input-with-select"
              min="0"
              type="number"
            >
              <el-select
                v-model="orders_parameter"
                slot="prepend"
                placeholder="Select"
              >
                <el-option
                  v-for="value in orderValue()"
                  :key="value.code"
                  :label="value.name"
                  :value="value.code"
                >
                </el-option>
              </el-select>
            </el-input>
            <div
              v-if="
                submitted &&
                  (!$v.penalized_orders.required ||
                    !$v.orders_parameter.required)
              "
              class="rewards_valid"
            >
              Orders to penalize is required
            </div>
          </div>

          <div class="form-group col-md-4 user-input">
            <label class="vat"> Number of hours to block on dispatch </label>

            <input
              min="0"
              type="number"
              step="0.01"
              name="blocking_hrs"
              placeholder=""
              class="form-control config-input"
              v-model="blocking_hrs"
            />
            <div
              class="rewards_valid"
              v-if="submitted && !$v.blocking_hrs.required"
            >
              Number of hours to block on dispatch is required
            </div>
          </div>

          <div class="form-group col-md-4 user-input start-date--align">
            <label class="config"> From </label>

            <date-picker
              v-model="from_date"
              class="date-input"
              :input-props="{
                placeholder: 'Select from date',
                readonly: true,
                class: 'form-control config-input ',
              }"
              :min-date="new Date()"
            />
            <div
              class="rewards_valid"
              v-if="submitted && !$v.from_date.required"
            >
              From Date is required
            </div>
          </div>

          <div class="form-group col-md-4 user-input start-date--align">
            <label class="config"> To </label>

            <date-picker
              v-model="to_date"
              class="date-input"
              :input-props="{
                placeholder: 'Select to date',
                readonly: true,
                class: 'form-control config-input ',
              }"
              :min-date="new Date()"
            />
            <div class="rewards_valid" v-if="submitted && !$v.to_date.required">
              To Date is required
            </div>
          </div>

          <div class="form-group col-md-4 user-input ">
            <label class="vat"> Message to show partner</label>

            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="Please input"
              v-model="message"
              :id="`message`"
              class="message-input"
            >
            </el-input>
            <div v-if="submitted && !$v.message.required" class="rewards_valid">
              Message is required
            </div>
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
        <el-tabs v-model="activeTab">
          <el-tab-pane
            label="Penalizing Actions Data"
            name="penalizingActionsData"
          >
            <penalizing-data-table
              @initiateData="initiateTableData"
              :penalty-logs="penalty_logs"
            />
          </el-tab-pane>
          <el-tab-pane
            label="Non-penalizing Actions Data"
            name="nonPenalizingActionsData"
          >
            <non-penalizing-data-table
              @initiateData="initiateTableData"
              :penalties-data="penaltiesData"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import moment from 'moment';
import PartnerAction from '@/modules/rewards/_components/ReassignOrderInputs/PartnerActionInput';
import PenalizingDataTable from '@/modules/rewards/_components/PenalizingDataTables/PenalizingDataTable';
import NonPenalizingDataTable from '@/modules/rewards/_components/PenalizingDataTables/NonPenalizingDataTable';
import Loading from './LoadingComponent.vue';

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

export default {
  name: 'PenaltiesComponent',
  components: {
    PartnerAction,
    PenalizingDataTable,
    NonPenalizingDataTable,
    Loading,
  },
  data() {
    return {
      activeTab: 'penalizingActionsData',
      submitted: false,
      loading_penalties: true,
      submit_status: false,
      response_status: true,
      sendyEntities: [],
      penalty_logs: [],
      error_msg: '',
      add_btn: false,
      blocking_hrs: '',
      from_date: '',
      to_date: '',
      message: '',
      orders_parameter: '',
      comparator: [
        { code: 'ET', name: 'Equal to' },
        { code: 'GT', name: 'Greater than' },
        { code: 'LT', name: 'Less than' },
        { code: 'GET', name: 'Greater than or equal to' },
        { code: 'LET', name: 'Less than or equal to' },
      ],
      penalizing_data: [
        { code: 'DELAYED_AT_PICKUP', name: 'Delayed at pick up' },
        { code: 'DELAYED_AT_DELIVERY', name: 'Delayed at delivery ' },
        { code: 'REASSIGNED', name: 'Reassigned orders ' },
      ],
      completed_comp_id: ['GT', 'GET'],
      penalizing_param: '',
      vendor_type: [],
      vendorType: '',
      vendorName: '',
      country: '',
      penalizing_reason: [],
      penalized_orders: '',
      submit_state: false,
      partner_actions_inputs: [],
      customer_actions_inputs: [],
      reassignment_reason_penalize: '',
      reasons_data: [],
      penaltiesData: [],
      invalidActions: false,
    };
  },
  validations: {
    blocking_hrs: { required },
    from_date: { required },
    to_date: { required },
    message: { required },
    orders_parameter: { required },
    vendorType: { required },
    country: { required },
    penalizing_param: { required },
    penalized_orders: { required },
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
    vendorType(vendorId) {
      this.$store.commit('setSelectedVendorType', vendorId);
      this.fetchReassignmentReasons();
    },
    country(countryCode) {
      this.$store.commit('setSelectedCountryCode', countryCode);
      this.fetchReassignmentReasons();
    },
  },
  mounted() {
    this.initiateData();
  },
  methods: {
    ...mapActions({
      perform_user_action: 'perform_user_action',
      request_penalties: 'requestPenalties',
      request_vendor_types: 'request_vendor_types',
      create_reward: 'create_reward',
      fetch_set_reallocation_reason: 'fetch_set_reallocation_reason',
      fetchNonPenalizingData: 'fetch_non_penalizing_data',
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
      this.fetchReassignmentReasons();
      this.requestRewards();
      this.getNonPenalizingData();
    },
    initiateTableData(data) {
      this.initiateData();
      this.loading_penalties = data.loading_penalties;
      this.response_status = data.response_status;
      this.error_msg = data.error_msg;
    },
    getSelectedCountryCode() {
      this.fetchVendorTypes();
    },
    fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'VENDORS',
        endpoint: 'types',
        apiKey: false,
        params: {
          pickup_country_code: this.country,
          dropoff_country_code: this.country,
        },
      };

      this.request_vendor_types(payload)
        .then(data => {
          this.vendor_type = data.vendor_types;
          return data.vendor_types;
        })
        .catch(error => {
          notification.push('Something went wrong. Please try again.');
          actionClass = 'danger';
          throw error;
        });
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchReassignmentReasons() {
      await this.fetch_set_reallocation_reason();
    },
    filterOutStatus(nonPenalizingActions) {
      const reasonOneRemoved = nonPenalizingActions.filter(
        action => action.action_id !== 1,
      );
      return reasonOneRemoved.filter(action => action.action_id !== 2);
    },
    async getNonPenalizingData() {
      const results = await this.fetchNonPenalizingData();
      if (results.status)
        this.penaltiesData = this.filterOutStatus(results.data);
    },
    getActionValues(value) {
      const {
        reassignment_reason_penalize,
        partner_actions,
        customer_actions,
        invalid_action_fields,
      } = value;
      this.reassignment_reason_penalize = reassignment_reason_penalize;
      this.partner_actions_inputs = partner_actions;
      this.customer_actions_inputs = customer_actions;
      this.invalidActions = invalid_action_fields;
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
      this.parameter = '';
      this.parameter_comp = '';
      this.parameter_value = '';
      this.parameter_data = '';
      this.block_hours = '';
      this.country = '';
      this.vendor_type = '';
      this.from_date = '';
      this.to_date = '';
      this.message = '';
      this.invalidActions = false;
      this.$store.commit('setSelectedCountryCode', null);
      this.$store.commit('setSelectedVendorType', null);
    },
    async requestRewards() {
      const arr = await this.request_penalties();
      this.penalty_logs = arr.filter(obj => obj.status !== 2);
      this.loading_penalties = false;
    },
    checkSubmitStatus() {
      return this.submit_state;
    },
    async generate_penalty() {
      this.submitted = true;

      if (this.penalizing_param === 'REASSIGNED') {
        await this.generate_penalty_actions();
        return;
      }
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
        this.error_msg = 'Reasssigned reason to penalize is required!';
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
            penalizing_param: this.penalizing_param,
            block_hours: parseInt(this.blocking_hrs, 10),
            country: this.country,
            vendor_type: parseInt(this.vendorType, 10),
            from_date: moment(this.from_date).format('YYYY-MM-DD'),
            to_date: moment(this.to_date).format('YYYY-MM-DD'),
            message: this.message,
          },
        };

        try {
          const data = await this.create_reward(payload);

          if (data.status) {
            this.response_status = 'success';

            setTimeout(() => {
              this.loading_penalties = true;
              this.submit_state = false;
              this.initiateData();
            }, 5000);
          } else {
            this.submit_state = false;
            this.response_status = 'error';
            this.error_msg = data.message;
          }
        } catch (error) {
          this.submit_state = false;
          this.response_status = 'error';
          this.error_msg =
            'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
        }
      }
    },
    async generate_penalty_actions() {
      this.submitted = true;

      this.$v.$touch();
      this.submit_status = true;
      this.response_status = true;
      this.submit_state = true;

      if (this.country === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Country is required!';
      } else if (this.vendor_type === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Vendor type is required !';
      } else if (this.reassignment_reason_penalize === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Reassignment reason to penalize is required !';
      } else if (this.invalidActions) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Please fill in all required action values !';
      } else if (
        !this.partner_actions_inputs.length &&
        !this.customer_actions_inputs.length
      ) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg =
          'At least one Partner or Customer action is required !';
      } else {
        const actions = {
          partner_actions: this.partner_actions_inputs,
          customer_actions: this.customer_actions_inputs,
        };
        const payload = {
          app: 'ADONIS_API',
          endpoint: '/penalties',
          apiKey: false,
          params: {
            country: this.country,
            vendor_type: parseInt(this.vendorType, 10),
            parameter_comp: 'ET',
            parameter_value: 1,
            penalizing_param: this.penalizing_param,
            admin_id: this.getSession.payload.data.admin_id,
            reassignment_reason_penalize: this.reassignment_reason_penalize,
            actions,
          },
        };

        try {
          const data = await this.create_reward(payload);

          if (data.status) {
            this.response_status = 'success';

            setTimeout(() => {
              this.loading_penalties = true;
              this.submit_state = false;
              this.initiateData();
            }, 5000);
          } else {
            this.submit_state = false;
            this.response_status = 'error';
            this.error_msg = data.message;
          }
        } catch (error) {
          this.submit_state = false;
          this.response_status = 'error';
          this.error_msg =
            'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
        }
      }
    },
    formatReward(text) {
      return `${text.charAt(0).toUpperCase()}${text.slice(1).toLowerCase()}`;
    },
    formatAmount(currency, amount) {
      return `${currency} ${amount}`;
    },
    orderValue() {
      return this.comparator.filter(i =>
        this.completed_comp_id.includes(i.code),
      );
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
.full-width {
  width: 100%;
}
.remove-margin {
  margin-left: 0;
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
  min-height: 340px;
}
.user-textarea {
  margin-right: 9%;
}
.message-input {
  margin-left: -5%;
}
</style>
