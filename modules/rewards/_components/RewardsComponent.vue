<template lang="html">
  <div class="row">
    <div v-if="loading_rewards" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <el-button type="primary" @click="rewardSection" class="add_section"
        >Add reward<i
          :class="add_btn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i
      ></el-button>
      <form
        id="reallocate-form"
        @submit.prevent="generate_reward"
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
          <label class="vat"> No. of completed orders/day to reward for </label>
          <el-input
            placeholder="Please input"
            v-model="completed_task"
            class="input-with-select"
          >
            <el-select
              v-model="orders_parameter"
              slot="prepend"
              placeholder="Select"
            >
              <el-option
                v-for="value in comparator"
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
                (!$v.completed_task.required || !$v.orders_parameter.required)
            "
            class="rewards_valid"
          >
            No. of completed orders/day is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Delays at pick up </label>
          <el-input
            placeholder="Please input"
            v-model="pickup_delays"
            class="input-with-select"
          >
            <el-select
              v-model="pickup_parameter"
              slot="prepend"
              placeholder="Select"
            >
              <el-option
                v-for="value in comparator"
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
                (!$v.pickup_parameter.required || !$v.pickup_delays.required)
            "
            class="rewards_valid"
          >
            No of delays at pick up is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Delays at delivery</label>
          <el-input
            placeholder="Please input"
            v-model="delivery_delays"
            class="input-with-select"
          >
            <el-select
              v-model="delivery_parameter"
              slot="prepend"
              placeholder="Select"
            >
              <el-option
                v-for="value in comparator"
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
                (!$v.delivery_delays.required ||
                  !$v.delivery_parameter.required)
            "
            class="rewards_valid"
          >
            No of delays at delivery is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Orders reassigned </label>
          <el-input
            placeholder="Please input"
            v-model="reassigned_orders"
            class="input-with-select"
          >
            <el-select
              v-model="reassign_parameter"
              slot="prepend"
              placeholder="Select"
            >
              <el-option
                v-for="value in comparator"
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
                (!$v.reassigned_orders.required ||
                  !$v.reassign_parameter.required)
            "
            class="rewards_valid"
          >
            No. of reassigned orders is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Type of reward </label>
          <v-select
            :options="reward_type"
            :reduce="name => name.code"
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="rewardType"
          >
          </v-select>
          <div
            v-if="submitted && !$v.rewardType.required"
            class="rewards_valid"
          >
            Type of reward is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="vat"> Amount</label>
          <el-input
            placeholder="Please input"
            v-model="amount"
            class="input-with-select"
            type="number"
          >
            <el-select v-model="currency" slot="prepend" placeholder="Select">
              <el-option
                v-for="value in currency_data"
                :key="value.code"
                :label="value.name"
                :value="value.code"
              >
              </el-option>
            </el-select>
          </el-input>
          <div
            v-if="submitted && (!$v.amount.required || !$v.currency.required)"
            class="rewards_valid"
          >
            Amount is required
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
          />
          <div class="rewards_valid" v-if="submitted && !$v.to_date.required">
            To Date is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input user-textarea">
          <label class="vat"> Reward goal message to show partner</label>

          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="Complete x orders today with delays less than x and reassigned less than X to get a cash reward of KES 500.."
            v-model="reward_message"
            :id="`reward_message`"
            class="message-input"
          >
          </el-input>
          <div
            v-if="submitted && !$v.reward_message.required"
            class="rewards_valid"
          >
            Reward goal message is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input user-textarea">
          <label class="vat"> Congratulatory message</label>

          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="Congratulations! you have met the target of X orders today. We have topped up your account with X amount"
            v-model="congratulatory_message"
            :id="`congratulatory_message`"
            class="message-input"
          >
          </el-input>
          <div
            v-if="submitted && !$v.congratulatory_message.required"
            class="rewards_valid"
          >
            Congratulatory message is required
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit">
          <button class="btn btn-primary action-button">
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
          Reward created !!
        </p>
        <p class="response-text" v-else>
          <i
            class="fa fa-exclamation-circle invoice-loader--align submit-error"
          ></i>
          {{ error_msg }}
        </p>
      </div>

      <div class="body-box col-md-12 table-content">
        <div v-if="reward_logs.length === 0 || reward_logs === null">
          No Records
        </div>

        <el-table :data="reward_logs" size="medium" :border="false">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="form-inline expand-logs-section">
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data">Delays at pick up be </label>
                  {{
                    pickupDelay(
                      props.row.delayed_at_pickup_comp,
                      props.row.delayed_at_pickup,
                    )
                  }}
                </div>
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data">
                    Delays at destination be</label
                  >
                  {{
                    destinationDelay(
                      props.row.delayed_at_delivery_comp,
                      props.row.delayed_at_delivery,
                    )
                  }}
                </div>
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data"> Orders reassigned be</label>
                  {{
                    reassignData(
                      props.row.reassigned_comp,
                      props.row.reassigned,
                    )
                  }}
                </div>
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data"> Reward goal message</label>
                  {{ props.row.message }}
                </div>
                <div class="form-group col-md-4 expandable-header">
                  <label class="expandable-data">
                    Congratulatory message
                  </label>
                  {{ props.row.congratulatory_message }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Country" prop="country">
            <template slot-scope="scope">
              {{ fetchCountry(reward_logs[scope.$index]['country']) }}
            </template>
          </el-table-column>
          <el-table-column label="Vendor" prop="vendor_type">
            <template slot-scope="scope">
              {{ vendor(reward_logs[scope.$index]['vendor_type']) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Completed orders to reward for"
            prop="completed"
            width="140"
          >
          </el-table-column>
          <el-table-column label="Type of reward" prop="reward_type">
            <template slot-scope="scope">
              {{ formatReward(reward_logs[scope.$index]['reward_type']) }}
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount">
            <template slot-scope="scope">
              {{
                formatAmount(
                  reward_logs[scope.$index]['currency'],
                  reward_logs[scope.$index]['amount'],
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="From" prop="from_date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  reward_logs[scope.$index]['from_date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="To" prop="to_date">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  reward_logs[scope.$index]['to_date'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="status">
            <template slot-scope="scope">
              {{ activeStatus(reward_logs[scope.$index]['status']) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" prop="status" class="data">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :class="
                  reward_logs[scope.$index]['status'] === 1
                    ? 'action-button--danger'
                    : 'action-button--active'
                "
                @click="handleAction(reward_logs[scope.$index])"
              >
                {{ actionStatus(reward_logs[scope.$index]['status']) }}
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
  name: 'RewardsComponent',
  components: { Loading },
  data() {
    return {
      submitted: false,
      loading_rewards: true,
      submit_status: false,
      response_status: true,
      sendyEntities: [],
      reward_logs: [],
      sendyEntity: '',
      error_msg: '',
      generated_invoice_no: '',
      add_btn: false,
      reward: [{ code: 1, option: 'Completed orders' }],
      reward_type: [
        { code: 'airtime', name: 'Airtime' },
        { code: 'cash', name: 'Cash' },
      ],
      vendor_type: [],
      rewardType: '',
      vendorType: '',
      completed_task: '',
      amount: '',
      from_date: '',
      to_date: '',
      reward_message: '',
      congratulatory_message: '',
      orders_parameter: '',
      comparator: [
        { code: 'ET', name: 'Equal to' },
        { code: 'GT', name: 'Greater than' },
        { code: 'LT', name: 'Less than' },
        { code: 'GET', name: 'Greater than or equal to' },
        { code: 'LET', name: 'Less than or equal to' },
      ],
      currency_data: [
        { code: 'UGX', name: 'UGX' },
        { code: 'KES', name: 'KES' },
        { code: 'USD', name: 'USD' },
      ],
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      country: '',
      currency: '',
      pickup_delays: '',
      pickup_parameter: '',
      delivery_delays: '',
      delivery_parameter: '',
      reassigned_orders: '',
      reassign_parameter: '',
    };
  },
  validations: {
    rewardType: { required },
    completed_task: { required },
    amount: { required },
    from_date: { required },
    to_date: { required },
    reward_message: { required },
    congratulatory_message: { required },
    orders_parameter: { required },
    pickup_delays: { required },
    pickup_parameter: { required },
    delivery_delays: { required },
    delivery_parameter: { required },
    reassigned_orders: { required },
    reassign_parameter: { required },
    vendorType: { required },
    currency: { required },
    country: { required },
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
      request_rewards: 'requestRewards',
      create_reward: 'create_reward',
      update_reward: 'update_reward',
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
      this.requestRewards();
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
      this.completed = '';
      this.completed_comp = '';
      this.delayed_at_pickup = '';
      this.delayed_at_pickup_comp = '';
      this.delayed_at_delivery = '';
      this.delayed_at_delivery_comp = '';
      this.reassigned = '';
      this.reassigned_comp = '';
      this.reward_type = '';
      this.amount = '';
      this.currency = '';
      this.country = '';
      this.vendor_type = '';
      this.from_date = '';
      this.to_date = '';
      this.message = '';
      this.congratulatory_message = '';
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
      const arr = await this.request_rewards();
      this.reward_logs = arr;
      this.loading_rewards = false;
    },

    async generate_reward() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.submit_status = true;
      this.response_status = true;

      const user_data = this.getSession.payload.data.name;

      const payload = {
        app: 'ADONIS_API',
        endpoint: '/rewards',
        apiKey: false,
        params: {
          completed: parseInt(this.completed_task, 10),
          completed_comp: this.orders_parameter,
          delayed_at_pickup: parseInt(this.pickup_delays, 10),
          delayed_at_pickup_comp: this.pickup_parameter,
          delayed_at_delivery: parseInt(this.delivery_delays, 10),
          delayed_at_delivery_comp: this.delivery_parameter,
          reassigned: parseInt(this.reassigned_orders, 10),
          reassigned_comp: this.reassign_parameter,
          reward_type: this.rewardType,
          amount: parseInt(this.amount, 10),
          currency: this.currency,
          country: this.country,
          vendor_type: this.vendorType,
          from_date: moment(this.from_date).format('YYYY-MM-DD'),
          to_date: moment(this.to_date).format('YYYY-MM-DD'),
          message: this.reward_message,
          congratulatory_message: this.congratulatory_message,
        },
      };

      try {
        const data = await this.create_reward(payload);

        if (data.status) {
          this.response_status = 'success';

          setTimeout(() => {
            this.loading_rewards = true;
            this.initiateData();
          }, 5000);
        } else {
          this.response_status = 'error';
          this.error_msg = data.message;
        }
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
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
    pickupDelay(comparator, value) {
      let resp = '';
      if (Object.keys(this.comparator).length > 0) {
        const data = this.comparator.find(
          location => location.code === comparator,
        );
        resp = `${data.name} ${value} orders`;
      }
      return resp;
    },
    destinationDelay(comparator, value) {
      let resp = '';
      if (Object.keys(this.comparator).length > 0) {
        const data = this.comparator.find(
          location => location.code === comparator,
        );
        resp = `${data.name} ${value} orders`;
      }
      return resp;
    },
    reassignData(comparator, value) {
      let resp = '';
      if (Object.keys(this.comparator).length > 0) {
        const data = this.comparator.find(
          location => location.code === comparator,
        );
        resp = `${data.name} ${value} orders`;
      }
      return resp;
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
        data.to_date = moment(row.from_date).format('YYYY-MM-DD');
      } else {
        data.status = 1;
        data.from_date = moment(row.from_date).format('YYYY-MM-DD');
        data.to_date = moment(row.from_date).format('YYYY-MM-DD');
      }

      const payload = {
        app: 'ADONIS_API',
        endpoint: `/rewards/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_reward(payload);
        this.loading_rewards = true;
        this.initiateData();
      } catch (error) {
        this.loading_rewards = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
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
}
.message-input{
  margin-left: -5%;
}
.reward_data{
  text-align: center;
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
.expandable-data{
  width: 100%;
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  color: #000000;
  margin-bottom: 3%!important;
}
.expand-logs-section{
  width: 100% !important;
}
.expandable-header {
  margin-bottom: 15px;
  width: 20%;
}
</style>
