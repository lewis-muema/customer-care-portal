<template>
  <div class="row">
    <form
      id="reallocate-form"
      @submit.prevent="savingsTransfer"
      class="form-inline"
    >
      <div class="form-group col-md-6 user-input">
        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ user.default_currency }}</span>
          </div>
          <div class="input-group-area">
            <input
              type="number"
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
      <div class="col-md-6">
        <div class="form-group">
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
      <div class="form-group col-md-6 actions option">
        <v-select
          :options="payType"
          :reduce="status => status.code"
          name="status"
          label="status"
          class="form-control select"
          placeholder="Transfer Option"
          :id="`status`"
          v-model="status"
          :class="{
            'is-invalid': submitted && $v.status.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.status.required" class="invalid-feedback">
          Transfer Option is required
        </div>
        <div class="col-md-12">
          <button class="btn btn-primary action-button transfer-button">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TransferComponent',
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
      status: '',
      payType: [
        { code: '3', status: 'Savings to Current' },
        { code: '4', status: 'Current to Savings' },
      ],
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    status: { required },
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
      request_payment_methods: 'request_payment_methods',
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
      const userID = 0;

      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'sendy/rt_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 1,
          action_data: {
            amount: this.amount,
            narrative: this.narrative,
            rider_id: riderID,
            pay_customer: false,
            account_no: '',
            pay_out: true,
            pay_frommpesa: false,
            loan_type: 1,
            payment_type: this.status,
            mpesa_ref: 'None',
            currency: riderCurrency,
            transaction_id: 1,
            billing_type: 1,
          },
          request_id: this.status === 3 ? 203 : 204,
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
.transfer-button {
  margin-top: 23px;
  margin-left: -14px;
}
.input-group-area {
  width: 85%;
}
.input-group-icon {
  padding: 8px 12px;
}
.select {
  margin-left: 0;
  padding: 0;
  width: 95%;
}
</style>
