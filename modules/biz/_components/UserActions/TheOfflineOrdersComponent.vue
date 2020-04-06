<template>
  <div class="row">
    <div v-if="loading_tax_rates" class="tax_loader">
      <p>
        Fetching VAT Tax Rates ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else>
      <form
        id="reallocate-form"
        @submit.prevent="offline_orders"
        class="form-inline custom-biz-inline col-md-12 form-outer-online"
      >
        <div class="response-section" v-if="submit_status">
          <p class="response-text" v-if="response_status === 'success'">
            <i
              class="fa fa-check-circle invoice-loader--align submit-success"
            ></i>
            Data submitted successfully
          </p>
          <p class="response-text" v-else>
            <i
              class="fa fa-exclamation-circle invoice-loader--align submit-error"
            ></i>
            {{ error_msg }}
          </p>
        </div>
        <div class="form-group col-md-6 user-input start-date--align">
          <label class="config"> From </label>

          <date-picker
            v-model="start_date"
            class="date-input"
            :input-props="{
              placeholder: 'Select start date',
              readonly: true,
              class: 'form-control config-input ',
            }"
          />
          <div
            class="invoice_valid"
            v-if="submitted && !$v.start_date.required"
          >
            Start Date is required
          </div>
        </div>

        <div class="form-group col-md-6 user-input">
          <label class="config"> To</label>

          <date-picker
            v-model="end_date"
            class="date-input"
            :input-props="{
              placeholder: 'Select End date',
              readonly: true,
              class: 'form-control config-input ',
            }"
          />
          <div class="invoice_valid" v-if="submitted && !$v.end_date.required">
            End Date is required
          </div>
        </div>

        <div class="form-group col-md-6 user-input business-unit-select">
          <label class="bill">Business Units</label>
          <v-select
            :options="businessUnits"
            :reduce="name => name.value"
            name="name"
            label="name"
            placeholder="Select Business Unit"
            class="form-control select "
            :id="`business-units`"
            v-model="businessUnit"
            :class="{
              'is-invalid': submitted && $v.businessUnit.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.businessUnit.required"
            class="invalid-feedback"
          >
            Business Unit is required
          </div>
        </div>

        <div class="row col-md-12 pay-partner--checkbox">
          <div
            class="form-group col-md-3 bill-check bill-partners-align input-margin"
          >
            <input
              value="1"
              name="charge_biz_commission"
              id="charge_biz_commission>"
              type="checkbox"
              class="bill-partners-check"
              @click="check($event)"
              v-model="checked"
              checked
            />
            <label class="charge_commission--label"> Pay Partners </label>
          </div>
        </div>
        <div class="col-md-12 input-margin" v-if="checked">
          <div class="body-box col-md-12 table-content rider-data-inline">
            <table class="table table-bordered table-background">
              <thead>
                <tr class="table-header">
                  <td class="partner-header">Partner Account</td>
                  <td class="amount-header">Total Amount Earned</td>
                  <td class="days-header">No.of days worked</td>
                  <td class="table-resize">Tonnes</td>
                  <td class="table-resize">No.of orders</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(element, key) in elements" :key="key">
                  <td class="search-rider-input">
                    <TheSearchRiderComponent
                      :category="category"
                      v-model="element.rider_id"
                      :arr="array"
                      @riderData="searchedRider"
                      :rider-key="key"
                    />
                  </td>
                  <td>
                    <div class="input-group">
                      <div class="input-group-icon">
                        <span> {{ currency }}</span>
                      </div>
                      <div class="amount-input">
                        <input
                          type="number"
                          v-model="element.amount"
                          name="amount"
                          placeholder="Amount"
                          class="form-control"
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <input
                      v-model="element.days"
                      class="form-control"
                      type="number"
                      name="days"
                      placeholder="Days"
                    />
                  </td>
                  <td>
                    <input
                      v-model="element.tonnage"
                      class="form-control"
                      type="number"
                      name="tonnage"
                      placeholder="Tonnes"
                    />
                  </td>
                  <td>
                    <input
                      v-model="element.orders"
                      class="form-control"
                      type="number"
                      name="orders"
                      placeholder="Orders"
                    />
                  </td>
                  <td>
                    <div class="" v-if="key > 0" @click="removeNewRow(key)">
                      x
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row col-md-12 extra-content">
            <div
              class="form-group col-md-3 bill-check add-element-align"
              @click="addElement"
            >
              + &nbsp;Add a new row
            </div>

            <div class=" row col-md-9 checkbox-align">
              <div class="form-group col-md-4 bill-check bill-check--padding">
                <input
                  value="1"
                  name="charge_comission"
                  id="charge_commision"
                  type="checkbox"
                  class="bill-partners-check"
                  @click="checkCommission($event)"
                  v-model="charge_commission"
                  checked
                />
                <label for="" class="charge_vat--label"
                  >Charge Commission</label
                >
              </div>

              <div
                class="form-group col-md-4  charge-commision-input"
                v-if="charge_commission"
              >
                <input
                  class="form-control commision-rate"
                  type="number"
                  name="commission_rate"
                  placeholder="Rate"
                  v-model="commission_rate"
                  min="1"
                  max="100"
                />
                <label for="" class="charge_rate--label">%</label>
              </div>
            </div>
          </div>
        </div>

        <div class="row col-md-12 lower-section">
          <div class="col-md-6">
            <label class="config notes-padding"> Notes </label>
            <input
              class="form-control notes-input"
              type="text"
              name="notes"
              placeholder="Notes"
              v-model="notes"
            />
            <div class="invoice_valid" v-if="submitted && !$v.notes.required">
              Notes is required
            </div>
          </div>
          <div class="col-md-6 amount-calculator">
            <div class="">
              <table
                class="table table-bordered table-background amount-calculator-header"
              >
                <thead>
                  <tr>
                    <td>Total partner cost</td>
                    <td>Sendy take amount</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="input-amount">
                      {{ currency }}
                      <number
                        ref="number1"
                        :from="0"
                        :to="calculatedAmount"
                        :duration="1"
                        :delay="1"
                        easing="Power1.easeOut"
                      />
                    </td>
                    <td class="input-amount">
                      {{ currency }}
                      <number
                        ref="number1"
                        :from="0"
                        :to="sendyTakeHome"
                        :duration="1"
                        :delay="1"
                        easing="Power1.easeOut"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="offline-billing-amount">
              <label class="config offline-billing-label">
                Amount to bill the customer
              </label>
              <input
                class="form-control offline-billing-input"
                type="text"
                name="amount"
                placeholder="Enter Amount"
                v-model="billingAmount"
                @keyup="dispatchbillingAmount"
              />
              <div
                class="invoice_valid"
                v-if="submitted && !$v.billingAmount.required"
              >
                Billing Amount is required
              </div>
            </div>
            <div class="form-group entity-checkbox">
              <input
                value="1"
                type="checkbox"
                class="bill-partners-check"
                @click="checkEntity($event)"
                v-model="isChargeEntity"
              />
              <label for="" class="charge_vat--label">
                Bill Sendy Entity
              </label>
            </div>

            <div class="amount-layout">
              <table
                class="table table-bordered table-background amount-calculator-header breakdown-header"
              >
                <thead>
                  <tr>
                    <td>Base Amount</td>
                    <td>{{ determineVAT() }}</td>
                    <td>Total Charge</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="input-amount amount-breakdown">
                      {{ currency }}
                      <number
                        ref="number1"
                        :from="0"
                        :to="baseAmount"
                        :duration="1"
                        :delay="1"
                        easing="Power1.easeOut"
                      />
                    </td>
                    <td class="input-amount amount-breakdown">
                      {{ currency }}
                      <number
                        ref="number1"
                        :from="0"
                        :to="vatAmount"
                        :duration="1"
                        :delay="1"
                        easing="Power1.easeOut"
                      />
                    </td>
                    <td class="input-amount amount-breakdown">
                      {{ currency }}
                      <number
                        ref="number1"
                        :from="0"
                        :to="totalAmount"
                        :duration="1"
                        :delay="1"
                        easing="Power1.easeOut"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit offline-orders-submit">
          <button
            class="btn btn-primary action-button"
            :disabled="checkSubmitStatus()"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { required } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import moment from 'moment';
