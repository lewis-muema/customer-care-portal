<template lang="html">
  <div class="row">
    <div v-if="loading_messages" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <el-button type="primary" @click="rewardSection" class="add_section"
        >Add warning message<i
          :class="add_btn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i
      ></el-button>
      <form
        id="reallocate-form"
        @submit.prevent="generate_warning_msg"
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

        <div
          class="form-group col-md-4 user-input"
          v-if="penalizing_param === 'REASSIGNED'"
        >
          <label class="vat"> Reassigned reason to penalize</label>
          <el-select
            v-model="penalizing_reason"
            multiple
            class="form-control select user-billing"
            placeholder="Select"
          >
            <el-option
              v-for="item in reasons_data"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>

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
                v-for="value in delayValue()"
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
                (!$v.penalized_orders.required || !$v.orders_parameter.required)
            "
            class="rewards_valid"
          >
            Orders to penalize is required
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
          <div class="rewards_valid" v-if="submitted && !$v.from_date.required">
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
          Warning message created !!
        </p>
        <p class="response-text" v-else>
          <i
            class="fa fa-exclamation-circle invoice-loader--align submit-error"
          ></i>
          {{ error_msg }}
        </p>
      </div>

      <div class="body-box col-md-12 table-content">
        <el-table :data="warning_logs" size="medium" :border="false">
          <el-table-column label="Country" prop="country">
            <template slot-scope="scope">
              {{ fetchCountry(warning_logs[scope.$index]['country']) }}
            </template>
          </el-table-column>
          <el-table-column label="Vendor" prop="vendor_type">
            <template slot-scope="scope">
              {{ vendor(warning_logs[scope.$index]['vendor_type']) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Warning parameter"
            width="180"
            prop="parameter"
          >
            <template slot-scope="scope">
              {{ penalizingParams(warning_logs[scope.$index]['parameter']) }}
            </template>
          </el-table-column>
          <el-table-column label="Warning message" width="180" prop="message">
            <template slot-scope="scope">
              {{ warning_logs[scope.$index]['message'] }}
            </template>
          </el-table-column>
          <el-table-column label="From" prop="from_date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  warning_logs[scope.$index]['from_date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="To" prop="to_date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  warning_logs[scope.$index]['to_date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="status">
            <template slot-scope="scope">
              {{ activeStatus(warning_logs[scope.$index]['status']) }}
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
                  warning_logs[scope.$index]['status'] === 1
                    ? 'action-button--danger'
                    : 'action-button--active'
                "
                @click="handleAction(warning_logs[scope.$index])"
              >
                {{ actionStatus(warning_logs[scope.$index]['status']) }}
              </el-button>
              <el-button
                v-if="warning_logs[scope.$index]['status'] === 0"
                size="mini"
                class="action-button--archive"
                @click="handleArchive(warning_logs[scope.$index])"
              >
                Archive
              </el-button>
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
  name: 'PenaltiesComponent',
  components: { Loading },
  data() {
    return {
      submitted: false,
      loading_messages: true,
      submit_status: false,
      response_status: true,
      sendyEntities: [],
      warning_logs: [],
      error_msg: '',
      add_btn: false,
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
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      penalizing_data: [
        { code: 'COMPLETED', name: 'Completed orders ' },
        { code: 'DELAYED_AT_PICKUP', name: 'Orders delayed at pick up' },
        { code: 'DELAYED_AT_DELIVERY', name: 'Orders delayed at delivery ' },
        { code: 'REASSIGNED', name: 'Reassigned orders ' },
      ],
      reasons_data: [
        { code: 3, name: 'Client is not reacheable' },
        { code: 5, name: 'I do not have a box' },
        { code: 7, name: `I can't access CBD` },
        { code: 8, name: 'My bike broke-down' },
        { code: 9, name: 'Police arrest' },
        { code: 10, name: 'My Vehicle is Open' },
        { code: 11, name: 'My Vehicle is Closed' },
        { code: 12, name: 'The load cannot fit in my vehicle' },
        { code: 13, name: 'My Vehicle broke down' },
      ],
      penalizing_param: '',
      vendor_type: [],
      vendorType: '',
      country: '',
      penalizing_reason: [],
      penalized_orders: '',
      submit_state: false,
      completed_comp_id: ['LT', 'LET', 'GT', 'GET'],
    };
  },
  validations: {
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
      request_invoice_data: 'request_invoice_data',
      perform_user_action: 'perform_user_action',
      request_vendor_types: 'request_vendor_types',
      request_penalties: 'requestPenalties',
      request_messages: 'requestWarningMessages',
      update_reward: 'update_reward',
      create_reward: 'create_reward',
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
      this.requestRewards();
    },
    clearData() {
      this.submit_status = false;
      this.add_btn = false;
      this.parameter = '';
      this.parameter_comp = '';
      this.parameter_value = '';
      this.parameter_data = '';
      this.country = '';
      this.vendor_type = '';
      this.from_date = '';
      this.to_date = '';
      this.message = '';
    },
    rewardSection() {
      let status = false;
      if (!this.add_btn) {
        status = true;
      }
      this.add_btn = status;
    },
    async requestRewards() {
      const arr = await this.request_messages();
      this.warning_logs = arr.filter(obj => obj.status !== 2);
      this.loading_messages = false;
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
    checkSubmitStatus() {
      return this.submit_state;
    },

    async generate_warning_msg() {
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
          endpoint: '/warning_messages',
          apiKey: false,
          params: {
            parameter: this.penalizing_param,
            parameter_comp: this.orders_parameter,
            parameter_value: parseInt(this.penalized_orders, 10),
            parameter_data: this.penalizing_reason,
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
              this.submit_state = false;
              this.loading_messages = true;
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
    formatAmount(currency, amount) {
      return `${currency} ${amount}`;
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
        endpoint: `/warning_messages/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_reward(payload);

        if (resp.status) {
          this.loading_messages = true;
          this.initiateData();
        } else {
          this.loading_messages = true;
          this.initiateData();
        }
      } catch (error) {
        this.loading_messages = true;
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
        endpoint: `/warning_messages/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_reward(payload);

        if (resp.status) {
          this.loading_messages = true;
          this.initiateData();
        } else {
          this.loading_messages = true;
          this.initiateData();
        }
      } catch (error) {
        this.loading_messages = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    delayValue() {
      const record = this.comparator.filter(i =>
        this.delays_comp_id.includes(i.code),
      );

      return record;
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
.add_section{
  background: #FFFFFF;
  border: 1px solid #000000;
  color: #1F1D1D;
  margin-left: 2%;
  width: 15% !important;
  margin-bottom: 1%;
}
.add_section:focus,
.add_section:hover {
  background: #FFFFFF !important;
  border: 1px solid #000000 !important;
  color: #1F1D1D;
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
.input-with-select{
  margin-left: -6%;
}
.add-reward-section{
  width: 80% !important;
  min-height: 340px;
}
.user-textarea{
  margin-right: 9%;
}
.message-input{
  margin-left: -5%;
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
