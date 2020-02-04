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
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Phone number"
      v-model="phone"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
      @input="passNewDriver()"
    />
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Driver's license"
      v-model="license"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
      @input="passNewDriver()"
    />
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Driver rate"
      v-model="rate"
      @input="passNewDriver()"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'AssignRider',
  extends: VueTypeahead,
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
      return this.$env.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(id_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
  },
  methods: {
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
        phone_no: this.phone,
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
</style>
