<template>
  <section>
    <form
      @submit.prevent="submitFormData"
      class="form-inline add-reward-section"
      :class="{ 'full-width': isEditForm }"
    >
      <div class="row">
        <div
          class="form-group col-md-4 user-input"
          :class="{ 'full-width col-md-12': isEditForm }"
        >
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

        <div
          class="form-group col-md-4 user-input"
          :class="{ 'full-width col-md-12': isEditForm }"
        >
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

        <div
          class="form-group col-md-4 user-input"
          :class="{ 'full-width col-md-12': isEditForm }"
        >
          <label class="vat"> When to display the cancellation reason </label>
          <v-select
            :options="when_to_display_Reason"
            :reduce="name => name.value"
            multiple
            chips
            label="label"
            name="label"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`value`"
            v-model="whenToDisplayReason"
          >
          </v-select>
          <div
            v-if="submitted && !$v.whenToDisplayReason.required"
            class="rewards_valid"
          >
            When to display cancellation reason is required
          </div>
        </div>

        <div
          class="form-group col-md-4 user-input"
          :class="{ 'full-width col-md-12': isEditForm }"
        >
          <label class="vat"> Platform for cancellation reason</label>
          <v-select
            :options="platform"
            :reduce="name => name.value"
            multiple
            chips
            label="label"
            name="label"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`value`"
            v-model="allowPlatform"
          >
          </v-select>
          <div
            v-if="submitted && !$v.allowPlatform.required"
            class="rewards_valid"
          >
            Platform for cancellation reason is required
          </div>
        </div>

        <div
          class="form-group col-md-4 user-input"
          :class="{ 'full-width col-md-12': isEditForm }"
        >
          <label class="vat">Cancellation reason</label>
          <el-input
            v-model="cancellation_reason"
            class="message-input"
            :class="{
              'reduce-message-input': this.formDataType.operation === 'edit',
            }"
          >
          </el-input>
          <div
            v-if="submitted && !$v.cancellation_reason.required"
            class="rewards_valid"
          >
            Cancellation reason is required
          </div>
        </div>
      </div>

      <div class="form-group  col-md-12 config-submit">
        <button
          class="btn btn-primary action-button"
          :disabled="checkSubmitStatus()"
        >
          {{
            this.formDataType.operation === 'edit' ? 'Save Changes' : 'Submit'
          }}
        </button>
      </div>
    </form>

    <div
      v-if="submit_status"
      class="response-section"
      :class="{ 'remove-margin': isEditForm }"
    >
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

export default {
  name: 'CancellationReasonsForm',
  props: {
    formDataType: {
      type: Object,
      default: () => {},
    },
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
      when_to_display_Reason: [
        {
          label: 'Before an order has been confirmed',
          reason: 'BEFORE_CONFIRMATION',
          value: 1,
        },
        {
          label: 'Before arrival at pickup location',
          reason: 'AFTER_CONFIRMATION',
          value: 2,
        },
        {
          label: 'After arrival at pick up location',
          reason: 'AFTER_ARRIVAL_AT_PICK_UP',
          value: 3,
        },
      ],
      whenToDisplayReason: [],
      submit_state: false,
      platform: [
        { label: 'CC Portal', value: 'CC' },
        { label: 'Customer', value: 'CUSTOMER' },
      ],
      allowPlatform: [],
    };
  },
  validations: {
    cancellation_reason: { required },
    vendorsSelected: { required },
    country: { required },
    whenToDisplayReason: { required },
    allowPlatform: { required },
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
    }),
    isEditForm() {
      return this.formDataType.operation === 'edit';
    },
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
      request_vendor_types: 'request_vendor_types',
      update_cancellation_reason: 'update_cancellation_reason',
      add_cancellation_reason: 'add_cancellation_reason',
    }),
    initiateData() {
      this.formDataType.operation === 'add'
        ? this.clearData()
        : this.populateFormFields();
      this.fetchVendorTypes();
    },
    clearData() {
      this.submitted = false;
      this.submit_status = false;
      this.country = '';
      this.vendorsSelected = [];
      this.cancellation_reason = '';
      this.whenToDisplayReason = [];
      this.allowPlatform = [];
    },
    populateFormFields() {
      const cancellationData = this.formDataType.data;

      this.country = cancellationData.country_code;
      this.cancellation_reason = cancellationData.cancellation_reason;
      this.vendorsSelected = JSON.parse(cancellationData.vendor_type_ids);
      this.whenToDisplayReason = JSON.parse(
        cancellationData.applicable_order_status,
      );
      this.allowPlatform = JSON.parse(cancellationData.allow_platform);
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
    getSelectedCountryCode() {
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
    checkSubmitStatus() {
      return this.submit_state;
    },
    async submitFormData() {
      this.formDataType.operation === 'add'
        ? await this.add_custom_cancellation_reason()
        : await this.edit_custom_cancellation_reason();
    },
    async add_custom_cancellation_reason() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
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
      } else if (!this.whenToDisplayReason.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' When to display cancellation reason is required';
      } else if (!this.allowPlatform.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' Platform for cancellation reason is required';
      }

      const data = {
        country_code: this.country,
        vendor_type_ids: this.vendorsSelected,
        cancel_reason: this.cancellation_reason,
        applicable_order_status: this.whenToDisplayReason,
        admin_id: this.getSession.payload.data.admin_id,
        priority_key: 18,
        allow_platform: this.allowPlatform,
      };
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
            this.$emit('showDialog', false);
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
    async edit_custom_cancellation_reason() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
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
      } else if (!this.whenToDisplayReason.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' When to display cancellation reason is required';
      } else if (!this.allowPlatform.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' Platform for cancellation reason is required';
      }

      const payload = {
        country_code: this.country,
        vendor_type_ids: this.vendorsSelected,
        cancel_reason: this.cancellation_reason,
        applicable_order_status: this.whenToDisplayReason,
        allow_platform: this.allowPlatform,
        admin_id: this.getSession.payload.data.admin_id,
        status: this.formDataType.data.status,
        cancellation_reason_id: this.formDataType.data.id,
        country_filter: this.getCurrentUsersCountryCode(),
      };

      try {
        const result = await this.update_cancellation_reason(payload);
        if (result.status) {
          this.response_status = 'success';
          setTimeout(() => {
            this.submit_state = false;
            this.loading_messages = true;
            this.clearData();
            this.$emit('showDialog', false);
          }, 2000);
        } else {
          this.response_status = 'error';
          this.submit_state = false;
          this.loading_messages = true;
          this.error_msg = result.data;
        }
      } catch (error) {
        this.submit_state = false;
        this.loading_messages = true;
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
  width: 80% !important;
  min-height: 340px;
}
.add-reward-section div {
  margin-left: -4px;
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
}
.vat-inline {
  max-width: 72% !important;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  font-size: small;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
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
  margin-left: 15px;
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
}
.submit-success {
  color: #00ae55;
}
.submit-error {
  color: #ff0000;
}
.remove-margin {
  margin-left: 0;
}
</style>
