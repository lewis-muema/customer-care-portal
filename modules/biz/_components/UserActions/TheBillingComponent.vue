<template>
  <div class="row">
    <div v-if="display_billing_info" class="biz-billing-outer">
      <p class="info">
        <i class="fa fa-exclamation-circle info-loader"></i>
        {{ billingInfo() }}
      </p>
    </div>
    <form id="reallocate-form" @submit.prevent="bill" class="form-inline">
      <div class="col-md-12 row" v-if="!isReverseTransaction">
        <div
          :class="`col-md-6 user-search user-input user-acc`"
          v-if="!isTransferOrder || !isReverseTransaction"
        >
          <label>Account to Pay</label>
          <TheSearchRiderComponent
            @riderData="searchedRider"
            :category="category"
            :arr="array"
            :rider-key="0"
          />
          <div :class="`${emptyClass} ${hid}`">
            Account to pay is required
          </div>
        </div>

        <div class="form-group col-md-6 bill-div user-input">
          <label class="amount-align"
            >Amount ( <strong>Exclusive of Vat</strong>)</label
          >
          <div class="input-group amount-align">
            <div class="input-group-icon">
              <span> {{ currency }}</span>
            </div>
            <div class="input-group-area" v-if="paymentOption === '2'">
              <input
                type="number"
                v-model="amount"
                name="amount"
                placeholder="Amount"
                class="form-control"
              />
            </div>
            <div class="input-group-area" v-else>
              <input
                type="number"
                v-model="amount"
                name="amount"
                placeholder="Amount"
                class="form-control"
                :max="max_amount"
                :disabled="billingStatus()"
              />
            </div>
            <div
              v-if="submitted && !$v.amount.required"
              class="invalid-feedback"
            >
              Base Amount is required
            </div>
          </div>
        </div>
      </div>
      <div class="form-group col-md-6 user-input">
        <label class="bill">Business Units</label>
        <v-select
          :options="businessUnits"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select Business Unit"
          class="form-control select user-billing"
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
      <div
        class="form-group  col-md-6 user-input"
        v-if="!noTransactiodIDTypes.includes(billingType)"
      >
        <label class="bill">Order Number / Transaction ID</label>

        <input
          type="text"
          v-model="refNo"
          name="refNo"
          placeholder="Reference No"
          class="form-control bill-input"
          :class="`form-control bill-input ${hide}`"
        />
        <div class="invalid-feedback">
          Reference No is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input">
        <label class="bill">Other Notes</label>

        <input
          type="text"
          v-model="narrative"
          name="narrative"
          placeholder="Narrative"
          class="form-control bill-input"
          :class="{
            'is-invalid': submitted && $v.narrative.$error,
          }"
        />
        <div
          v-if="submitted && !$v.narrative.required"
          class="invalid-feedback"
        >
          Billing Narrative is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input">
        <label class="bill">Billing Type</label>
        <v-select
          :options="billingTypes"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select Billing Type"
          class="form-control select user-billing"
          :id="`billing_types`"
          v-model="billingType"
          :class="{
            'is-invalid': submitted && $v.billingType.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.billingType.required"
          class="invalid-feedback"
        >
          Billing type is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input" v-if="isTransferOrder">
        <label class="bill">Account Type to Transfer</label>
        <v-select
          :options="accountTypes"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select account type to transfer"
          class="form-control select user-billing"
          :id="`accountTypes`"
          v-model="accountType"
        >
        </v-select>
      </div>
      <div class="col-md-6 user-search user-input" v-if="isTransferOrder">
        <label>Account Details to Transfer</label>
        <TheSearchUserComponent
          :class="rider_search"
          @userID="searchedUser"
          :user="userType"
        />
      </div>
      <div class="row col-md-12" v-if="!isReverseTransaction">
        <div class="form-group col-md-3 bill-check" v-if="!isTransferOrder">
          <input
            value="1"
            name="charge_biz_commission"
            id="charge_biz_commission>"
            type="checkbox"
            class=""
            @click="check($event)"
            v-model="checked"
            checked
          />
          <label class="charge_commission--label">Charge Commission</label>
        </div>
      </div>
      <button
        class="btn btn-primary action-button"
        :disabled="checkSubmitStatus()"
      >
        Process
        <span v-if="checkSubmitStatus()">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheBillingComponent',
  components: {
    TheSearchRiderComponent: () => import('./TheSearchRiderComponent'),
    TheSearchUserComponent: () =>
      import('~/modules/users/_components/TheSearchUserComponent'),
  },
  extends: VueTypeahead,

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
      currentUser: 'rider',
      rider: 0,
      accountID: null,
      amount: '',
      narrative: '',
      checked: true,
      refNo: '',
      limit: 5,
      minChars: 1,
      hide: '',
      hid: 'hidden',
      submitted: false,
      query: '',
      category: 'billing',
      billingType: '',
      accountType: '',
      emptyClass: '',
      solr: {
        riders: 'RIDER_SEARCH',
      },
      accountTypes: [
        { value: 1, name: 'Peer' },
        { value: 2, name: 'Business' },
      ],
      billingTypes: [
        { value: 1, name: 'Extra Miles', transactionID: 1 },
        { value: 2, name: 'Waiting Time', transactionID: 1 },
        { value: 4, name: 'Return Trip', transactionID: 1 },
        { value: 5, name: 'Extra Stops', transactionID: 1 },
        { value: 8, name: 'Cancellation Fee', transactionID: 1 },
        { value: 9, name: 'Offloading Charges', transactionID: 1 },
        { value: 15, name: 'Transfer Orders', transactionID: 1 },
      ],
      noTransactiodIDTypes: [6, 7, 14],
      array: {
        rider_name: 'Sendy Bill',
        phone_no: '',
        rider_id: 0,
      },
      display_billing_info: true,
      userRb: '0',
      paymentOption: '',
      max_amount: '0',
      submit_status: false,
      businessUnits: [
        { value: 1, name: 'Merchant Business Units - MBU' },
        { value: 2, name: 'Enterprise Business Units - EBU' },
        { value: 3, name: 'Freight Business Units - FBU' },
      ],
      businessUnit: '',
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    billingType: { required },
    businessUnit: { required },
  },
  computed: {
    ...mapState(['config']),

    actionUser() {
      return this.session.payload.data.name;
    },
    permissions() {
      return JSON.parse(this.session.payload.data.privilege);
    },
    userType() {
      const arr = this.accountTypes;
      const index = arr
        .map(c => {
          return c.value;
        })
        .indexOf(this.accountType);
      const selectedUser = arr[index];
      return typeof selectedUser !== 'undefined'
        ? selectedUser.name
        : 'Business';
    },
    transactionID() {
      const arr = this.billingTypes;
      const index = arr
        .map(c => {
          return c.value;
        })
        .indexOf(this.billingType);
      const selectedType = arr[index];
      return typeof selectedType !== 'undefined'
        ? selectedType.transactionID
        : '';
    },
    isTransferOrder() {
      return this.billingType === 15;
    },
    isReverseTransaction() {
      return this.billingType === 99;
    },
    copID() {
      return this.user.user_details.cop_id;
    },
    actionID() {
      return this.rider > 0 ? 14 : 13;
    },
    requestID() {
      return this.rider > 0 ? 1611 : 110;
    },
  },
  mounted() {
    this.handleUserData();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      perform_user_action: 'perform_user_action',
    }),
    check(e) {
      if (e.target.checked) {
        return (this.checked = e.target.value);
      }
    },
    searchedRider(riderData) {
      return (this.rider = riderData.riderID);
    },
    searchedUser(userID) {
      return (this.accountID = userID);
    },
    async bill() {
      if (this.billingType !== 15 && this.rider === null) {
        this.emptyClass = 'search-invalid';
        this.hid = '';
      }

      if (this.billingType !== 99) {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
      }
      if (
        !this.noTransactiodIDTypes.includes(this.billingType) &&
        this.refNo === ''
      ) {
        this.hide = 'is-invalid';
        return;
      }

      const notification = [];
      let actionClass = '';

      const rider_id = this.rider > 0 ? this.rider : '';
      const user_id = this.rider > 0 ? 0 : 0;
      const creditor_details = this.billingType === 15 ? this.accountID : '';
      const isPeer = !(this.accountType > 1);
      const is_peer = this.billingType === 15 ? isPeer : '';
      let action_id = this.billingType === 15 ? 21 : this.actionID;
      const vat_exempt = this.user.cop_details.vat_exempt;

      if (this.businessUnit === '') {
        notification.push('Business Unit is required !!!');
        actionClass = 'danger';
      } else {
        let action_payload = {
          amount: this.amount,
          cop_id: this.copID,
          user_id,
          rider_id,
          narrative: this.narrative,
          currency: this.currency,
          billing_type: this.billingType,
          order_number: this.refNo,
          deduct_commission: this.checked,
          transaction_id: this.transactionID,
          is_peer,
          creditor_id: creditor_details,
          business_unit: parseInt(this.businessUnit, 10),
          vat_exempt: vat_exempt ? 1 : 0,
        };

        if (this.billingType === 99) {
          action_id = 22;
          action_payload = {
            cop_id: this.copID,
            user_id,
            pay_reference: this.refNo,
            business_unit: parseInt(this.businessUnit, 10),
            vat_exempt: vat_exempt ? 1 : 0,
          };
        }

        const payload = {
          app: 'CUSTOMERS_APP',
          endpoint: 'sendy/cc_actions',
          apiKey: true,
          params: {
            channel: 'customer_support_peer_biz',
            data_set: 'cc_actions',
            action_id,
            action_data: action_payload,
            request_id: this.requestID,
            action_user: this.actionUser,
          },
        };

        this.submit_status = true;

        try {
          const data = await this.perform_user_action(payload);
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
          this.submit_status = false;
          if (data.status) {
            this.updateSuccess(true);
          }
        } catch (error) {
          this.submit_status = false;
          notification.push(
            'Something went wrong. Try again or contact Tech Support',
          );
          actionClass = 'danger';
        }
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    checkSubmitStatus() {
      return this.submit_status;
    },
    handleUserData() {
      this.paymentOption = this.user.user_details.payment_option;
      if (
        this.paymentOption === '2' ||
        this.permissions.approve_cancellation_billing
      ) {
        this.display_billing_info = false;
        this.max_amount = '';
      } else {
        if (this.user.payments.length > 0) {
          const amount = this.user.payments[0].rb.toString().replace('-', '');
          this.max_amount = parseInt(amount, 10);
          this.userRb = this.formatNumber(this.user.payments[0].rb);
        }
      }
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    billingInfo() {
      const user_currency = this.user.user_details.default_currency;
      if (this.userRb === '0') {
        return `Billing amount disabled as user has a balance of  ${user_currency} ${this.userRb} `;
      } else if (this.userRb > '0') {
        return `Billing amount disabled as user owes ${user_currency} ${this.userRb}`;
      } else {
        return `Billing amount should be less or equal to ${user_currency} ${this.userRb.replace(
          '-',
          '',
        )} `;
      }
    },
    billingStatus() {
      let disabled = false;
      if (
        (this.userRb === '0' || this.userRb > '0') &&
        !this.permissions.approve_cancellation_billing
      ) {
        disabled = true;
      }
      return disabled;
    },
  },
};
</script>
<style scoped>
.form-inline .form-control {
  width: 95%;
  border-radius: 0.25rem;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.bill {
  width: 100%;
  margin-left: -15px;
}
.bill-check {
  margin: 15px 0 15px -13px;
}
.charge_commission--label {
  margin: 0 4px 0;
}
.bill-div {
  padding-left: 0;
}
.input-group-area {
  width: 84%;
  border-radius: 0 0.25rem 0.25rem 0;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.bill-input {
  margin-left: -15px;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
.display-input {
  margin-left: 14px;
}
.user-input {
  margin-bottom: 15px;
}
.search-invalid {
  /* display: none; */
  width: 100%;
  margin-top: 0.25rem;
  font-size: 46%;
  color: #dc3545;
}
.form-inline {
  margin-left: 2%;
}
.info {
  color: #00a65a;
  width: 500px;
  font-size: 15px;
  font-weight: 600;
}
.info-loader {
  color: #00a65a;
  font-weight: 700;
  font-size: 19px;
  padding-right: 2%;
}
.charge_vat--label {
  margin: 0 4px 0;
}
.user-acc {
  margin-bottom: 0 !important;
}
.amount-align {
  margin-left: 5%;
}
.biz-billing-outer {
  margin-left: 2%;
}
</style>
