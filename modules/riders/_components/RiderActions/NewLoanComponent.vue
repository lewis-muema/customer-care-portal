<template>
  <div class="row">
    <form
      id="reallocate-form"
      @submit.prevent="savingsTransfer"
      class="form-inline"
    >
      <div class="form-group col-md-4 user-input">
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
      <div class="form-group col-md-4 actions user-input">
        <label>Type of Loan </label>
        <v-select
          :options="loanTypes"
          :reduce="type => type.code"
          name="type"
          label="type"
          class="form-control select"
          placeholder="Type of Loan"
          :id="`loantype`"
          v-model="loantype"
          :class="{
            'is-invalid': submitted && $v.loantype.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.loantype.required" class="invalid-feedback">
          loantype is required
        </div>
      </div>
      <!-- <div class=""> -->
      <div class="col-md-4 form-group user-input">
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
      <div class="form-group col-md-4 actions user-input">
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
      <div class="form-group user-input" v-if="this.repaymentmode === '1'">
        <input
          type="text"
          v-model="repaymentamount"
          :id="repaymentamount"
          name="repaymentamount"
          placeholder="Repayment Amount"
          class="form-control bill-input"
          :class="`form-control bill-input ${hide}`"
        />
        <div class="invalid-feedback">
          Reference No is required
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
  name: 'NewLoanComponent',
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
            loan_type: this.loantype,
            amount: this.amount,
            narrative: this.narrative,
            repayment_amount:
              this.repaymentmode === '3' ? '0' : this.repaymentamount,
            frequency: this.repaymentmode,
            payment_type: 7,
            mpesa_ref: 'None',
            currency: riderCurrency,
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
.option {
  margin-top: 16px;
}

.user-input {
  margin-bottom: 15px;
}
</style>
