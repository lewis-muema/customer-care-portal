<template>
  <div>
    <form id="reallocate-form" @submit.prevent="savingsTransfer" class="form">
      <table class="table user-table">
        <tr>
          <td>
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-icon">
                  <span>{{ currency }}</span>
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
                >
                  Amount is Required
                </div>
              </div>
            </div>
          </td>
          <td>
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
          </td>
        </tr>
        <tr>
          <td>
            <div class="form-group actions">
              <select
                name="transfer"
                id="transfermoney"
                class="form-control proximity point"
              >
                <option :value="1"> Normal Pay</option>
                <!-- <option :value="2"> Credit Mpesa </option> -->
              </select>
            </div>
          </td>
        </tr>
      </table>

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
  name: 'PayRiderComponent',
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
      //   options: ['Savings to Current', 'Current to Savings'],
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
  },
  computed: {
    currency() {
      const currency = this.user.payments.default_currency
        ? this.user.payments.default_currency
        : 'KES';
      return currency;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
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

    // determinePayMethod() {
    //     if(this.permissions)
    // }
    async savingsTransfer() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const riderID = this.user.payments.cop_id;
      const userID = 0;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
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
            currency: this.currency,
          },
          request_id: 205,
          action_user: user,
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
