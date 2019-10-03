<template>
  <div>
    <div v-if="paymentMethods === null">
      <p>
        Fetching user payment methods ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <form
      id="reallocate-form"
      @submit.prevent="submitPayment"
      v-if="paymentMethods !== null"
      class="form"
    >
      <table class="table payment-table">
        <tr>
          <td width="50%">
            <div class="form-group actions">
              <v-select
                :options="paymentMethods"
                :reduce="name => name.payment_method_id"
                name="name"
                label="name"
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
          </td>
          <td>
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
        </tr>
        <tr>
          <td>
            <div class="form-group">
              <input
                type="text"
                v-model="refNo"
                :id="refNo"
                name="refNo"
                placeholder="Ref No"
                class="form-control"
                :class="{
                  'is-invalid': submitted && $v.refNo.$error,
                }"
              />
              <div
                v-if="submitted && !$v.refNo.required"
                class="invalid-feedback"
              >
                Reference No is required
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
        <tr>
          <td>
            <div class="form-group">
              <input
                type="text"
                v-model="refName"
                :id="refName"
                name="refName"
                placeholder="Name"
                class="form-control"
                :class="{
                  'is-invalid': submitted && $v.refName.$error,
                }"
              />
              <div
                v-if="submitted && !$v.refName.required"
                class="invalid-feedback"
              >
                Name is required
              </div>
            </div>
          </td>
          <td>
            <div class="form-group">
              <input
                type="text"
                v-model="phone"
                :id="phone"
                name="phone"
                placeholder="Phone"
                class="form-control"
                :class="{
                  'is-invalid': submitted && $v.phone.$error,
                }"
              />
              <div
                v-if="submitted && !$v.phone.required"
                class="invalid-feedback"
              >
                Phone number is required
              </div>
            </div>
          </td>
        </tr>
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
  name: 'ThePaymentComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paymentMethods: null,
      paymentMethod: '',
      amount: '',
      refNo: '',
      refName: '',
      narrative: '',
      phone: '',
      submitted: false,
    };
  },
  validations: {
    paymentMethod: { required },
    amount: { required },
    refNo: { required },
    phone: { required },
    narrative: { required },
    refName: { required },
  },
  computed: {
    currency() {
      const currency = this.user.user_details.default_currency
        ? this.user.user_details.default_currency
        : 'KES';
      return currency;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },

  mounted() {
    const countryCode = 'KE';
    this.fetchPaymentOptions(countryCode);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      request_payment_methods: 'request_payment_methods',
      perform_user_action: 'perform_user_action',
    }),
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
      try {
        const data = await this.request_payment_methods(payload);
        const error = !this.status ? data.error : '';
        if (!data.status) {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
          this.updateClass(actionClass);
          this.updateErrors(notification);
        }

        return (this.paymentMethods = data.payment_methods);
      } catch (error) {
        this.status = false;
      }
    },
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
      const actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const reverse = false;
      const copID = this.user.user_details.cop_id;
      const userID = 0;

      const payload = {
        channel: 'customer_support_peer_biz',
        data_set: 'cc_actions',
        action_id: 7,
        action_data: {
          reverse,
          amount: this.amount,
          ref_no: this.refNo,
          pay_method: this.paymentMethod,
          cop_id: copID,
          user_id: userID,
          reason: this.narrative,
          currency: this.currency,
        },
        request_id: `11211`,
        action_user: this.actionUser,
      };
    },
  },
};
</script>
<style scoped>
.vs__dropdown-toggle {
  padding: 0;
  color: #ccc;
  margin-top: -7px;
  padding-bottom: 8px;
  margin-left: -14px;
  margin-right: -15px;
  border: none;
}
.actions .v-select .vs__dropdown-menu {
  margin-right: 16px;
  width: 91%;
  background: red;
}
.actions .v-select {
  margin-left: 0;
  border: none;
  padding: 0;
}

.payment-table tr:hover {
  background: none !important;
}
.payment-table td {
  border: none;
}
.input-group-area {
  width: 83%;
}
.input-group-icon {
  padding: 9px 12px;
}
.table td {
  padding: 0 5px;
}
.input-group .invalid-feedback {
  border: none;
}
</style>
