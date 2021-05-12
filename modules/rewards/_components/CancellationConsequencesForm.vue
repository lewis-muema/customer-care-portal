<template>
  <section>
    <form
      @submit.prevent="add_cancellation_consequences"
      class="form-inline add-reward-section"
    >
      <section class="row full-width">
        <div class="form-group col-md-3 user-input">
          <label class="vat"> Country </label>
          <v-select
            :options="active_countries"
            :reduce="name => name.country_code"
            name="country_name"
            label="country_name"
            placeholder="Select "
            class="form-control select user-billing"
            :id="`name`"
            @input="getSelectedCountryCode"
            v-model="country"
          >
          </v-select>
          <div v-if="submitted && !$v.country.required" class="rewards_valid">
            Country is required
          </div>
        </div>

        <div class="form-group col-md-3 user-input">
          <label class="vat"> Vendor Type </label>
          <v-select
            :options="vendor_type"
            :reduce="name => name.id"
            multiple
            chips
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="vendorsSelected"
          >
          </v-select>
          <div
            v-if="submitted && !$v.vendorsSelected.required"
            class="rewards_valid"
          >
            Vendor type has to be selected
          </div>
        </div>

        <div class="form-group col-md-3 user-input">
          <label class="vat"> Cancellation Reason </label>
          <v-select
            :options="setCancellationReasons"
            :reduce="value => value.cancellation_reason_id"
            label="cancellation_reason"
            name="id"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`value`"
            v-model="cancellation_reason"
          >
          </v-select>
          <div
            v-if="submitted && !$v.cancellation_reason.required"
            class="rewards_valid"
          >
            Cancellation reason is required
          </div>
        </div>
      </section>

      <cancellation-action-input
        :selected-country-currency="country_currency"
        @actionInputValues="setActionValues"
      />

      <div class="form-group  col-md-12 config-submit">
        <button
          class="btn btn-primary action-button"
          :disabled="checkSubmitStatus()"
        >
          Submit
        </button>
      </div>
    </form>

    <div v-if="submit_status" class="response-section">
      <p class="response-text" v-if="response_status === true">
        <i class="fa fa-spinner fa-spin loader invoice-loader--align"></i>
        Processing your request ....
      </p>
      <p class="response-text" v-else-if="response_status === 'success'">
        <i class="fa fa-check-circle invoice-loader--align submit-success"></i>
        Cancellation reason {{ isEditForm ? 'edited !' : 'created !' }}
      </p>
      <p class="response-text" v-else>
        <i
          class="fa fa-exclamation-circle invoice-loader--align submit-error"
        ></i>
        {{ error_msg }}
      </p>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import CancellationActionInput from './CanellationConsequenceActionInputs/CancellationConsequenceActionInput';

