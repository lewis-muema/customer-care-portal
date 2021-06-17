<template>
  <div class="col-md-7 user-search">
    <div class="Typeahead" v-if="hideSearch()">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>

      <input
        type="text"
        class="Typeahead__input"
        :placeholder="`${placeholder}`"
        autocomplete="off"
        :id="`${user}_input`"
        v-model="query"
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
          <div v-if="user === 'biz'">
            <TheBizSearchDisplay :item="item" />
          </div>
          <div v-if="user === 'peer'">
            <ThePeerSearchDisplay :item="item" />
          </div>
          <div v-if="user === 'riders'">
            <TheRiderSearchDisplay :item="item" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import VueTypeahead from 'vue-typeahead';
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'TheSearchComponent',
  components: {
    TheBizSearchDisplay: () =>
      import('~/modules/biz/_components/TheBizSearchDisplay'),
    ThePeerSearchDisplay: () =>
      import('~/modules/peer/_components/ThePeerSearchDisplay'),
    TheRiderSearchDisplay: () =>
      import('~/modules/riders/_components/TheRiderSearchDisplay'),
  },
  extends: VueTypeahead,

  props: {
    user: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      limit: 5,
      minChars: 1,
      query: '',
      order: null,
      solr: {
        riders: 'RIDER_SEARCH',
        biz: 'BIZ_SEARCH',
        peer: 'PEER_SEARCH',
      },
      placeholderObj: {
        riders: 'Search for Rider Name /Phone ',
        biz: 'Search for Name/Contact person/Phone/Acc No',
        peer: 'Search for Name/Phone/Email',
      },
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getSession']),
    country() {
      return this.getSession;
    },
    query_string() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/\s/g, '');
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = this.user;
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    placeholder() {
      const placeholderArray = this.placeholderObj;
      const currentUser = this.user;
      return placeholderArray[currentUser];
    },
    solarToken() {
      return this.$env.SOLR_JWT;
    },
    src() {
      let searchString = '';
      if (this.user === 'riders') {
        searchString = `${this.solarBase}select?q=(rider_name:*${this.query_string}*+OR+email:*${this.query_string}*+OR+phone_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20asc&jwt=${this.solarToken}`;
      } else if (this.user === 'biz') {
        searchString = `${this.solarBase}select?q=(cop_name:*${this.query_string}*+OR+contact_person:*${this.query_string}*+OR+cop_phone:*${this.query_string}*+OR+account_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=cop_id%20asc&jwt=${this.solarToken}&fq=(status:1)`;
      } else if (this.user === 'peer') {
        searchString = `${this.solarBase}select?q=(user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+user_status:*${this.query_string}*)&wt=json&indent=true&row=10&sort=user_id%20asc&jwt=${this.solarToken}`;
      }
      return searchString;
    },
    userCountries() {
      const staffCountry = [];
      const userData = JSON.parse(this.country.payload.data.country_codes);
      staffCountry.push(userData);
      return staffCountry;
    },
  },
  methods: {
    ...mapMutations({
      updateBizUser: 'setSearchedBizUser',
      updatePeerUser: 'setSearchedPeerUser',
      updateRider: 'setSearchedRider',
    }),
    ...mapActions({
      request_single_biz_user: 'request_single_biz_user',
    }),
    prepareResponseData(data) {
      const response = data.response.docs;
      const filtered = response.filter(item =>
        item.country_code.includes(this.userCountries),
      );
      return filtered;
    },
    searchBiz(param) {
      const account_no = param.trim().toLowerCase();
      if (account_no.length > 5) {
        if (account_no.slice(0, 5) === 'sendy') {
          const cop_id = account_no.slice(5);
          this.updateBizUser(cop_id);
        }
      }
    },
    searchPeer(param) {
      const phone_no = param.trim();
      this.updatePeerUser(phone_no);
    },
    searchRider(param) {
      const phone_no = param.trim();
      this.updateRider(phone_no);
    },
    byPassSolrSearch(user) {
      const param = localStorage.query;
      if (user === 'biz') {
        this.searchBiz(param);
      }
      if (this.user === 'peer') {
        this.searchPeer(param);
      }
      if (this.user === 'riders') {
        this.searchRider(param);
      }
    },
    // eslint-disable-next-line require-await
    async onHit(item) {
      if (this.user === 'biz') {
        this.updateBizUser(item.cop_id);
      }
      if (this.user === 'peer') {
        this.updatePeerUser(item.user_id);
      }
      if (this.user === 'riders') {
        this.updateRider(item.rider_id);
      }
    },
    hideSearch() {
      let hide = true;
      if (
        this.user === 'rewards' ||
        this.user === 'intercounty' ||
        this.user === 'refund' ||
        this.user === 'socialMediaBusiness'
      ) {
        hide = false;
      }
      return hide;
    },
  },
};
</script>
<style scoped>
.user-search {
  margin: 0 auto;
}
.Typeahead {
  position: relative;
}
.Typeahead__input {
  width: 90%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  box-sizing: border-box;
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
  top: 16px;
  right: 6px;
  opacity: 1;
}
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 90%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
li {
  padding: 6px 13px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
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
  color: #2c3e50;
}
.active {
  background-color: #0097cf;
  color: #fff;
}
.active span {
  color: white;
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
