<template>
  <div class="">
    <form
      id="reallocate-form"
      @submit.prevent="update_reversal"
      class="form form-inline"
    >
      <div class="reversal-choice col-md-6" v-if="stage === 1">
        <h3>What would you like to create?</h3>
        <template v-for="(option, index) in reversalsOptions">
          <div
            class="form-group category-group"
            :class="{
              'active-category': reversalCategory === option.name,
              hidden: option.hidden,
            }"
            :key="index"
            v-if="option.users !== userType"
          >
            <input
              type="radio"
              :id="option.name"
              name="category"
              :value="option.name"
              class="options-radio"
              v-model="reversalCategory"
              @click="setReversalCategory(option)"
            />
            <label :for="option.name" class="option-label">{{
              option.title
            }}</label>
            <br />
            <span class="option-description">{{ option.description }}</span>
          </div>
        </template>
        <button
          :disabled="reversalCategory === ''"
          class="btn btn-primary action-button reversal-button pull-right"
          @click="setStage(2)"
        >
          Continue
        </button>
      </div>
      <div v-if="stage === 2" class="col-md-12">
        <div class="row top-bar">
          <div class="back-button" @click="setStage(1)">
            <i class="fa fa-arrow-left"></i>
            Back
          </div>
        </div>
        <span
          class="reversal-holder"
          v-if="categoryDetails !== null && categoryDetails.hasChild"
        >
          <div class="reversal-choice col-md-6">
            <h3>Select Reversal Type</h3>
            <div
              class="form-group type-group"
              :class="{ 'active-sub-category': reversalType === sub.name }"
              v-for="(sub, i) in categoryDetails.subMenu"
              :key="i"
            >
              <input
                type="radio"
                :id="sub.name"
                name="type"
                :value="sub.name"
                class="options-radio"
                v-model="reversalType"
                @click="setReversalType(sub)"
              />
              <label :for="sub.name" class="option-label">{{
                sub.title
              }}</label>
            </div>
          </div>
          <div
            class="reversal-choice col-md-6 reversal-inputs"
            v-if="typeDetails !== null"
          >
            <h3>{{ typeDetails.title }}</h3>
            <div class="col-md-12" v-if="typeDetails.name === 'payment'">
              <div v-if="paymentMethods === null">
                <p>
                  Fetching user payment methods ...
                  <i class="fa fa-spinner fa-spin loader"></i>
                </p>
              </div>
              <div class="form-group col-md-12 methods-holder">
                <label>Payment Method</label>
                <v-select
                  :options="paymentMethods"
                  :reduce="name => name.payment_method_id"
                  name="name"
                  label="name"
                  placeholder="Payment Method"
                  class="form-control select"
                  :id="`reallocate_reason`"
                  v-model="paymentMethod"
                >
                </v-select>
                <div
                  v-if="
                    typeDetails.name === 'payment' &&
                      submitted &&
                      paymentMethod === ''
                  "
                  class="group-error empty-results"
                >
                  Payment Method is required
                </div>
              </div>
            </div>
            <div class="form-group  col-md-12" :id="`${typeDetails.name}`">
              <label class="referenceNumber">
                {{
                  reversalCategory === 'invoice-reversal'
                    ? 'Invoice No.'
                    : 'Transaction Reference No.'
                }}
              </label>
              <div class="input-group">
                <div class="input-group-area amount-input">
                  <input
                    type="text"
                    v-model="referenceNumber"
                    :id="`referenceNumber`"
                    name="referenceNumber"
                    :placeholder="
                      reversalCategory === 'invoice-reversal'
                        ? 'Invoice No.'
                        : 'Transaction Reference No.'
                    "
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && $v.referenceNumber.$error,
                    }"
                  />
                </div>
                <div class="input-group-icon search" @click="fetchTransaction">
                  <i
                    :disabled="referenceNumber === ''"
                    class="fa fa-search"
                  ></i>
                </div>
                <div
                  v-if="submitted && !$v.referenceNumber.required"
                  class="invalid-feedback group-error"
                >
                  Reference Number is required
                </div>
              </div>
            </div>
            <div class="">
              <div v-if="transactionDetails === null && loading">
                <p>
                  Fetching user transaction details ...
                  <i class="fa fa-spinner fa-spin loader"></i>
                </p>
              </div>
              <div
                class="empty-results"
                v-if="
                  transactionDetails !== null && isEmpty(transactionDetails)
                "
              >
                * *Sorry, no results were found. Please try again.
              </div>
              <div
                v-if="
                  transactionDetails !== null && !isEmpty(transactionDetails)
                "
                class="form-group  col-md-12"
              >
                <TransactionDetails
                  :transaction-details="transactionDetails"
                  :reversal-category="reversalCategory"
                />
              </div>
            </div>
            <div
              v-if="
                transactionDetails !== null &&
                  !isEmpty(transactionDetails) &&
                  reversalCategory === 'invoice-reversal'
              "
            >
              <InvoiceDetails
                :invoice-details="transactionDetails"
                :type-details="typeDetails"
                :currency="currency"
                :user-type="userType"
                :user-id="userID"
                :reference-number="referenceNumber"
                @invoiceReversalData="invoiceReversalData"
              />
            </div>
          </div>
        </span>
        <span class="reversal-holder" v-else>
          <CreditNoteDetails
            :type-details="typeDetails"
            :currency="currency"
            :business-units="businessUnits"
            :category-details="categoryDetails"
            :user-type="userType"
            :user-id="userID"
            :user="user"
            @creditNoteData="creditNoteData"
          />
        </span>
        <span v-if="reversalType !== '' || businessUnit !== ''">
          <button
            :disabled="disabled || reversing"
            class="btn btn-primary action-button reversal-button pull-right"
            v-if="reversalCategory === 'reversal'"
            @click="update_reversal()"
          >
            Submit Reversal
            <i v-if="reversing" class="fa fa-spinner fa-spin loader"></i>
          </button>
        </span>
      </div>
      <div v-if="stage === 3" class="col-md-12">
        <div class="row top-bar">
          <div class="back-button" @click="setStage(2)">
            <i class="fa fa-arrow-left"></i>
            Back
          </div>
        </div>
        <div class="alert alert-success">
          <strong>Success!</strong> Indicates a successful or positive action.
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheReveralsComponent',
  components: {
    TransactionDetails: () => import('./TheTransactionDetailsComponent'),
    InvoiceDetails: () => import('./TheInvoiceFieldsComponent'),
    CreditNoteDetails: () => import('./TheCreditNotesComponent'),
  },
  props: ['user', 'userType'],

  data() {
    return {
      reversalsOptions: [
        {
          name: 'reversal',
          title: 'Reversal',
          description:
            'Undo a manual billing, a payment or transactions pertaining to an order ',
          hasChild: true,
          users: 'all',
          hidden: false,
          subMenu: [
            {
              name: 'full',
              title: 'Reverse an order',
              id: 1,
            },

            {
              name: 'payment',
              title: 'Payment Reversal',
              id: 2,
            },
            {
              name: 'manual-billing',
              title: 'Manual Billing Reversal',
              id: 3,
            },
          ],
        },
        {
          name: 'invoice-reversal',
          title: 'Invoice Reversal',
          description: 'Reverse the full amount or part of the amount invoiced',
          hasChild: true,
          users: 'peer',
          hidden: false,
          subMenu: [
            {
              name: 'partial-invoice',
              title: 'Partial Invoice Reversal',
              id: 2,
            },
            {
              name: 'full-invoice',
              title: 'Full Invoice Reversal',
              id: 1,
            },
          ],
        },
        {
          name: 'credit-note',
          title: 'Credit Note',
          description:
            'Creates a Credit to increase this customer running balance',
          users: 'all',
          hidden: false,
          hasChild: false,
        },
      ],
      reversalCategory: '',
      reversalType: '',
      categoryDetails: null,
      typeDetails: null,
      referenceNumber: '',
      stage: 1,
      submitted: false,
      paymentMethods: null,
      paymentMethod: '',
      businessUnit: '',
      businessUnits: null,
      amount: '',
      narrative: '',
      transactionDetails: null,
      loading: false,
      emptyRef: false,
      processed: false,
      reversing: false,
      reversalData: null,
    };
  },
  validations: {
    referenceNumber: { required },
  },
  computed: {
    ...mapGetters(['getBusinessUnits']),
    currency() {
      const currency = this.user.user_details.default_currency;
      return currency;
    },
    disabled() {
      return this.reversalCategory === 'credit-note'
        ? this.amount === '' && this.narrative === ''
        : this.transactionDetails === null ||
            this.transactionDetails.length === 0;
    },
    userID() {
      return this.userType === 'biz'
        ? this.user.user_details.cop_id
        : this.user.user_details.user_id;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  watch: {
    reversalCategory(category) {
      this.reversalCategory = category;
    },
    reversalType(type) {
      this.transactionDetails = null;
    },
    getBusinessUnits(data) {
      return (this.businessUnits = data);
    },
  },
  mounted() {
    const countryCode = this.user.user_details.country_code;
    this.fetchPaymentOptions(countryCode);
    this.setBusinessUnits();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      request_payment_methods: 'request_payment_methods',
      perform_user_action: 'perform_user_action',
      setBusinessUnits: 'requestBusinessUnits',
      requestTransactions: 'requestTransactions',
    }),
    async update_reversal() {
      this.submitted = true;
      if (this.reversalCategory !== 'credit-note') {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
      }
      const notification = [];
      let actionClass = '';

      this.reversing = true;
      const reverseData =
        this.reversalCategory === 'reversal'
          ? {
              reversalCategory: this.reversalCategory,
              reversalType: this.typeDetails.name,
              currency: this.currency,
              reversalID: this.typeDetails.id,
              referenceNumber: this.referenceNumber,
              ...(this.reversalType === 'payment' && {
                paymentMethod: this.paymentMethod,
              }),
              ...(this.reversalType === 'payment' &&
                this.paymentMethod === 1 && {
                  amount: this.transactionDetails.total_credit_amount,
                }),
            }
          : {};
      this.reversalData =
        this.reversalCategory === 'reversal' ? reverseData : this.reversalData;

      this.reversalData.user_id = this.userType === 'biz' ? 0 : this.userID;
      this.reversalData.cop_id = this.userType === 'peer' ? 0 : this.userID;
      const actionID = this.reversalCategory === 'invoice-reversal' ? 24 : 22;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: this.reversalCategory === 'credit-note' ? 28 : actionID,
          action_data: this.reversalData,
          request_id: 110,
          action_user: this.actionUser,
        },
      };

      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
        this.submit_status = false;
        this.reverse = false;

        if (data.status) {
          this.updateSuccess(true);
        }
      } catch (error) {
        this.submit_status = false;
        this.reverse = false;

        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }

      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchTransaction() {
      this.submitted = true;
      const notification = [];
      let actionClass = '';
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loading = true;
      this.emptyRef = false;
      const payload = {
        referenceNumber: this.referenceNumber,
        category: this.reversalCategory,
      };

      try {
        const data = await this.requestTransactions(payload);
        if (data.status === 200) {
          this.transactionDetails = data.data;
          this.clearErrorMessages();
        } else {
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.updateClass(actionClass);
          this.updateErrors(notification);
          this.transactionDetails = null;
        }
      } catch (error) {
        return error;
      }
      this.loading = false;
    },
    async fetchPaymentOptions(countryCode) {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PAYMENT_SERVICE',
        endpoint: 'accounts/pay_methods',
        apiKey: false,
        params: {
          country_code: countryCode,
          account_type: 'Sendy Staff',
          entry_point: 'CC Portal',
        },
      };
      const cashMethod = {
        available: true,
        name: 'Cash',
        payment_method_id: 5,
      };
      try {
        const data = await this.request_payment_methods(payload);
        const error = !this.status ? data.error : '';
        if (!data.status) {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
          this.updateClass(actionClass);
          this.updateErrors(notification);
        } else {
          data.payment_methods.push(cashMethod);
        }
        return (this.paymentMethods = data.payment_methods);
      } catch (error) {
        this.status = false;
      }
    },
    invoiceReversalData(invoiceReversalData) {
      this.reversalData = invoiceReversalData;
    },
    creditNoteData(creditNoteData) {
      this.reversalData = creditNoteData;
    },
    clearErrorMessages() {
      const notification = [];
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    reset() {
      this.reversing = false;
      this.submitted = false;
      this.processed = false;
      this.transactionDetails = null;
      this.referenceNumber = '';
      this.paymentMethod = '';
      this.emptyRef = false;
      this.clearErrorMessages();
    },
    setReversalCategory(option) {
      this.reset();
      this.typeDetails = null;
      this.categoryDetails = option;
    },
    setReversalType(data) {
      this.reset();
      this.typeDetails = data;
    },
    setStage(stage) {
      this.stage = stage;
    },
    isEmpty(obj) {
      for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }

      return JSON.stringify(obj) === JSON.stringify({});
    },
  },
};
</script>
<style scoped>
@import '@/assets/style/reversal.css';
</style>
