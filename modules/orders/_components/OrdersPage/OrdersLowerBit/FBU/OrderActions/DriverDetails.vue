<template>
  <div class="assign-details-tab">
    <p class="assign-header no-margin">Driver Details</p>
    <input
      v-if="this.editStatus"
      type="text"
      class="freight-assign-rider-buttons driver-id-input"
      autocomplete="off"
      :id="`${currentUser}_input`"
      v-model="query"
      placeholder="ID number"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
    />
    <input
      v-else
      type="text"
      class="freight-assign-rider-buttons"
      v-model="idNo"
      @click="triggerSearch()"
    />
    <div v-show="hasItems" class="driver-suggestions">
      <p
        v-for="(item, $item) in items"
        class="single-suggestion"
        :class="activeClass($item)"
        @mousedown="hit"
        @mouseover="setActive($item)"
        @mouseout="setActive($item)"
        :key="item.rider_id"
      >
        <span class="tt-suggestion">
          <p>
            <strong>Name: {{ item.rider_name }}</strong>
          </p>
          <p>
            <strong>Phone No: {{ item.phone_no }}</strong>
          </p>
          <p>
            <strong>Email: {{ item.email }}</strong>
          </p>
        </span>
      </p>
    </div>
    <i class="fa fa-spinner fa-spin" v-if="loading"></i>
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Name"
      v-model="name"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
      @input="passNewDriver()"
    />
    <div class="phone-input-holder">
      <vue-tel-input
        v-model="phone"
        v-bind="bindProps"
        class="tel-input"
        :class="existingStatus ? 'inactive-tel-input' : ''"
        :readonly="existingStatus"
        @input="passNewDriver()"
        @validate="Valid"
      ></vue-tel-input>
    </div>
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Driver's license"
      maxlength="15"
      v-model="license"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
      @input="passNewDriver()"
    />
    <el-input
      type="text"
      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
      placeholder="Driver rate"
      v-model="rate"
      class="freight-assign-rider-rate-input"
      @input="
        rate =
          rate > order.payment_details.order_amount
            ? order.payment_details.order_amount
            : rate;
        passNewDriver();
      "
      ><template class="pricing-prepend" slot="append">
        {{ order.payment_details.order_currency }}
      </template>
    </el-input>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'AssignRider',
  components: {
    VueTelInput,
  },
  extends: VueTypeahead,
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      riderDetails: '',
      currentUser: 'rider',
      limit: 10,
      minChars: 1,
      query: '',
      rider: 0,
      name: '',
      riderDisplay: '',
      hide: '',
      hideInput: 'hide',
      solr: {
        riders: 'RIDER_SEARCH',
      },
      editStatus: true,
      existingStatus: false,
      idNo: '',
      name: '',
      phone: '',
      license: '',
      rate: '',
      bindProps: {
        defaultCountry: 'KE',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: 'Phone number',
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['KE', 'UG', 'TZ'],
        onlyCountries: [],
        ignoredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 15,
        wrapperClasses: '',
        inputClasses: '',
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
        validCharactersOnly: true,
      },
    };
  },
  computed: {
    ...mapState(['config']),
    placeholder() {
      return this.category;
    },

    query_string() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/\s/g, '');
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = 'riders';
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    solarToken() {
      return process.env.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(id_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
  },
  watch: {
    name(data) {
      if (this.name) {
        this.name = this.name.toUpperCase();
      }
    },
    query(data) {
      if (this.query) {
        this.query = this.query.replace(/\s/g, '').replace(/[^0-9+]/g, '');
      }
    },
    license(data) {
      if (this.license) {
        this.license = this.license.toUpperCase();
      }
    },
  },
  methods: {
    /* eslint-disable */
    Valid: function({ number, isValid, country }) {
      if (this.phone) {
        if (isValid) {
          document.querySelector('.tel-input').style.cssText = 'border-color: rgb(34, 255, 112); box-shadow: 0px 1px 5px 1px #00ff5a;';
        } else {
          document.querySelector('.tel-input').style.cssText = 'border-color: rgb(255, 160, 160); box-shadow: rgba(255, 0, 0, 0.58) 0px 1px 5px 1px;';
        }
      }
    },
    /* eslint-enable */
    trigger() {
      this.rider = null;
      this.hideInput = 'hide';
      this.hide = '';
    },
    prepareResponseData(data) {
      const results = data.response.docs;

      return results;
    },
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      this.riderDisplay = `${item.rider_name} | ${item.phone_no}`;
      this.requestsingleRider(item.rider_id);
      this.reset();
      return (this.rider = item.rider_id);
    },
    triggerSearch() {
      this.editStatus = true;
      this.existingStatus = false;
      this.$emit('driverDetails', '');
      this.idNo = '';
      this.name = '';
      this.phone = '';
      this.license = '';
      this.rate = '';
    },
    passNewDriver() {
      const payload = {
        registration_no: '',
        vendor_type: 25,
        phone_no: this.phone.replace(/\s/g, ''),
        name: this.name,
        id_no: this.query,
        dl_no: this.license,
        rate: this.rate,
      };
      if (this.existingStatus) {
        this.riderDetails.rate = this.rate;
        this.$emit('driverDetails', this.riderDetails);
      } else {
        this.$emit('driverDetails', payload);
      }
    },
    ...mapActions({
      request_single_rider: 'request_single_rider',
    }),
    ...mapMutations({
      updateErrors: 'setErrors',
    }),
    async requestsingleRider(user) {
      this.loading = false;
      this.riderDetails = null;
      const payload = { riderID: user };
      try {
        const data = await this.request_single_rider(payload);
        this.loading = false;
        this.editStatus = false;
        this.existingStatus = true;
        this.idNo = data.id_no;
        this.name = `${data.rider_name} ${data.s_name}`;
        this.phone = data.phone_no;
        this.license = data.dl_no;
        data.rate = '';
        this.$emit('driverDetails', data);
        return (this.riderDetails = data);
      } catch {
        this.updateErrors([
          'Something went wrong. Try again or contact Tech Support',
        ]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 2000);
      }
    },
  },
};
</script>

<style>
.driver-suggestions {
  position: absolute;
  width: 400px;
  background: white;
  z-index: 100;
}
.driver-suggestions .active {
  background-color: #0097cf;
  color: #fff;
}
.single-suggestion {
  padding-left: 20px;
}
.tel-input {
  height: 40px;
  padding: 7px;
  border-radius: 5px;
  border: 1px solid #d3d6d8;
  margin: 5px;
  width: max-content;
  float: left;
}
.inactive-tel-input {
  pointer-events: none;
  cursor: not-allowed;
}
.phone-input-holder {
  display: inline-flex;
  width: 180px;
}
</style>
