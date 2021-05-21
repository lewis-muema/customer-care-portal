<template>
  <section>
    <div
      v-for="(action, index) in consequenceData.actions"
      :key="`consequenceAction-${index}`"
    >
      <div class="action-type-name">
        {{ mapActionName(action.action_type) }}
      </div>
      <div class="row replica">
        <!--    charge penalty fee message-->
        <div
          v-if="action.action_type === 3 || action.action_type === 2"
          class="form-group col-md-4 user-input"
        >
          <label class="vat"> How much is the cancellation fee? </label>
          <el-input
            placeholder="Please input amount"
            type="number"
            min="1"
            v-model="action.cancellation_fee"
          >
            <template slot="prepend">{{ country_currency }}</template>
          </el-input>
          <div v-if="validateInputs(action.cancellation_fee)" class="error">
            Penalty fee value required!
          </div>
        </div>

        <!--      order status field-->
        <div class="form-group col-md-4 user-input">
          <label class="vat">
            Status of the order
          </label>
          <v-select
            id="consequence-edit"
            :options="order_status_data"
            :reduce="name => name.value"
            chips
            multiple
            label="label"
            name="label"
            placeholder="Select"
            class="form-control select user-billing"
            v-model="action.applicable_order_status"
          >
          </v-select>
          <div
            v-if="validateInputs(action.applicable_order_status)"
            class="error"
          >
            Order status value required!
          </div>
        </div>

        <!--    time duration field (before showing message/charging fee)-->
        <div
          v-if="
            action.action_type === 2 ||
              action.action_type === 3 ||
              action.action_type === 5
          "
          class="form-group col-md-4 user-input"
          id="time-duration-select"
        >
          <label class="vat">
            {{
              action.action_type === 5
                ? 'When to show the message (minutes)'
                : 'When to apply the cancellation fee (minutes)'
            }}
          </label>
          <el-input
            type="number"
            min="0"
            :disabled="action.comparator === 0"
            v-model="action.duration"
          >
            <el-select
              v-model="action.comparator"
              :reduce="name => name.value"
              slot="prepend"
              placeholder="Select"
            >
              <el-option
                v-for="param in comparison_parameters"
                :key="param.value"
                :label="param.name"
                :value="param.value"
              >
              </el-option>
            </el-select>
            <template slot="append">Mins</template>
          </el-input>
          <div v-if="validateInputs(action.comparator)" class="error">
            Time when to apply value required!
          </div>
          <div v-if="validateInputs(action.duration)" class="error">
            Minutes time value required!
          </div>
        </div>

        <!--    message to show-->
        <div
          v-if="
            action.action_type === 1 ||
              action.action_type === 4 ||
              action.action_type === 5
          "
          class="form-group col-md-4 user-input"
        >
          <label class="vat"> Message to display </label>
          <el-input
            placeholder="Please input"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="action.message"
          >
          </el-input>
          <div v-if="validateInputs(action.message)" class="error">
            Message is required!
          </div>
        </div>
      </div>
    </div>

    <el-button type="primary" @click="editActions">
      Save Changes
    </el-button>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CancellationConsequencesEdit',
  props: {
    consequenceData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      order_status_data: [
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
      comparison_parameters: [
        { name: 'Less than', value: 1 },
        { name: 'More than', value: 2 },
        { name: 'Immediately', value: 0 },
      ],
      country_currency: null,
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
      actions_data: 'getCancellationActions',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
    consequenceData(newData) {
      console.log('>>>', newData);
      this.getCurrencyOfSelectedCountry(newData.country_code);
    },
  },
  created() {
    console.log('>>>', this.consequenceData);
    this.getCurrencyOfSelectedCountry(this.consequenceData.country_code);
  },
  methods: {
    validateInputs(inputValue) {
      if (Array.isArray(inputValue)) return !inputValue.length;
      return inputValue === null || inputValue === '';
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
    mapActionName(actionType) {
      const { display_name } = this.actions_data.find(
        action => action.id === actionType,
      );
      return display_name;
    },
    mapComparator(comparator) {
      if (comparator === undefined) return;
      const { name } = this.comparison_parameters.find(
        parameter => parameter.value === comparator,
      );
      return name;
    },
    editActions() {
      console.log('yeeey');
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
.replica {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
}
.v-select .form-control {
  height: auto;
  padding: 0;
}
.action-type-name {
  font-size: 16px;
  font-weight: 600;
  color: black;
  left: -10px;
  position: relative;
  margin-bottom: 5px;
  margin-left: 10px;
}
button {
  margin-top: 25px;
}
</style>
<style>
#consequence-edit .vs__dropdown-toggle {
  top: 0;
  left: 0;
}
</style>
