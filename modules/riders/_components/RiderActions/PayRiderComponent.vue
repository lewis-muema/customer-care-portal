<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="submitPayment"
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

      <div class="form-group col-md-4">
        <label>Narrative</label>
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
          Payment Narrative is required
        </div>
      </div>

      <div class="form-group actions col-md-4">
        <label>Payment Method</label>
        <v-select
          :options="payMethods"
          :reduce="type => type.code"
          name="type"
          label="type"
          placeholder="Payment Method"
          class="form-control select"
          :id="`reallocate_reason`"
          v-model="paymentMethod"
          :class="{
            'is-invalid': submitted && $v.paymentMethod.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.paymentMethod.required"
          class="invalid-feedback"
        >
          Payment Method is required
        </div>
      </div>

      <button class="btn btn-primary action-button">
        Submit
      </button>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'ThePaymentComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paymentMethod: '',
      amount: '',
      narrative: '',
      submitted: false,
      payMethods: [{ code: 1, type: 'Normal Pay' }],
    };
  },
  validations: {
    paymentMethod: { required },
    amount: { required },
    narrative: { required },
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
            payment_type: 1,
            mpesa_ref: this.narrative,
            currency: riderCurrency,
            action_user: this.actionUser,
          },
          request_id: 201,
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
.input-group-area {
  width: 76%;
}
.form-inline .form-control {
  width: 100%;
}
.action-button {
  margin: 13px;
}
.select {
  margin-left: 0;
  padding: 0;
  width: 95%;
}
</style>
