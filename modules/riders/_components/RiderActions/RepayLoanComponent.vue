<template>
  <div class="row">
    <form
      id="reallocate-form"
      @submit.prevent="savingsTransfer"
      class="form-inline"
    >
      <div class="form-group col-md-6 actions option user-input">
        <label>Payment Method</label>
        <v-select
          :options="reapymentmethod"
          :reduce="type => type.code"
          name="type"
          label="type"
          class="form-control select"
          placeholder="Payment Method"
          :id="`mode`"
          v-model="method"
          :class="{
            'is-invalid': submitted && $v.method.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.method.required" class="invalid-feedback">
          Payment Method is required
        </div>
      </div>
      <div class="form-group col-md-6 user-input">
        <label>Amount</label>
        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ user.default_currency }}</span>
          </div>
          <div class="input-group-area">
            <input
              type="text"
              v-model="amount"
              :id="`amount`"
              name="amount"
              placeholder="Amount"
              class="form-control"
              :class="{
                'is-invalid': submitted && $v.amount.$error,
              }"
            />
          </div>
          <div v-if="submitted && !$v.amount.required" class="invalid-feedback">
            Amount is required
          </div>
        </div>
      </div>
      <div class="form-group col-md-6 actions option user-input">
        <label>OutStanding Loan </label>
        <v-select
          :options="loanTypes"
          :reduce="type => type.code"
          name="type"
          label="type"
          class="form-control select"
          placeholder="OutStanding Loan"
          :id="`loantype`"
          v-model="loantype"
          :class="{
            'is-invalid': submitted && $v.loantype.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.loantype.required" class="invalid-feedback">
          OutStanding Loan is required
        </div>
      </div>
      <div class="col-md-6 user-input">
        <div class="form-group">
          <label>Narrative </label>
          <input
            type="text"
            v-model="narrative"
            :id="narrative"
            name="narrative"
            placeholder="Narrative"
            class="form-control"
            :class="{
              'is-invalid': submitted && $v.narrative.$error,
            }"
          />
          <div
            v-if="submitted && !$v.narrative.required"
            class="invalid-feedback"
          >
            Narrrative is Required
          </div>
        </div>
      </div>
      <div class="form-group col-md-6 actions option user-input">
        <label>Repayment Frequency</label>
        <v-select
          :options="repaymentModes"
          :reduce="status => status.code"
          name="status"
          label="status"
          class="form-control select"
          placeholder="Repayment Mode"
          :id="`mode`"
          v-model="repaymentmode"
          :class="{
            'is-invalid': submitted && $v.repaymentmode.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.repaymentmode.required"
          class="invalid-feedback"
        >
          Repayment Mode is required
        </div>
      </div>
      <div class="form-group col-md-6" v-if="this.method === '1'">
        <input
          type="text"
          v-model="PaymentID"
          :id="PaymentID"
          name="PaymentID"
          placeholder="PaymentID"
          class="form-control bill-input"
          :class="`form-control bill-input ${hide}`"
        />
        <div class="invalid-feedback">
          PaymentID is required
        </div>
      </div>
      <div class="col-md-12">
        <button class="btn btn-primary action-button transfer-button">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'RepayLoanComponent',
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
      loantype: '',
      repaymentmode: '',
      method: '',
      reapymentmethod: [
        { code: 1, type: 'Mpesa' },
        { code: 2, type: 'Current' },
      ],
      loanTypes: [
        { code: 6, type: 'Sacco Loan' },
        { code: 1, type: 'Tracker Loan' },
        { code: 7, type: 'Insurance' },
        { code: 2, type: 'Box Loan' },
        { code: 9, type: 'Fuel Advance' },
        { code: 'Damage', type: 'Loss or Damage' },
      ],
      repaymentModes: [
        { code: '1', status: 'Weekly' },
        { code: '3', status: 'One Time' },
      ],
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    loantype: { required },
    repaymentmode: { required },
    method: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
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
    handleError(status, error) {
      const notification = [];
      let actionClass = '';
      if (!status) {
        notification.push(data.error);
        actionClass = this.display_order_action_notification(status);
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },

    async savingsTransfer() {
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
            payment_type: 5,
            mpesa_ref: 'None',
            currency: riderCurrency,
            payment_method: this.method,
            outstanding_loans: this.loantype,
            payment_id: this.paymentID,
            _user_id: adminID,
            action_user: this.actionUser,
            _user_email: email,
          },
          request_id: 207,
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
}
.user-input {
  margin-bottom: 17px;
}
</style>
