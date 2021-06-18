<template>
  <span :key="searchInput">
    <div @click="trigger" :class="`trigger ${hideInput}`">
      {{ userDisplay }}
    </div>
    <div :class="`Typeahead form-group ${hide}`">
      <input
        type="text"
        class="Typeahead__input"
        autocomplete="off"
        :id="`${currentUser}_input`"
        v-model="query"
        :placeholder="placeholder"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="reset"
        @input="update"
        @blur="reset"
      />
      <ul v-show="hasItems" @blur="reset">
        <li
          v-for="(item, $item) in items"
          :class="activeClass($item)"
          @mousedown="hit"
          @mousemove="setActive($item)"
          :key="item.index"
        >
          <span class="tt-suggestion">
            <p>
              <strong v-if="userType === 'business'">
                {{ item.cop_name }} | {{ item.cop_phone }}
              </strong>
              <strong v-if="userType === 'peer'">
                {{ item.user_name }} | {{ item.user_phone }}
              </strong>
            </p>
          </span>
        </li>
      </ul>
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
    </div>
  </span>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import VueTypeahead from 'vue-typeahead';

export default {
  name: 'TheSearchUserComponent',
  extends: VueTypeahead,

  props: {
    user: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      currentUser: this.user,
      limit: 10,
      minChars: 1,
      query: '',
      userID: null,
      userDisplay: '',
      searchInput: 0,
      hide: '',
      hideInput: 'hide',
      solr: {
        business: 'BIZ_SEARCH',
        peer: 'PEER_SEARCH',
      },
    };
  },

  computed: {
    ...mapState(['config']),
    ...mapGetters(['getEnvironmentVariables']),
    placeholder() {
      return 'Select account to transfer';
    },

    query_string() {
      localStorage.setItem('query', this.query);
      return this.query;
    },
    userType() {
      const user = this.user;
      return user.toLowerCase();
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = this.user;
      const userSearch = solrArray[currentUser.toLowerCase()];
      return this.config[userSearch];
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    src() {
      let searchString = '';
      if (this.userType === 'business') {
        searchString = `${this.solarBase}select?q=(cop_name:*${this.query_string}*+OR+contact_person:*${this.query_string}*+OR+cop_phone:*${this.query_string}*+OR+account_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=cop_id%20desc&jwt=${this.solarToken}`;
      } else if (this.userType === 'peer') {
        searchString = `${this.solarBase}select?q=(user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+user_status:*${this.query_string}*)&wt=json&indent=true&row=10&sort=user_id%20desc&jwt=${this.solarToken}`;
      }
      return searchString;
    },
  },
  watch: {
    user(val) {
      this.userDisplay = '';
      this.userID = null;
      this.hide = '';
      this.hideInput = 'hide';
    },
  },
  mounted() {
    this.userDisplay = '';
    this.userID = null;
  },
  methods: {
    trigger() {
      this.hideInput = 'hide';
      this.hide = '';
    },
    forceRerender() {
      this.searchInput += 1;
    },
    prepareResponseData(data) {
      return data.response.docs;
    },
    onHit(item) {
      const display =
        this.userType === 'business'
          ? `${item.cop_name} | ${item.cop_phone}`
          : `${item.user_name} | ${item.user_phone}`;

      this.hide = 'hide';
      this.hideInput = '';
      this.userDisplay = display;
      const userID = this.userType === 'business' ? item.cop_id : item.user_id;
      this.$emit('userID', userID);
      return (this.userID = userID);
    },
  },
};
</script>
<style scoped>
.trigger {
  padding: 7px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #747d84;
  width: 90%;
  border-radius: 0.25rem;
}
.fa-search {
  font-size: x-large;
  vertical-align: text-top;
  padding: 0;
  color: #3c8dbc;
  margin-top: 0;
}
.user-search {
  padding: 0;
}
.Typeahead {
  position: relative;
}
.Typeahead__input {
  width: 90%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  font-weight: 300;
  padding: 8px 26px;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.Typeahead__input:focus {
  border-color: 2px solid #0097cf;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #0097cf;
}
.fa-times {
  cursor: pointer;
}

i {
  float: right;
  position: relative;
  top: 0px;
  left: 7px;
  opacity: 1;
}
ul {
  position: absolute;
  padding: 0;
  min-width: 90%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  top: 100%;
  left: 0;
  margin: auto;
}
li {
  padding: 6px 13px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  color: red;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #3b8bb9;
}
.active {
  background-color: #0097cf;
  color: #fff;
}
.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}
.tt-suggestion {
  border-bottom: 0;
}
</style>
