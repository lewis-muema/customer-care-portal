<template>
  <div class="row">
    <div v-if="loading_tax_rates" class="tax-loader">
      <p>
        Fetching VAT Tax Rates ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else>
      <form
        id="reallocate-form"
        @submit.prevent="update_reverse_invoice"
        class="form-inline vat-inline"
      >
        <div class="form-group col-md-6 user-input">
          <label class="vat"> Invoice Number </label>

          <input
            type="text"
            v-model="invoice_number"
            name="invoice_number"
            :id="`invoice_number`"
            placeholder="Invoice Number"
            class="form-control config-input"
            :class="{
              'is-invalid': submitted && $v.invoice_number.$error,
            }"
          />
          <div
            v-if="submitted && !$v.invoice_number.required"
            class="invalid-feedback"
          >
            Invoice Number is required
          </div>
        </div>

        <div class="form-group col-md-6 user-input">
          <label class="config"> Amount</label>

          <input
            type="number"
            v-model="amount"
            name="amount"
            placeholder="Amount (Not Inclusive of VAT)"
            class="form-control config-input"
            :id="`amount`"
            :class="{
              'is-invalid': submitted && $v.amount.$error,
            }"
          />
          <div v-if="submitted && !$v.amount.required" class="invalid-feedback">
            Amount is required
          </div>
        </div>

        <div class="form-group col-md-6 user-input">
          <label class="vat"> Tax</label>
          <v-select
            :options="rate"
            name="description"
            label="description"
            class="form-control select user-billing"
            placeholder="Select VAT Tax"
            :id="`vat_rate`"
            v-model="vat_rate"
            :class="{
              'is-invalid': submitted && $v.vat_rate.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.vat_rate.required"
            class="invalid-feedback"
          >
            VAT Tax is required
          </div>
        </div>

        <div class="form-group col-md-6 user-input">
          <label class="vat"> Narration </label>

          <input
            type="text"
            v-model="narration"
            name="narration"
            :id="`narration`"
            placeholder="Narration"
            class="form-control config-input"
            :class="{
              'is-invalid': submitted && $v.narration.$error,
            }"
          />
          <div
            v-if="submitted && !$v.narration.required"
            class="invalid-feedback"
          >
            Narration is required
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit">
          <button class="btn btn-primary action-button" :disabled="loading">
            Update
            <span v-if="loading">
              <i class="fa fa-spinner fa-spin loader"></i
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheReverseInvoiceComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading_tax_rates: true,
      submitted: false,
      narration: '',
      amount: '',
      invoice_number: '',
      rate: [],
      vat_rate: '',
      loading: false,
    };
  },

  validations: {
    narration: { required },
    amount: { required },
    invoice_number: { required },
    vat_rate: { required },
  },
  computed: {},
  mounted() {
    this.fetchTaxRates();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      update_vat_config: 'update_vat_config',
      request_tax_rates: 'request_tax_rates',
      perform_user_action: 'perform_user_action',
    }),

    async fetchTaxRates() {
      const notification = [];
      let actionClass = '';
      try {
        const data = await this.request_tax_rates();
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          this.rate = data.vat_rates;
        }
        this.loading_tax_rates = false;
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    // eslint-disable-next-line require-await
    async update_reverse_invoice() {
      const notification = [];
      let actionClass = '';
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const rate = this.vat_rate.rate * 100;
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 24,
          action_data: {
            invoice_no: this.invoice_number,
            amount: this.amount,
            description: this.narration,
            individual_id: this.user.user_details.cop_id,
            individual_type: 0,
            invoice_type: 1,
            vat_rate: parseInt(rate, 10),
          },
          request_id: '1622',
          action_user: this.actionUser,
        },
      };
      this.loading = true;
      try {
        const data = await this.perform_user_action(payload);
        actionClass = this.display_order_action_notification(data.status);
        this.loading = false;
        if (data.status) {
          this.updateSuccess(true);
        } else {
          let msg = '';
          if (Object.prototype.hasOwnProperty.call(data, 'message')) {
            msg = data.message;
          } else {
            msg = 'Something went wrong. Try again or contact Tech Support';
          }
          notification.push(msg);
          actionClass = 'danger';
        }
      } catch (error) {
        this.loading = false;
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
.vat {
  width: 100%;
  margin-left: -15px;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
.user-input {
  margin-bottom: 15px;
}
.form-inline {
  margin-left: 2%;
}
.vat-inline {
  width: 83% !important;
}
.config-input {
  margin-left: -15px;
}
.config-div {
  padding-left: 0;
}
.config {
  width: 100%;
  margin-left: -15px;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
.tax-loader {
  margin-left: 1%;
}
</style>
