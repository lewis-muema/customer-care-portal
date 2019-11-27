<template>
  <div class="row">
    <div v-if="loading_loan_types" style="margin-left: 1%;">
      <p>
        Fetching Loan Types ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else class="">
      <div
        class="process-request"
        v-if="process_request"
        :class="{ success: isActive, error: hasError }"
      >
        <p>
          {{ response_handler }}
        </p>
      </div>
      <form
        id="reallocate-form"
        @submit.prevent="savingsTransfer"
        class="form-inline"
      >
        <div class="form-group col-md-4 user-input actions_content--align">
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
            <div
              v-if="submitted && !$v.amount.required"
              class="invalid-feedback"
              style="border: 0;"
            >
              Amount is required
            </div>
          </div>
        </div>
        <div
          class="form-group col-md-4 actions user-input actions_content--align"
        >
          <label> Creditor </label>
          <v-select
            @change="dispatchCreditor"
            :options="creditorType"
            name="name"
            label="name"
            class="form-control select"
            placeholder="Creditors"
            :id="`creditor`"
            v-model="creditor"
            :class="{
              'is-invalid': submitted && $v.creditor.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.creditor.required"
            class="invalid-feedback"
          >
            Creditor is required
          </div>
        </div>
        <div
          v-if="loan_types_available"
          class="form-group col-md-4 actions user-input actions_content--align"
        >
          <label>Type of Loan </label>
          <v-select
            :options="loanTypes"
            :reduce="name => name.loan_type_id"
            name="name"
            label="name"
            class="form-control select"
            placeholder="Type of Loan"
            :id="`loantype`"
            v-model="loantype"
            :class="{
              'is-invalid': submitted && $v.loantype.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.loantype.required"
            class="invalid-feedback"
          >
            Loan Type is required
          </div>
        </div>
        <!-- <div class=""> -->
        <div class="col-md-4 form-group user-input actions_content--align">
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
        <div
          class="form-group col-md-4 actions user-input actions_content--align"
        >
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
        <div
          class="form-group col-md-4 actions user-input actions_content--align"
          v-if="this.repaymentmode === '1'"
        >
          <label>Repayment Amount</label>
          <input
            type="text"
            v-model="repaymentamount"
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
      loanTypes: [],
      repaymentModes: [
        { code: '1', status: 'Weekly' },
        { code: '3', status: 'One Time' },
      ],
      repaymentamount: '',
      creditor: '',
      creditor_id: '',
      creditorType: [],
      loan_types_available: false,
      hide: true,
      process_request: false,
      loading_loan_types: true,
      response_handler: 'Processing your request ...',
      isActive: true,
      hasError: false,
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    loantype: { required },
    repaymentmode: { required },
    creditor: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  watch: {
    creditor(val, oldval) {
      this.dispatchCreditor(val);
    },
  },
  mounted() {
    this.fetchLoanTypes();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      perform_user_action: 'perform_user_action',
      request_loan_types: 'request_loan_types',
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
      const actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.process_request = true;
      if (this.repaymentmode === '1' && this.repaymentamount === '') {
        this.notificationHandler(false, true, 'Repayment amount is required');
      } else {
        this.notificationHandler(true, false, 'Processing your request ...');
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
              entity_id: this.creditor_id,
              amount: this.amount,
              narrative: this.narrative,
              repayment_amount:
                this.repaymentmode === '3' ? this.amount : this.repaymentamount,
              frequency: this.repaymentmode,
              payment_type: 7,
              mpesa_ref: 'None',
              currency: riderCurrency,
              action_user: this.actionUser,
            },
            request_id: 207,
            action_user: this.actionUser,
          },
        };

        try {
          const data = await this.perform_user_action(payload);
          this.notificationHandler(false, true, data.reason);
          if (data.status) {
            this.notificationHandler(true, false, data.reason);
            this.updateSuccess(true);
          }
        } catch (error) {
          const msg = 'Something went wrong. Try again or contact Tech Support';
          this.notificationHandler(false, true, msg);
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },
    async fetchLoanTypes() {
      const notification = [];
      let actionClass = '';
      const riderID = this.user.rider_id;
      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'sendy/loan_types',
        apiKey: true,
        params: {
          rider_id: riderID,
        },
      };
      try {
        const res = await this.request_loan_types(payload);
        const error = !this.status ? res.error : '';
        if (!res.status) {
          notification.push(res.error);
          actionClass = this.display_order_action_notification(res.status);
          this.updateClass(actionClass);
          this.updateErrors(notification);
        }
        this.loading_loan_types = false;
        return (this.creditorType = res.data);
      } catch (error) {
        const msg = 'Something went wrong. Try again or contact Tech Support';
        this.notificationHandler(false, true, msg);
      }
    },
    dispatchCreditor(val) {
      if (Object.entries(val).length > 0) {
        this.loanTypes = val.loan_types;
        this.creditor_id = val.entity_id;
        this.loan_types_available = true;
      } else {
        this.loan_types_available = false;
      }
    },
    notificationHandler(active, error, message) {
      this.isActive = active;
      this.hasError = error;
      this.response_handler = message;
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
.input-group-area {
  width: 80%;
}
.select {
  margin-left: 0;
  padding: 0;
  width: 95%;
}
.actions_content--align {
  margin-bottom: 17px !important;
  margin-right: 6% !important;
  max-width: 38%;
}
.invalid-feedback {
  font-size: 14px !important;
}
.process-request {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 3px;
  margin-left: 2%;
  color: white;
  width: 90%;
}
.success {
  border-color: #3c8dbc;
  background-color: #3c8dbc !important;
}
.error {
  background-color: #dd4b39 !important;
  border-color: #dd4b39 !important;
}
</style>
