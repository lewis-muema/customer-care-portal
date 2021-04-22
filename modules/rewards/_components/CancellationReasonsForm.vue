<template>
  <section>
    <form
      id="reallocate-form"
      @submit.prevent="add_custom_cancellation_reason"
      class="form-inline add-reward-section"
      :class="{ 'full-width': this.formDataType.operation === 'edit' }"
    >
      <div
        class="form-group col-md-12 user-input"
        :class="{ 'full-width': this.formDataType.operation === 'edit' }"
      >
        <label class="vat"> Country </label>
        <v-select
          :options="country_code"
          :reduce="name => name.code"
          name="name"
          label="name"
          placeholder="Select "
          class="form-control select user-billing"
          :id="`name`"
          v-model="country"
        >
        </v-select>
        <div v-if="submitted && !$v.country.required" class="rewards_valid">
          Country is required
        </div>
      </div>

      <div
        class="form-group col-md-12 user-input"
        :class="{ 'full-width': this.formDataType.operation === 'edit' }"
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
          v-model="vendorType"
        >
        </v-select>
        <div v-if="submitted && !$v.vendorType.required" class="rewards_valid">
          Vendor type has to be selected
        </div>
      </div>

      <div
        class="form-group col-md-12 user-input"
        :class="{ 'full-width': this.formDataType.operation === 'edit' }"
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
        class="form-group col-md-12 user-input"
        :class="{ 'full-width': this.formDataType.operation === 'edit' }"
      >
        <label class="vat">Cancellation reason</label>
        <el-input
          v-model="cancellation_reason"
          :id="`message`"
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

    <div v-if="submit_status" class="response-section">
      <p class="response-text" v-if="response_status === true">
        <i class="fa fa-spinner fa-spin loader invoice-loader--align"></i>
        Processing your request ....
      </p>
      <p class="response-text" v-else-if="response_status === 'success'">
        <i class="fa fa-check-circle invoice-loader--align submit-success"></i>
        Cancellation reason created !
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
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      vendor_type: [],
      vendorType: [],
      country: '',
      when_to_display_Reason: [
        {
          label: 'Before an order has been confirmed',
          reason: 'BEFORE_CONFIRMATION',
          value: 1,
        },
        {
          label: 'After order confirmation & pick up',
          reason: 'AFTER_CONFIRMATION',
          value: 2,
        },
        {
          label: 'After arrival at pick up location',
          reason: 'AFTER_ARRIVAL_AT_PICK_UP',
          value: 3,
        },
        {
          label: 'Display at all times',
          reason: 'ALL',
          value: 4,
        },
      ],
      whenToDisplayReason: [],
      submit_state: false,
    };
  },
  validations: {
    cancellation_reason: { required },
    vendorType: { required },
    country: { required },
    whenToDisplayReason: { required },
  },
  computed: {
    ...mapGetters(['getSession']),
  },
  watch: {
    getSession(session) {
      return session;
    },
    formDataType(dataValues) {
      if (dataValues.operation === 'edit') this.populateFormFields();
    },
  },
  mounted() {
    this.initiateData();
  },
  methods: {
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      add_cancellation_reason: 'add_cancellation_reason',
    }),
    initiateData() {
      this.formDataType.operation === 'add'
        ? this.clearData()
        : this.populateFormFields();

      this.fetchVendorTypes();
    },
    clearData() {
      this.submit_status = false;
      this.country = '';
      this.vendor_type = [];
      this.vendorType = [];
      this.cancellation_reason = '';
      this.whenToDisplayReason = '';
    },
    fetchCountry(code) {
      if (!code) return '';
      const data = this.country_code.find(location => location.code === code);
      return data.name;
    },
    populateFormFields() {
      const cancellationData = this.formDataType.data;

      this.country = this.fetchCountry(cancellationData.country_code);
      this.cancellation_reason = cancellationData.cancellation_reason;
      this.vendorType = cancellationData.vendor_type_names;
      const reasonsValuesArray = this.convertStringToNumArray(
        cancellationData.applicable_order_status,
      );
      this.whenToDisplayReason = this.mapCancellationReasons(
        reasonsValuesArray,
      );
    },
    convertStringToNumArray(arrayAsString) {
      const finalArray = [];
      const initArr = arrayAsString.split(',');

      for (let i = 0; i < initArr.length; i++) {
        if (i === 0) {
          const firstValue = initArr[0].split('')[1];
          finalArray.push(parseInt(firstValue));
        } else if (i === initArr.length - 1) {
          const lastValue = initArr[i].split('')[0];
          finalArray.push(parseInt(lastValue));
        } else {
          finalArray.push(parseInt(initArr[i]));
        }
      }
      return finalArray;
    },
    mapCancellationReasons(reasonsValuesArray) {
      const resultsArray = [];
      reasonsValuesArray.map(value => {
        const results = this.when_to_display_Reason.filter(reason => {
          return reason.value === value;
        });
        resultsArray.push(...results);
      });
      return resultsArray;
    },
    async fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'VENDORS',
        endpoint: 'types',
        apiKey: false,
        params: {
          pickup_country_code: 'KE',
          dropoff_country_code: 'KE',
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
      } else if (!this.vendorType.length) {
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
      }

      const data = {
        country_code: this.country,
        vendor_type_ids: this.vendorType,
        cancel_reason: this.cancellation_reason,
        applicable_order_status: this.whenToDisplayReason,
        admin_id: this.getSession.payload.data.admin_id,
        priority_key: 18,
        allow_platform: ['CC', 'CUSTOMER'],
      };
      const payload = {
        app: 'ADONIS_API',
        endpoint: `cancellation-reasons`,
        apiKey: false,
        params: data,
      };

      try {
        const result = await this.add_cancellation_reason(payload);

        if (result.status) {
          setTimeout(() => {
            this.submit_state = false;
            this.loading_messages = true;
            this.initiateData();
            this.$emit('showDialog', false);
          }, 2000);
        } else {
          this.loading_messages = true;
          this.initiateData();
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
  width: 80% !important;
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
  width: 30%;
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
.submit-success {
  color: #00ae55;
}
.submit-error {
  color: #ff0000;
}
</style>
