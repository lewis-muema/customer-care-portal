<template>
  <div class="assign-details-tab">
    <p class="assign-header no-margin">Owner Details</p>
    <p class="assign-par">Enter phone number</p>
    <input
      type="text"
      v-if="editStatus"
      class="freight-assign-rider-buttons assign-owner-input"
      autocomplete="off"
      :id="`${currentUser}_input`"
      v-model="query"
      placeholder="Phone Number"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
      @blur="reset"
    />
    <input
      v-else
      type="text"
      class="freight-assign-rider-buttons assign-owner-input"
      v-model="phone"
      @click="triggerSearch()"
    />
    <p
      v-if="buttonStatus === 'assign-owner-failed'"
      class="search-failed-owner"
    >
      (Owner does not exist)
    </p>
    <div v-show="hasItems" class="driver-suggestions">
      <p
        v-for="(item, $item) in items"
        class="single-suggestion"
        :class="activeClass($item)"
        @mousedown="hit"
        @mouseover="setActive($item)"
        @mouseout="setActive($item)"
        :key="item.id"
      >
        <span class="tt-suggestion">
          <p>
            <strong>Name: {{ item.name }}</strong>
          </p>
          <p>
            <strong>Phone No: {{ item.phone }}</strong>
          </p>
          <p>
            <strong>Email: {{ item.email }}</strong>
          </p>
        </span>
      </p>
    </div>
    <button class="assign-owner-button" :class="buttonStatus" @click="search()">
      <span v-if="buttonStatus === 'assign-owner-find'">Find</span>
      <span v-if="buttonStatus === 'assign-owner-failed'">Failed</span>
      <span v-if="buttonStatus === 'assign-owner-success'">Confirmed</span>
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'AssignRider',
  extends: VueTypeahead,
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ownerDetails: '',
      currentUser: 'owner',
      limit: 10,
      minChars: 1,
      query: '',
      owner: 0,
      name: '',
      ownerDisplay: '',
      hide: '',
      hideInput: 'hide',
      solr: {
        owners: 'OWNER_SEARCH',
      },
      editStatus: true,
      existingStatus: false,
      firstItem: '',
      button: 2,
      phone: '',
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getEnvironmentVariables']),

    placeholder() {
      return this.category;
    },

    query_string() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/\s/g, '');
    },
    query_string_phone() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/^(?!00[^0])0/g, '');
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = 'owners';
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(phone:*${this.query_string}*+OR+phone:*${this.query_string_phone}*)&wt=json&indent=true&row=10&sort=id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
    buttonStatus() {
      if (this.button === 1) {
        return 'assign-owner-success';
      } else if (this.button === 0) {
        return 'assign-owner-failed';
      }
      return 'assign-owner-find';
    },
  },
  watch: {
    id() {
      if (this.id > 0) {
        this.requestsingleOwner(this.id);
      } else {
        this.triggerSearch();
      }
    },
    query() {
      if (this.query) {
        this.query = this.query.replace(/[^0-9+]/g, '');
      }
    },
  },
  methods: {
    trigger() {
      this.owner = null;
      this.hideInput = 'hide';
      this.hide = '';
    },
    prepareResponseData(data) {
      const results = data.response.docs;
      if (results.length > 0) {
        this.firstItem = results[0];
      } else {
        this.firstItem = '';
      }
      return results;
    },
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      setTimeout(() => {
        this.editStatus = false;
      }, 1000);
      this.requestsingleOwner(item.id);
      return (this.owner = item.id);
    },
    triggerSearch() {
      this.editStatus = true;
      this.$emit('ownerDetails', '');
      this.button = 2;
      this.name = '';
      this.phone = '';
      this.ownerDetails = '';
      this.firstItem = '';
    },
    search() {
      if (this.button === 2) {
        if (this.firstItem) {
          this.requestsingleOwner(this.firstItem.id);
          return (this.owner = this.firstItem.id);
        } else {
          this.editStatus = false;
          this.button = 0;
        }
      }
    },
    ...mapActions({
      request_single_owner: 'request_single_owner',
    }),
    ...mapMutations({
      updateErrors: 'setErrors',
    }),
    async requestsingleOwner(user) {
      this.loading = false;
      this.ownerDetails = null;
      const payload = { ownerID: user };
      try {
        const data = await this.request_single_owner(payload);
        this.loading = false;
        this.name = data.name;
        this.phone = data.phone;
        this.editStatus = false;
        this.button = 1;
        this.$emit('ownerDetails', data);
        return (this.ownerDetails = data);
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
