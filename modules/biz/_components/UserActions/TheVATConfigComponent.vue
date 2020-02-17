<template>
  <div class="row">
    <form
      id="reallocate-form"
      @submit.prevent="update_biz_configs"
      class="form-inline vat-inline"
    >
      <div class="form-group col-md-6 user-input">
        <label class="vat"> Business VAT Compliance </label>
        <v-select
          :options="vat"
          :reduce="name => name.code"
          name="name"
          label="name"
          class="form-control select user-billing"
          :id="`vat_compliance`"
          :disabled="checkPaymentMethod('2')"
          v-model="vatCompliance"
          :class="{
            'is-invalid': submitted && $v.vatCompliance.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.vatCompliance.required"
          class="invalid-feedback"
        >
          VAT Compliance is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input" v-if="this.vatCompliance">
        <label class="config">Invoicing Cycle</label>

        <v-select
          :options="invoice"
          :reduce="name => name.code"
          name="name"
          label="name"
          placeholder="Invoicing Cycle"
          class="form-control select user-billing"
          :id="`invoicing_cycle`"
          v-model="invoicing_cycle"
          :class="{
            'is-invalid': submitted && $v.invoicing_cycle.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.invoicing_cycle.required"
          class="invalid-feedback"
        >
          Invoicing cycle is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input" v-if="this.vatCompliance">
        <label class="vat"> Tax Authority Pin </label>

        <input
          type="text"
          v-model="tax_authority_pin"
          name="tax_authority_pin"
          :id="`tax_authority_pin`"
          placeholder="PIN"
          class="form-control config-input"
          :class="{
            'is-invalid': submitted && $v.tax_authority_pin.$error,
          }"
        />
        <div
          v-if="submitted && !$v.tax_authority_pin.required"
          class="invalid-feedback"
        >
          Tax Authority Pin is required
        </div>
      </div>
      <div class="form-group  col-md-12 config-submit">
        <button class="btn btn-primary action-button">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheVATConfigComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      vatCompliance: false,
      submitted: false,
      vat: [
        { code: true, name: 'Activate' },
        { code: false, name: 'Deactivate' },
      ],
      invoice: [
        { code: 0, name: 'Per Order' },
        { code: 1, name: 'Daily' },
        { code: 7, name: 'Weekly' },
        { code: 30, name: 'Monthly' },
        { code: 100, name: 'Custom' },
      ],
      invoicing_cycle: '',
      tax_authority_pin: '',
    };
  },

  validations: {
    vatCompliance: { required },
    invoicing_cycle: { required },
    tax_authority_pin: { required },
  },
  computed: {},
  mounted() {
    this.UpdateBizDefaultConfig();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      update_vat_config: 'update_vat_config',
    }),
    checkPaymentMethod(value) {
      let disabled = false;
      const user_data = this.user.user_details;
      if (user_data.payment_option === value) {
        disabled = true;
      }
      return disabled;
    },
    UpdateBizDefaultConfig() {
      const user_data = this.user.user_details;
      this.vatCompliance = user_data.vat_compliant;
      this.tax_authority_pin = user_data.tax_authority_pin;
      this.invoicing_cycle = user_data.invoice_circle;
    },
    // eslint-disable-next-line require-await
    async update_biz_configs() {
      const notification = [];
      let actionClass = '';
      if (this.vatCompliance || this.vatCompliance === null) {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
      }
      const payload = {
        app: 'ADONIS_API',
        endpoint: '/vat-details',
        apiKey: false,
        params: {
          user_id: 0,
          cop_id: this.user.user_details.cop_id,
          user_type: 'cop',
          tax_authority_pin: this.tax_authority_pin,
          invoice_cycle: this.invoicing_cycle,
          vat_compliant: this.vatCompliance,
        },
      };

      try {
        const data = await this.update_vat_config(payload);
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
</style>
