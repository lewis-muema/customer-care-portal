<template>
  <form
    id="reallocate-form"
    @submit.prevent="bill"
    class="form-inline col-md-12"
  >
    <div :class="`col-md-4 user-search user-input`" v-if="!isTransferOrder">
      <label>Account to Pay</label>
      <TheSearchRiderComponent @riderID="searchedRider" :category="category" />
      <div :class="`${emptyClass} ${hid}`">
        Account to pay is required
      </div>
    </div>
    <div class="form-group col-md-4 bill-div user-input">
      <label>Amount</label>
      <div class="input-group">
        <div class="input-group-icon">
          <span> {{ currency }}</span>
        </div>
        <div class="input-group-area">
          <input
            type="text"
            v-model="amount"
            name="amount"
            placeholder="Amount"
            class="form-control"
          />
        </div>
        <div v-if="submitted && !$v.amount.required" class="invalid-feedback">
          Amount is required
        </div>
      </div>
    </div>
    <div class="form-group col-md-4 user-input">
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
      <div v-if="submitted && !$v.narrative.required" class="invalid-feedback">
        Billing Narrative is required
      </div>
    </div>
    <div class="form-group col-md-4 user-input">
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
    <div
      class="form-group  col-md-4 user-input"
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
    <div class="form-group col-md-4 user-input" v-if="isTransferOrder">
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
    <div class="col-md-4 user-search user-input" v-if="isTransferOrder">
      <label>Account Details to Transfer</label>
      <TheSearchUserComponent @userID="searchedUser" :user="userType" />
    </div>
    <div class="form-group  col-md-12 bill-peer">
      <button class="btn btn-primary action-button">
        Bill Account
      </button>
    </div>
  </form>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheBillingComponent',
  components: {
    TheSearchRiderComponent: () =>
      import('~/modules/biz/_components/UserActions/TheSearchRiderComponent'),
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
        { value: 2, name: 'Waiting Time', transactionID: 14 },
        { value: 4, name: 'Return Trip', transactionID: 1 },
        { value: 5, name: 'Extra Stops', transactionID: 1 },
        { value: 6, name: 'Offline Orders', transactionID: 1 },
        { value: 8, name: 'Cancellation Fee', transactionID: 1 },
        { value: 9, name: 'Offloading Charges', transactionID: 1 },
        { value: 12, name: 'Cash Order', transactionID: 1 },
        { value: 14, name: 'Customer Coupon', transactionID: 1 },
        { value: 15, name: 'Transfer Orders', transactionID: 1 },
        { value: 100, name: 'Other', transactionID: 100 },
      ],
      noTransactiodIDTypes: [6, 9, 14],
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    billingType: { required },
  },
  computed: {
    ...mapState(['config']),

    actionUser() {
      return this.session.payload.data.name;
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
    user_id() {
      return this.user.user_details.user_id;
    },

    actionID() {
      return this.rider > 0 ? 14 : 13;
    },
    requestID() {
      return 1622;
    },
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
    searchedRider(riderID) {
      return (this.rider = riderID);
    },
    searchedUser(userID) {
      return (this.accountID = userID);
    },
    async bill() {
      if (this.billingType !== 15 && this.rider === null) {
        this.emptyClass = 'search-invalid';
        this.hid = '';
      }
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
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

      const cop_id = 0;
      const creditor_details = this.billingType === 15 ? this.accountID : '';
      const isPeer = !(this.accountType > 1);
      const is_peer = this.billingType === 15 ? isPeer : '';
      const rider_id = this.rider > 0 ? Number(this.rider) : '';
      const action_id = this.billingType === 15 ? 21 : this.actionID;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id,
          action_data: {
            amount: this.amount,
            cop_id,
            user_id: this.user_id,
            rider_id,
            narrative: this.narrative,
            currency: this.currency,
            billing_type: this.billingType,
            order_number: this.refNo,
            transaction_id: this.transactionID,
            is_peer,
            creditor_id: creditor_details,
          },
          request_id: this.requestID,
          action_user: this.actionUser,
        },
      };
      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          this.updateSuccess(true);
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
  width: 80%;
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
.Typeahead__input {
  width: 100%;
  padding: 8px 0;
}
.user-search {
  padding: 0;
}
</style>
