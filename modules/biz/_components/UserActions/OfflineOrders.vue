<template>
  <div>
    <div class="mb-3">
      <span class="title"> Billing Period </span>
    </div>
    <div class="response-section" v-if="submit_status">
      <p class="response-text" v-if="response_status === 'success'">
        <i class="fa fa-check-circle invoice-loader--align submit-success"></i>
        Data submitted successfully /p>
      </p>

      <p class="response-text" v-else>
        <i
          class="fa fa-exclamation-circle invoice-loader--align submit-error"
        ></i>
        {{ error_msg }}
      </p>
    </div>
    <div class="row">
      <div class="form-group col-md-5 user-input">
        <label class="small-font"> From </label>

        <date-picker
          v-model="start_date"
          class="date-input"
          :input-props="{
            placeholder: 'Start date',
            readonly: true,
            class: 'form-control mt-n2',
          }"
        />
        <div class="invoice_valid " v-if="submitted && !$v.start_date.required">
          Start Date is required
        </div>
      </div>

      <div class="form-group col-md-5 user-input">
        <label class="small-font"> To</label>
        <date-picker
          v-model="end_date"
          class="date-input"
          :input-props="{
            placeholder: 'End date',
            readonly: true,
            class: 'form-control mt-n2',
          }"
        />
        <div class="invoice_valid" v-if="submitted && !$v.end_date.required">
          End Date is required
        </div>
      </div>
    </div>
    <div class="row pl-2">
      <div class="form-group col-md-5  business-unit-select">
        <label class="small-font">Business Units</label>
        <v-select
          :options="businessUnits"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select Business Unit"
          class="form-control select"
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
    </div>
    <hr />

    <div>
      <div>
        <span class="title"> Partner Details</span>
      </div>

      <div class="mt-3 row">
        <div class="ml-3 mt-1">
          <span> Are we paying partners?</span>
        </div>
        <div class="form-check ml-3">
          <input
            type="radio"
            name="payPartner"
            class="form-check-input"
            id="radion1"
            :value="true"
            @change="checked = true"
          />
          <label class="form-check-label mt-1" for="radio1"> Yes </label>
        </div>
        <div class="form-check ml-3">
          <input
            type="radio"
            name="payPartner"
            class="form-check-input"
            id="radion2"
            :value="false"
            @change="checked = false"
            checked
          />
          <label class="form-check-label mt-1" for="radio2"> No </label>
        </div>
      </div>

      <div class="mt-5" v-if="checked">
        <span>Enter Partner payment details below</span>
        <div class="mt-3 row" v-for="(element, key) in elements" :key="key">
          <div class="col-3">
            <span class="small-font" v-if="key === 0"> Partner Account</span>
            <OfflineSearchSearchRider
              :category="category"
              v-model="element.rider_id"
              :arr="array"
              @riderData="searchedRider"
              :rider-key="key"
            />
          </div>
          <div>
            <span class="small-font" v-if="key === 0">Vendor Type</span>
            <div class="mt-1">
              <span class="muted-text">
                {{
                  !element.vendor_type
                    ? '0 Tonnes'
                    : getVendorType(element.vendor_type)
                }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <span class="small-font" v-if="key === 0">Partner Earnings</span>
            <div class="input-group">
              <div class="input-group-icon">
                <span> {{ currency }}</span>
              </div>
              <div class="amount-input">
                <input
                  type="number"
                  v-model="element.amount"
                  name="amount"
                  placeholder="0"
                  class="form-control text-right"
                />
              </div>
            </div>
          </div>
          <div class="col-2">
            <span class="small-font" v-if="key === 0">No. of Days worked</span>
            <div class="">
              <input
                type="number"
                v-model="element.days"
                name="amount"
                placeholder="0"
                class="form-control text-right"
              />
            </div>
          </div>

          <div class="col-2">
            <span class="small-font" v-if="key === 0">No. of Orders</span>
            <div class="">
              <input
                type="number"
                v-model="element.orders"
                name="amount"
                placeholder="0"
                class="form-control text-right"
              />
            </div>
          </div>

          <div class="mt-2" v-if="key > 0" @click="removeNewRow(key)">
            <i
              class="fa fa-times midnightBlue20Color"
              aria-hidden="true"
              role="button"
            ></i>
            <span class="add-row-font">Remove</span>
          </div>
        </div>

        <div class="mt-3" @click="addElement">
          <span class="midnightBlue20Color" role="button">+</span>
          <span class="add-row-font ml-2">Add another Partner</span>
        </div>
      </div>
    </div>
    <hr class="mt-4" />

    <div>
      <span class="title">Customer Billing Details</span>
      <div class="mt-3 row">
        <div class="mb-3 col-5">
          <label for="invoice" class="form-label small-font">
            Invoice Notes
          </label>
          <textarea
            class="form-control mt-n2"
            id="invoice"
            placeholder="Add notes for the Customer and Finance team"
            rows="3"
            v-model="notes"
          >
          </textarea>
          <div class="invoice_valid" v-if="submitted && !$v.notes.required">
            Notes is required
          </div>
        </div>

        <div class="col-3">
          <span class="small-font">Amount to Bill (before VAT)</span>
          <div class="input-group">
            <div class="input-group-icon">
              <span> {{ currency }}</span>
            </div>
            <div class="amount-input">
              <input
                type="number"
                name="amount"
                placeholder="0"
                id="input"
                class="form-control text-right"
                v-model="billingAmount"
                @keyup="dispatchbillingAmount"
              />
            </div>
            <div
              class="invoice_valid"
              v-if="submitted && !isChargeEntity && billingAmount === ''"
            >
              Billing Amount is required
            </div>
          </div>
        </div>

        <div class="col pl-0">
          <div class="d-flex mt-3">
            <div class="cost">
              <div class="mt-3 ml-2">
                <span class="mt-3 cost-text">
                  Total Partner Cost
                </span>
              </div>
              <div class="total-cost mt-2">
                <span>
                  {{ currency }} {{ CommaSeperator(calculatedAmount) }}
                </span>
              </div>
            </div>
            <div class="cost ml-1">
              <div class="mt-3 ml-2">
                <span class="mt-3 cost-text">
                  Sendy Take Home
                </span>
              </div>
              <div class="total-cost mt-2">
                <span>
                  {{ currency }} {{ CommaSeperator(sendyTakeHome) }}
                </span>
              </div>
            </div>
          </div>
          <div class="cost mt-2">
            <div class="ml-2 pt-3">
              <div>
                <span class="cost-text">
                  {{ determineVAT() }}
                </span>
                <span class="float-right total-cost">
                  {{ currency }} {{ CommaSeperator(vatAmount) }}
                </span>
              </div>

              <div class="mt-3">
                <span class="cost-text">
                  Total Charge to Customer
                </span>
                <span class="float-right total-cost">
                  {{ currency }} {{ CommaSeperator(totalAmount) }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button
              class="btn primary-btn float-right"
              @click="offline_orders"
              :disabled="disabled"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
    <PreviewOrderModal
      :checked="checked"
      :elements="elements"
      :prop-object="propObject"
      :show-dialog="showDialog"
      @close="handleClose"
      :payload-draft="payload"
    />
    <SubmittedModal
      :dialog-visible="showSubmittedModal"
      :customer-name="user.user_details.cop_name"
      @close="showSubmittedModal = false"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import Vue from 'vue';
import { mapActions, mapMutations } from 'vuex';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import VueNumber from 'vue-number-animation';
import moment from 'moment';
import offlineOrderMxn from '@/mixins/offline_order_mixin';

Vue.component('Calendar', Calendar);
Vue.component('DatePicker', DatePicker);
Vue.use(VueNumber);

export default {
  name: 'TheOfflineOrders',
  components: {
    OfflineSearchSearchRider: () =>
      import('./OfflineOrderComponents/OfflineOrderSearchRider'),
    PreviewOrderModal: () =>
      import('./OfflineOrderComponents/previewOrderModal'),
    SubmittedModal: () => import('./OfflineOrderComponents/submittedModal.vue'),
  },
  mixins: [offlineOrderMxn],
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
      disabled: false,
      showSubmittedModal: false,
      showDialog: false,
      submitted: false,
      start_date: '',
      end_date: '',
      amount: 0,
      checked: false,
      charge_commission: false,
      charge_vat: true,
      centerDialogVisible: false,
      elements: [
        {
          rider_id: '',
          riderDisplay: '',
          amount: '',
          days: '0',
          tonnage: '0',
          orders: '0',
          vendor_type: null,
        },
      ],
      array: {},
      category: 'Enter phone number',
      commission_rate: '20',
      calculatedAmount: 0,
      sendyTakeHome: 0,
      billingAmount: '',
      notes: '',
      submit_status: false,
      response_status: true,
      error_msg: '',
      vendorTypes: null,
      baseAmount: '',
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
      payload: {},
    };
  },
  validations: {
    end_date: { required },
    start_date: { required },
    notes: { required },
    businessUnit: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
    vat_exempt() {
      return this.user.cop_details.vat_exempt;
    },
    propObject() {
      return {
        start_date: this.start_date,
        end_date: this.end_date,
        notes: this.notes,
        currency: this.currency,
        billingAmount: this.billingAmount,
        calculatedAmount: this.calculatedAmount,
        sendyTakeHome: this.sendyTakeHome,
        vatAmount: this.vatAmount,
        totalAmount: this.totalAmount,
        vendorTypes: this.vendorTypes,
        determineVAT: this.determineVAT(),
        isChargeEntity: this.isChargeEntity,
        charge_commission: false,
        commission_rate: this.commission_rate,
      };
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
    checked: {
      handler(after, before) {
        if (!this.checked) {
          this.isChargeEntity = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchTaxRates();
    this.fetchVendorTypes();
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
      request_vendor_types: 'request_vendor_types',
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

        const vat_rate = this.vat_exempt ? 0 : this.vat_rate;

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
    addElement() {
      this.elements.push({
        riderDisplay: '',
        amount: '',
        days: '0',
        tonnage: '0',
        orders: '0',
        vendor_type: null,
      });
    },
    removeNewRow(index) {
      this.elements.splice(index, 1);
    },
    submitChecked(event) {
      this.checked = event.target.value;
    },
    searchedRider(riderData) {
      const index = riderData.riderKey;
      const riderID = riderData.item.rider_id;
      this.elements[index].vendor_type = riderData.item.vendor_type;
      this.elements[index].rider_id = riderID;
      this.elements[index].riderDisplay = riderData.riderDisplay;
    },
    async fetchVendorTypes() {
      const notification = [];
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
        this.vendorTypes = data.vendor_types;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
    },
    getVendorType(id) {
      const filtered = this.vendorTypes.filter(el => el.id === parseInt(id));
      return filtered[0].name;
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
    dispatchbillingAmount() {
      this.handleTotalAmount();
    },
    UpdateMessaging(status, code, msg) {
      this.submit_status = status;
      this.response_status = code;
      this.error_msg = msg;
    },
    offline_orders() {
      let payload = {};
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
          this.billingAmount <= this.calculatedAmount &&
          !this.isChargeEntity
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
                bill_amount: this.isChargeEntity
                  ? this.calculatedAmount
                  : this.billingAmount,
                charge_vat: this.charge_vat,
                currency: this.currency,
                business_unit: parseInt(this.businessUnit, 10),
                pay_from_sendy_entity: this.isChargeEntity,
                vat_exempt: this.vat_exempt ? 1 : 0,
              },
              request_id: '1611',
              action_user: this.actionUser,
            },
          };
          this.payload = payload;
          this.showDialog = true;
        }
      }
    },
    handleClose(val) {
      if (val) {
        this.showDialog = false;
        return;
      }
      this.showDialog = false;
      this.showSubmittedModal = true;
      this.disabled = true;
    },
  },
};
</script>

