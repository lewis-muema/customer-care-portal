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
      <table class="table user-table">
        <tr>
          <td width="50%" v-if="!isChargeEntity">
            <div class="form-group actions">
              <label>Payment Method</label>
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
              <label>Amount</label>

              <div class="input-group">
                <div class="input-group-icon">
                  <span> {{ currency }}</span>
                </div>
                <div class="input-group-area amount-input">
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
          <td class="biz-units-outer">
            <div class="form-group actions">
              <label>Business Units</label>
              <v-select
                :options="businessUnits"
                :reduce="name => name.value"
                name="name"
                label="name"
                placeholder="Select Business Unit"
                class="form-control select"
                :id="`business-units`"
                v-model="businessUnit"
                :class="{
                  'is-invalid': submitted && $v.businessUnit.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.businessUnit.required"
                class="invalid-feedback"
              >
                Business Unit is required
              </div>
            </div>
          </td>

          <td>
            <div class="form-group">
              <label>Other Notes</label>
              <input
                type="text"
                v-model="narrative"
                :id="narrative"
                name="narrative"
                placeholder="Notes"
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
          </td>
        </tr>
        <tr v-if="!isChargeEntity">
          <td v-if="refNoMethods.includes(paymentMethod)">
            <div class="form-group">
              <label>Payment ID</label>
              <input
                type="text"
                v-model="refNo"
                :id="refNo"
                name="refNo"
                placeholder="Payment ID"
                :class="`form-control ${hide}`"
              />
              <div :class="`invalid-feedback`">
                Payment ID is required
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div class="form-group col-md-3 bill-check">
        <input
          value="1"
          type="checkbox"
          class=""
          @click="check($event)"
          v-model="isChargeEntity"
          checked
        />
        <label for="" class="charge_vat--label"> Bill Sendy Entity </label>
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
      hide: '',
      narrative: '',
      submitted: false,
      refNoMethods: [1, 4],
      businessUnits: [
        { value: 1, name: 'Merchant Business Units - MBU' },
        { value: 2, name: 'Enterprise Business Units - EBU' },
        { value: 3, name: 'Freight Business Units - FBU' },
      ],
      businessUnit: '',
      isChargeEntity: false,
    };
  },
  validations: {
    paymentMethod: { required },
    amount: { required },
    narrative: { required },
    businessUnit: { required },
  },
  computed: {
    currency() {
      const currency = this.user.user_details.default_currency;
      return currency;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },

  mounted() {
    const countryCode = this.user.user_details.country_code;
    this.fetchPaymentOptions(countryCode);
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
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const reverse = false;
      const copID = this.user.user_details.cop_id;
      const userID = 0;
      if (this.refNoMethods.includes(this.paymentMethod) && this.refNo === '') {
        this.hide = 'is-invalid';
        return;
      }
      const action_id = this.isChargeEntity ? 27 : 7;
      const vat_exempt = this.user.cop_details.vat_exempt;

      let action_payload = {
        reverse,
        amount: this.amount,
        ref_no: this.refNoMethods.includes(this.paymentMethod)
          ? this.refNo
          : '',
        pay_method: this.paymentMethod,
        cop_id: copID,
        user_id: userID,
        reason: this.narrative,
        currency: this.currency,
        business_unit: parseInt(this.businessUnit, 10),
        vat_exempt: vat_exempt ? 1 : 0,
      };

      if (this.isChargeEntity) {
        action_payload = {
          amount: this.amount,
          cop_id: copID,
          user_id: userID,
          narrative: this.narrative,
          currency: this.currency,
          entity_id: 1,
          business_unit: parseInt(this.businessUnit, 10),
          vat_exempt: vat_exempt ? 1 : 0,
        };
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: this.paymentMethod === 9 ? 28 : action_id,
          action_data: action_payload,
          request_id: `11211`,
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
    check(e) {
      this.checkHandler(e.target.checked);
      if (e.target.checked) {
        return (this.checked = e.target.value);
      }
    },
    checkHandler(state) {
      this.paymentMethod = '';
      if (state) {
        this.paymentMethod = 9;
      }
    },
  },
};
</script>
<style scoped>
.biz-units-outer {
  width: 50%;
}
.amount-input {
  width: 83% !important;
}
</style>
