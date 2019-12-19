<template>
  <div class="row">
    <div v-if="loading_tax_rates" style="margin-left: 1%;">
      <p>
        Fetching VAT Tax Rates ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else>
      <form
        id="reallocate-form"
        @submit.prevent="update_peer_invoice"
        class="form-inline custom-inline col-md-12"
      >
        <div class="form-group col-md-4 user-input">
          <label class="config"> Invoice for the period </label>

          <date-picker
            v-model="invoice_period"
            mode="range"
            class="date-input"
            :input-props="{
              placeholder: 'Select Date range',
              readonly: true,
            }"
            :class="{
              'is-invalid': submitted && $v.invoice_period.$error,
            }"
          />
          <div
            class="invoice_valid"
            v-if="submitted && !$v.invoice_period.required"
          >
            Invoice for the period is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="config"> Invoice Due date</label>

          <date-picker
            v-model="due_date"
            class="date-input"
            :input-props="{
              placeholder: 'Please enter Date',
              readonly: true,
            }"
          />
          <div class="invoice_valid" v-if="submitted && !$v.due_date.required">
            Invoice due date is required
          </div>
        </div>

        <div class="form-group col-md-4 user-input">
          <label class="config"> Narration</label>

          <input
            type="text"
            v-model="narration"
            name="narration"
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

        <div class="form-group col-md-4  user-input">
          <label class="config">Amount</label>
          <div class="input-group config-input" style="width: 103% !important;">
            <div class="input-group-icon">
              <span> {{ currency }}</span>
            </div>
            <div class="input-group-area">
              <input
                type="number"
                v-model="amount"
                name="amount"
                placeholder="Amount"
                class="form-control"
                style="font-size: 16px !important ;"
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

        <div class="form-group col-md-4 user-input">
          <label class="config"> Tax </label>

          <v-select
            :options="tax_data"
            name="description"
            label="description"
            class="form-control select user-billing"
            :id="`name`"
            v-model="tax"
            :class="{
              'is-invalid': submitted && $v.tax.$error,
            }"
            style="font-size: 15px !important ;"
          >
          </v-select>
          <div v-if="submitted && !$v.tax.required" class="invalid-feedback">
            Tax is required
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit">
          <button class="btn btn-primary action-button">
            Generate
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { required } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import moment from 'moment';

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

export default {
  name: 'TheCustomInvoiceComponent',
  components: {
    DatePicker,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading_tax_rates: true,
      submitted: false,
      due_date: '',
      invoice_period: '',
      narration: '',
      amount: '',
      tax_data: [],
      tax: '',
    };
  },

  validations: {
    due_date: { required },
    invoice_period: { required },
    narration: { required },
    amount: { required },
    tax: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
  },
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
      request_tax_rates: 'request_tax_rates',
      perform_user_action: 'perform_user_action',
    }),
    // eslint-disable-next-line require-await
    async update_peer_invoice() {
      const notification = [];
      let actionClass = '';
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const rate = this.tax.rate * 100;
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 23,
          action_data: {
            amount: this.amount,
            description: this.narration,
            due_date: moment(this.due_date).format('YYYY-MM-DD'),
            end_date: moment(this.invoice_period.end).format('YYYY-MM-DD'),
            individual_id: this.user.user_details.user_id,
            individual_type: 1,
            invoice_type: 0,
            start_date: moment(this.invoice_period.start).format('YYYY-MM-DD'),
            vat_rate: parseInt(rate, 10),
          },
          request_id: '1622',
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

    async fetchTaxRates() {
      const notification = [];
      let actionClass = '';
      try {
        const data = await this.request_tax_rates();
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          this.tax_data = data.vat_rates;
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
.config {
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
.custom-inline {
  max-width: 80%;
}
.config-input {
  margin-left: -15px;
  max-width: 103%;
  font-size: 16px !important ;
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
.date-input {
  margin-left: -15px;
  width: 100% !important;
}
.input-group-area {
  width: 80%;
  border-radius: 0 0.25rem 0.25rem 0;
}
.invoice_valid {
  font-size: 14px !important;
  color: #dc3545;
}
</style>
