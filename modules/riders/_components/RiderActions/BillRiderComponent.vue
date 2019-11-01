<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="submitPayment"
      class="form-inline"
    >
      <div class="form-group col-md-6 bill-div user-input">
        <label>Amount</label>
        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ user.default_currency }}</span>
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
      <div class="form-group col-md-6">
        <label class="bill">Other Notes</label>
        <input
          type="text"
          v-model="narrative"
          :id="narrative"
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
          Narrative is required
        </div>
      </div>
      <div class="form-group  col-md-6 user-input">
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
      <div class="form-group col-md-12 bill-check">
        <input
          value="1"
          id="checkbox>"
          type="checkbox"
          class=""
          v-model="ischecked"
        />
        <label for="" class="charge_commission--label">Credit Client</label>
      </div>
      <div class="form-group  col-md-6 user-input" v-if="ischecked">
        <label class="bill">Cop Account Name / User Phone Number </label>

        <input
          type="text"
          v-model="clientNo"
          name="clientNo"
          placeholder="SENDY1083/0701234567"
          class="form-control bill-input"
          :class="`form-control bill-input ${hide}`"
        />
        <div class="invalid-feedback">
          Client No is required
        </div>
      </div>
      <button class="btn btn-primary action-button">
        Pay
      </button>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'BillRiderComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amount: '',
      narrative: '',
      submitted: false,
      account: '',
      ischecked: false,
      clientNo: '',
      billingType: '',
      refNo: '',
      peer: null,
      hide: '',
      billingTypes: [
        { value: 1, name: 'Extra Miles', transactionID: 1 },
        { value: 2, name: 'Waiting Time', transactionID: 1 },
        { value: 4, name: 'Return Trip', transactionID: 1 },
        { value: 5, name: 'Extra Stops', transactionID: 1 },
        { value: 6, name: 'Offline Orders', transactionID: 1 },
        { value: 7, name: 'Dedicated Driver', transactionID: 1 },
        { value: 8, name: 'Cancellation Fee', transactionID: 1 },
        { value: 9, name: 'Offloading Charges', transactionID: 1 },
        { value: 10, name: 'Loaders', transactionID: 1 },
        { value: 11, name: 'Top Up', transactionID: 1 },
        { value: 12, name: 'Cash Order', transactionID: 1 },
        { value: 14, name: 'Customer Support Coupon', transactionID: 2 },
        { value: 100, name: 'Other', transactionID: 100 },
      ],
      noTransactiodIDTypes: [6, 7, 14],
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    billingType: { required },
    refNo: { required },
  },

  computed: {
    actionUser() {
      return this.session.payload.data.name;
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
    client() {
      return this.isPeer();
    },
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
    }),
    isPeer() {
      if (this.clientNo.length > 5) {
        if (this.clientNo.includes('sendy')) {
          this.peer = false;
          return this.peer;
        } else {
          this.peer = true;
          return this.peer;
        }
      }
    },
    async submitPayment() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const riderID = this.user.rider_id;
      const riderCurrency = this.user.default_currency;
      const email = this.session.payload.data.email;
      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'sendy/rt_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 1,
          action_data: {
            pay_out: true,
            pay_frommpesa: false,
            rider_id: riderID,
            loan_type: 1,
            amount: this.amount,
            narrative: this.narrative,
            payment_type: 2,
            mpesa_ref: 'None',
            currency: riderCurrency,
            _user_id: adminID,
            action_user: this.actionUser,
            _user_email: email,
            pay_customer: this.ischecked,
            account_no: this.clientNo,
            billing_type: this.billingType,
            order_number: this.refNo,
            transaction_id: this.transactionID,
            is_peer: this.client,
          },
          request_id: 202,
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
</style>
