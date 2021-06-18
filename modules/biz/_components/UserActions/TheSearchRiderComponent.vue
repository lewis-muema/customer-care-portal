<template>
  <span>
    <div @click="trigger" :class="`trigger ${hideInput}`">
      {{ riderDisplay }}
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
      <ul v-show="hasItems">
        <li
          v-for="(item, $item) in items"
          :class="activeClass($item)"
          @mousedown="hit"
          @mousemove="setActive($item)"
          :key="item.rider_id"
        >
          <span class="tt-suggestion">
            <p>
              <strong>{{ item.rider_name }} | {{ item.phone_no }} </strong>
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
  name: 'TheSearchRiderComponent',
  extends: VueTypeahead,

  props: {
    category: {
      type: String,
      required: true,
    },
    arr: {
      type: Object,
      required: true,
    },
    riderKey: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      currentUser: 'rider',
      limit: 10,
      minChars: 1,
      query: '',
      rider: 0,
      riderDisplay: '',
      hide: '',
      hideInput: 'hide',
      solr: {
        riders: 'RIDER_SEARCH',
      },
      userCountries: '',
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getSession', 'getEnvironmentVariables']),
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
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(rider_name:*${this.query_string}*+OR+email:*${this.query_string}*+OR+phone_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
  },
  mounted() {
    const session = this.getSession;
    this.userCountries = JSON.parse(session.payload.data.country_codes);
  },
  methods: {
    trigger() {
      this.rider = null;
      this.hideInput = 'hide';
      this.$emit('riderID', this.rider);
      this.hide = '';
    },
    prepareResponseData(data) {
      const results = data.response.docs;
      results.splice(0, 0, this.arr);
      const filtered = results.filter(item =>
        this.userCountries.includes(item.country_code),
      );
      return filtered;
    },
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      this.riderDisplay = `${item.rider_name} | ${item.phone_no}`;
      this.$emit('riderData', {
        riderID: item.rider_id,
        riderKey: this.riderKey,
      });
      return (this.rider = item.rider_id);
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
.Typeahead__input ::placeholder {
  color: red;
}
.Typeahead__input {
  width: 90%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  font-weight: 300;
  padding: 8px 11px;
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