export default {
  name: 'CancellationConsequencesForm',
  components: {
    CancellationActionInput,
  },
  data() {
    return {
      submitted: false,
      submit_status: false,
      response_status: true,
      error_msg: '',
      cancellation_reason: '',
      vendor_type: [],
      vendorsSelected: [],
      country: '',
      country_currency: 'KES',
      actonDataValues: [],
      submit_state: false,
    };
  },
  validations: {
    cancellation_reason: { required },
    vendorsSelected: { required },
    country: { required },
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
      setCancellationReasons: 'getActiveCancellationReasons',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
    formDataType(dataValues) {
      if (dataValues.operation === 'edit') this.populateFormFields();
      this.submit_status = false;
    },
  },
  mounted() {
    this.initiateData();
  },
  methods: {
    ...mapActions({
      fetch_set_cancellation_reasons: 'fetch_set_cancellation_reasons',
      request_vendor_types: 'request_vendor_types',
      update_cancellation_reason: 'update_cancellation_reason',
      add_cancellation_reason: 'add_cancellation_reason',
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
    },
    clearData() {
      this.submitted = false;
      this.submit_status = false;
      this.country = '';
      this.vendorsSelected = [];
      this.cancellation_reason = '';
      this.whenToDisplayReason = [];
      this.actonDataValues = [];
    },
    mapOrderReasonsToId(whenToDisplayReasons) {
      if (!whenToDisplayReasons.length) return;
      const IdArray = [];
      whenToDisplayReasons.map(reason => {
        if (typeof reason === 'object' && reason !== null) {
          IdArray.push(reason.value);
        } else {
          IdArray.push(reason);
        }
      });
      return IdArray;
    },
    getCurrentUsersCountryCode() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray);
    },
    getCurrencyOfSelectedCountry(selectedCountry) {
      const countryData = this.active_countries.find(
        country => country.country_code === selectedCountry,
      );
      this.country_currency = countryData.currency_code;
    },
    getSelectedCountryCode() {
      this.fetchSetCancellationReasons([this.country]);
      this.getCurrencyOfSelectedCountry(this.country);
      this.fetchVendorTypes();
    },
    async fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'VENDORS',
        endpoint: 'types',
        apiKey: false,
        params: {
          pickup_country_code: this.country,
          dropoff_country_code: this.country,
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        this.vendor_type = data.vendor_types;
        this.loading_messages = false;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchSetCancellationReasons(countryCodes) {
      const notification = [];
      let actionClass = '';

      try {
        await this.fetch_set_cancellation_reasons(countryCodes);
        this.$emit('showLoader', false);
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    checkSubmitStatus() {
      return this.submit_state;
    },
    setActionValues(actionData) {
      this.actonDataValues = actionData;
    },
    async add_cancellation_consequences() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.submit_status = true;
      this.response_status = true;
      this.submit_state = true;

      if (this.country === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'A country selection is required!';
      } else if (!this.vendorsSelected.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Vendor type has to be selected!';
      } else if (this.cancellation_reason === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'A cancellation reason is needed ';
      } else if (!this.actonDataValues.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' Please fill in all action input values required';
        return;
      }

      const data = {
        country_code: this.country,
        vendor_type_ids: this.vendorsSelected,
        cancel_reason: this.cancellation_reason,
        actions_data: this.actonDataValues,
      };
      console.log('FORM DATA', data);
      const payload = {
        app: 'ADONIS_API',
        endpoint: `cancellation-reasons`,
        apiKey: false,
        params: data,
        country_filter: this.getCurrentUsersCountryCode(),
      };

      try {
        const result = await this.add_cancellation_reason(payload);

        if (result.status === 201 || result.status === 200) {
          this.response_status = 'success';
          setTimeout(() => {
            this.submit_state = false;
            this.loading_messages = true;
            this.clearData();
          }, 2000);
        }
      } catch (error) {
        this.loading_messages = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
  },
};
</script>

<style scoped>
.add-reward-section {
  width: 95% !important;
  min-height: 340px;
}
.form-inline {
  margin-left: 2%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
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
  margin-bottom: -15px !important;
}
.vat-inline {
  max-width: 72% !important;
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
  height: 2%;
}
.v-select .vs__dropdown-menu .option-description {
  margin-top: 5px;
  width: 100%;
  color: #868080;
  font-size: 11px;
  white-space: initial;
}
.v-select
  .vs__dropdown-menu
  .vs__dropdown-option--highlight
  .option-description {
  color: #ffffff;
}
.user-input {
  margin-bottom: 34px;
  width: 34%;
}
.full-width {
  width: 100% !important;
}
.message-input {
  margin-left: -5%;
}
.config-submit {
  padding-left: 2px !important;
}
.response-section {
  width: 95.5%;
  height: 55px;
  background: rgba(255, 255, 255, 0.91);
  border: 2px solid #00ae55;
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 2%;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 28px;
}
.response-text {
  margin-top: 1%;
}
.message-input {
  margin-left: -5%;
}
.reduce-message-input {
  margin-left: -2%;
}
.invoice-loader--align {
  margin-left: 2%;
  margin-right: 1%;
}
.rewards_valid {
  font-size: 14px !important;
  color: #dc3545;
  margin-left: -4% !important;
}
.submit-success {
  color: #00ae55;
}
.submit-error {
  color: #ff0000;
}
</style>

<style>
.vs__dropdown-toggle {
  background-color: white;
}
</style>