<style>
.title {
  position: static;
  font-weight: 600;
  font-size: 21px;
  line-height: 36px;
  letter-spacing: 0.15px;
  color: #303133;
}

.small-font {
  /* font-family: Nunito;
  font-style: normal; */
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  color: #606266;
}

.cost {
  height: 84px;
  width: 100%;
  background: #d3ddf6;
  border-radius: 4px;
}

.cost-preview {
  height: 84px;
  width: 100%;
  background: #e2e7ed;
  border-radius: 4px;
}

.cost-text {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 20px;
  text-align: right;
  color: #303133;
  margin-top: 8px 0px !important;
}

.total-cost {
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  text-align: right;
  color: #303133;
  margin-right: 8px;
}

.placeholder-font {
  font-family: Nunito;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  color: #c0c4cc;
  flex: none;
}

.muted-text {
  /* font-family: Nunito;
  font-style: normal;
  font-weight: normal; */
  font-size: 15px;
  line-height: 24px;
  color: #909399;
}

#input_container {
  position: relative;
}

.primary-btn {
  width: 172px;
  height: 40px;
  color: white;
  background: #324ba8;
}

#input_container > i {
  position: absolute;
  top: 12px;
  right: 15px;
  color: #909399;
}

#input_container > input {
  padding-right: 40px;
}

.midnightBlue20Color {
  color: #324ba8;
}
.azureTransporter30 {
  color: #0062db;
  cursor: pointer;
}
.add-row-font {
  font-family: Nunito;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 120%;
  text-decoration-line: underline;
  color: #324ba8;
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
  padding: 0;
  width: 100%;
  height: 40px;
  border-radius: 6px;
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
  margin-left: 2% !important;
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
