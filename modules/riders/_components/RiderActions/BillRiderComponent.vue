<template>
  <div>
    <form id="reallocate-form" @submit.prevent="submitPayment" class="form">
      <table class="table user-table">
        <tr>
          <td width="50%">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-icon">
                  <span> {{ currency }}</span>
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
                  Amount is required
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
                Narrative is required
              </div>
            </div>
          </td>
        </tr>
        <!-- <tr>
          <td>
            <div class="form-group">
              <input
                type="checkbox"
                v-model="checked"
                :id="client"
                class="form-control"
              />
              <label for="checkbox">Credit Client</label>
            </div>
          </td>
          <td>
            <div class="form-group">
              <input
                type="text"
                v-model="client"
                :id="client"
                name="client"
                placeholder="SENDY669"
                class="form-control"
                :class="{
                  'is-invalid': submitted && $v.client.$error,
                }"
              />
              <div
                v-if="submitted && !$v.client.required"
                class="invalid-feedback"
              >
                Client ID is Required
              </div>
            </div>
          </td> -->
        <!-- </tr> -->
      </table>

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
    // session,
  },
  data() {
    return {
      amount: '',
      narrative: '',
      submitted: false,
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
  },

  computed: {
    currency() {
      const currency = this.user.default_currency
        ? this.user.default_currency
        : 'KES';
      return currency;
    },
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
    async submitPayment() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 1,
          action_data: {
            amount: this.amount,
            narrative: this.narrative,
            rider_id: this.user.rider_id,
            pay_customer: '',
            account_no: '',
            pay_out: true,
            pay_frommpesa: false,
            loan_type: 1,
            payment_type: 2,
            mpesa_ref: 'None',
            currency: this.currency,
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