import VueNumber from 'vue-number-animation';

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);
Vue.use(VueNumber);

export default {
  name: 'TheofflineOrdersComponent',
  components: {
    DatePicker,
    TheSearchRiderComponent: () => import('./TheSearchRiderComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      end_date: '',
      start_date: '',
      checked: true,
      charge_commission: false,
      charge_vat: true,
      elements: [
        {
          rider_id: '',
          amount: '',
          days: '0',
          tonnage: '0',
          orders: '0',
        },
      ],
      category: 'Select partner account',
      array: {},
      commission_rate: '20',
      calculatedAmount: 0,
      sendyTakeHome: 0,
      billingAmount: '',
      notes: '',
      submit_status: false,
      response_status: true,
      error_msg: '',
      submit_state: false,
      baseAmount: 0,
      vatAmount: 0,
      totalAmount: 0,
      loading_tax_rates: true,
      vat_rate: 0,
      businessUnits: [
        { value: 1, name: 'Merchant Business Units - MBU' },
        { value: 2, name: 'Enterprise Business Units - EBU' },
        { value: 3, name: 'Freight Business Units - FBU' },
      ],
      businessUnit: '',
      isChargeEntity: false,
    };
  },

  validations: {
    end_date: { required },
    start_date: { required },
    billingAmount: { required },
    notes: { required },
    businessUnit: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  watch: {
    elements: {
      handler(after, before) {
        this.handleTotalAmount();
      },
      deep: true,
    },
    charge_commission: {
      handler(after, before) {
        this.handleTotalAmount();
      },
      deep: true,
    },
    commission_rate: {
      handler(after, before) {
        this.handleTotalAmount();
      },
      deep: true,
    },
    isChargeEntity: {
      handler(after, before) {
        if (this.isChargeEntity) {
          this.checked = true;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchTaxRates();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      perform_user_action: 'perform_user_action',
      request_tax_rates: 'request_tax_rates',
    }),

    determineVAT() {
      let text = 'TAX';
      if (this.currency === 'KES') {
        text = 'VAT';
      }
      return text;
    },

    /* global event, fdescribe */
    /* eslint no-restricted-globals: ["error", "event", "fdescribe"] */

    handleTotalAmount() {
      let my_elements = [];
      my_elements = this.elements;

      for (let i = 0; i < my_elements.length; i++) {
        my_elements[i].amount = parseInt(my_elements[i].amount, 10);

        if (isNaN(my_elements[i].amount)) {
          my_elements[i].amount = 0;
        }

        const Total = my_elements.reduce((prev, cur) => prev + cur.amount, 0);

        if (this.billingAmount === '') {
          this.baseAmount = 0;
        } else {
          this.baseAmount = this.billingAmount;
        }

        const vat_rate = this.vat_rate;

        this.vatAmount = vat_rate * this.billingAmount;
        this.totalAmount = (1 + vat_rate) * this.billingAmount;

        if (this.charge_commission) {
          const rate = parseInt(this.commission_rate, 10) / 100;
          this.calculatedAmount = Total * (1 - rate);
          this.handleBillAmount(Total, rate);
        } else {
          this.calculatedAmount = Total;
          this.handleBillAmount(Total, 0);
        }
      }
    },
    handleBillAmount(Total, rate) {
      if (this.billingAmount >= Total) {
        this.sendyTakeHome = Total * rate + (this.billingAmount - Total);
      } else {
        this.sendyTakeHome = Total * rate;
      }
    },
    dispatchbillingAmount() {
      this.handleTotalAmount();
    },
    searchedRider(riderData) {
      const index = riderData.riderKey;
      const riderID = riderData.riderID;

      return (this.elements[index].rider_id = riderID);
    },
    addElement() {
      this.elements.push({
        value: '',
        amount: '',
        days: '0',
        tonnage: '0',
        orders: '0',
      });
    },
    removeNewRow(index) {
      this.elements.splice(index, 1);
    },
    check(e) {
      if (e.target.checked) {
        return (this.checked = e.target.value);
      }
    },
    UpdateMessaging(status, code, msg) {
      this.submit_status = status;
      this.response_status = code;
      this.error_msg = msg;
    },
    checkEntity(e) {
      if (e.target.checked) {
        return (this.isChargeEntity = e.target.value);
      }
    },
    checkCommission(e) {
      if (e.target.checked) {
        return (this.charge_commission = e.target.value);
      }
    },
    // eslint-disable-next-line require-await
    async offline_orders() {
      const notification = [];
      let payload = {};
      const actionClass = '';
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      let hasDuplicate = false;
      this.elements
        .map(e => e.rider_id)
        .sort()
        .sort((a, b) => {
          if (a === b) hasDuplicate = true;
        });
      const riderAmountCheck = this.elements.find(o => o.amount === 0);

      for (let i = 0, iLen = this.elements.length; i < iLen; i += 1) {
        if (
          this.checked &&
          (this.elements[i].rider_id === '' ||
            this.elements[i].amount === '' ||
            this.elements[i].days === '' ||
            this.elements[i].tonnage === '' ||
            this.elements[i].order === '')
        ) {
          this.UpdateMessaging(true, 'fail', 'Please fill all entries');
        } else if (hasDuplicate) {
          this.UpdateMessaging(
            true,
            'fail',
            'Duplicate riders detected . Kindly remove one duplicate account',
          );
        } else if (riderAmountCheck !== undefined && this.checked) {
          if (Object.keys(riderAmountCheck).length > 0) {
            this.UpdateMessaging(
              true,
              'fail',
              'Rider Total Amount Earned should be greater than 0',
            );
          }
        } else if (
          this.checked &&
          this.billingAmount <= this.calculatedAmount
        ) {
          this.UpdateMessaging(
            true,
            'fail',
            'Billing amount should be greater than the Total Partner Amount Earned',
          );
        } else {
          payload = {
            app: 'CUSTOMERS_APP',
            endpoint: 'sendy/cc_actions',
            apiKey: true,
            params: {
              channel: 'customer_support_peer_biz',
              data_set: 'cc_actions',
              action_id: 26,
              action_data: {
                from: moment(this.start_date).format('YYYY-MM-DD'),
                to: moment(this.end_date).format('YYYY-MM-DD'),
                cop_id: this.user.user_details.cop_id,
                notes: this.notes,
                bill_amount: this.billingAmount,
                charge_vat: this.charge_vat,
                currency: this.currency,
                business_unit: parseInt(this.businessUnit, 10),
                pay_from_sendy_entity: this.isChargeEntity,
              },
              request_id: '1611',
              action_user: this.actionUser,
            },
          };

          if (!this.checked) {
            payload.params.action_data.partners = [];
            payload.params.action_data.charge_commission = false;
            payload.params.action_data.commission_rate = '0';
          } else {
            payload.params.action_data.partners = this.elements;
            payload.params.action_data.charge_commission = this.charge_commission;
            payload.params.action_data.commission_rate = this.commission_rate;
          }

          if (this.isChargeEntity) {
            payload.params.action_data.entity_id = 1;
          }
        }
      }
      if (Object.keys(payload).length > 0) {
        this.submit_state = true;

        setTimeout(() => {
          this.submit_state = false;
        }, 5000);

        try {
          const data = await this.perform_user_action(payload);
          if (data.status) {
            this.UpdateMessaging(true, 'success', '');
            this.updateSuccess(true);
          } else {
            let msg = '';
            if (Object.prototype.hasOwnProperty.call(data, 'message')) {
              msg = data.message;
            } else {
              msg = data.reason;
            }
            this.UpdateMessaging(true, 'fail', msg);
          }
        } catch (error) {
          this.UpdateMessaging(
            true,
            'fail',
            'Something went wrong. Try again or contact Tech Support',
          );
        }
      }
    },
    checkSubmitStatus() {
      return this.submit_state;
    },
    async fetchTaxRates() {
      const notification = [];
      let actionClass = '';
      try {
        const data = await this.request_tax_rates();
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          const countryCode = this.user.user_details.country_code;
          const vat_data = data.vat_rates.find(
            position => position.country_code === countryCode,
          );
          if (vat_data !== undefined) {
            this.vat_rate = vat_data.rate;
          } else {
            this.vat_rate = 0;
          }
          this.loading_tax_rates = false;
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>

<style scoped>
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.config {
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
.custom-biz-inline {
  max-width: 100%;
}
.config-input {
  margin-left: -15px;
  /* max-width: 103%; */
  font-size: 13px;
  width: 93% !important;
}
.config-div {
  padding-left: 0;
}
.config {
  width: 100%;
  margin-left: -15px;
}
.date-picker-input {
  max-width: 103%;
  font-size: 16px;
  background-color: #fff !important;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
.date-input {
  margin-left: -15px;
  width: 87% !important;
}
.input-group-area {
  width: 80%;
  border-radius: 0 0.25rem 0.25rem 0;
}
.invoice_valid {
  font-size: 14px !important;
  color: #dc3545;
  margin-left: -4% !important;
}
#reallocate-form > div:nth-child(2) > span > input {
  font-size: 13px !important;
}
.bill-partners-check {
  margin-right: 2%;
}
.input-amount {
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
  color: #575757;
}
.response-section {
  width: 95.5%;
  height: 44px;
  background: rgba(255, 255, 255, 0.91);
  border: 2px solid #00ae55;
  box-sizing: border-box;
  border-radius: 4px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 28px;
  margin-bottom: 2%;
}
.response-text {
  margin-top: 1%;
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
.form-outer-online {
  margin-left: 5%;
  margin-right: 5%;
}
.input-margin {
  margin-left: -2%;
}
.rider-data-inline {
  margin-left: -8%;
  padding-right: 0;
  max-width: 126.8% !important;
  width: 109% !important;
}
.table-resize {
  width: 14% !important;
}
.table-header {
  background: rgba(213, 208, 208, 0.12);
}
.search-rider-input {
  width: 38% !important;
}
.amount-input {
  width: 56% !important;
}
.extra-content {
  padding-right: 0;
}
.add-element-align {
  margin-left: -2%;
  cursor: pointer;
  color: #3c8dbc;
}
.checkbox-align {
  justify-content: flex-end;
  padding-right: 0;
}
.bill-check--padding {
  padding-right: 0;
}
.charge-commision-input {
  padding-right: 0;
  width: 26%;
}
.offline-orders-submit {
  justify-content: flex-end;
  padding-right: 10.4%;
}
.offline-charge-vat {
  margin-top: 6%;
  margin-left: -4%;
}
.offline-billing-input {
  margin-left: -5%;
  width: 105% !important;
}
.offline-billing-label {
  margin-bottom: 2%;
}
.offline-billing-amount {
  margin-left: 5%;
}
.amount-calculator-header {
  background: rgba(215, 210, 210, 0.2);
}
.amount-calculator {
  margin-top: 3%;
  max-width: 46% !important;
}
.notes-input {
  margin-left: -5%;
  height: 64px;
}
.notes-padding {
  margin-bottom: 2%;
}
.lower-section {
  margin-left: -2%;
  margin-bottom: 3%;
}
.charge_rate--label {
  margin-left: 6%;
}
.commision-rate {
  width: 81% !important;
}
.bill-partners-align {
  padding-bottom: 2%;
}
.input-amount {
  font-size: 17px;
  line-height: 17px;
}
.start-date--align {
  margin-left: -1%;
}
.pay-partner--checkbox {
  margin-left: -3%;
}
.partner-header {
  width: 34% !important;
}
.amount-header {
  width: 23% !important;
}
.days-header {
  width: 13% !important;
}
.amount-layout {
  margin-top: 7%;
}
.amount-breakdown {
  font-size: 13px !important;
  line-height: 3px !important;
  font-weight: 500;
}
.breakdown-header {
  background: none;
  font-style: italic;
  color: #3c8dbc;
}
.business-unit-select {
  margin-left: -8px;
  width: 44%;
}
.entity-checkbox {
  margin-top: 2%;
}
</style>
