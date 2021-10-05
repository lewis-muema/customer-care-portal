<template>
  <div>
    <el-input
      placeholder="Search order ( order no, name, user phone)"
      prefix-icon="el-icon-search"
      autocomplete="off"
      v-model="query"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
      @click="clear"
      @blur="reset"
    >
    </el-input>

    <ul v-show="hasItems" :class="[!isActive ? 'inactiveClass' : '']">
      <li
        v-for="(item, $item) in items"
        :class="activeClass($item)"
        @mousedown="hit"
        @mousemove="setActive($item)"
        :key="item.index"
      >
        <span>
          <strong>{{ item.order_no }}</strong>
        </span>
        <span>Seller: {{ item.user_name }}</span>
        <span>Recipient: {{ item.user_name }}</span>
        <span>Rider: {{ item.rider_name }}</span>
        <span>Date: {{ getFormattedDate(item.date_time, 'LLLL') }}</span>
        <span>
          <strong>Destination: {{ item.destination }}</strong>
        </span>
      </li>
    </ul>
    <ul
      v-show="!hasItems && query !== ''"
      :class="[!isActive ? 'inactiveClass' : '']"
    >
      <li class="my-3">
        No results Found
      </li>
    </ul>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'Search',
  extends: VueTypeahead,
  props: ['page'],
  data() {
    return {
      limit: 5,
      minChars: 1,
      query: '',
      order: null,
      isActive: true,
      errors: [],
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getSession', 'getEnvironmentVariables']),
    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.trim();
    },
    solarBase() {
      return this.config.SOLR_BASE;
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    srcPath() {
      const data = {
        Outbound_ordersView: `select?q=(order_no:*${this.query_string}*+OR+pickup:*${this.query_string}*+OR+destination:*${this.query_string}*+OR+user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+rider_email:*${this.query_string}*+OR+rider_phone_no:*${this.query_string}*+OR+rider_name:*${this.query_string}*+OR+container_number:*${this.query_string}*+OR+container_destination:*${this.query_string}*+OR+consignee:*${this.query_string}*)&wt=json&indent=true&row=10&sort=order_id%20desc`,

        Outbound_batchesView: `select?q=(order_no:*${this.query_string}*+OR+pickup:*${this.query_string}*+OR+destination:*${this.query_string}*+OR+user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+rider_email:*${this.query_string}*+OR+rider_phone_no:*${this.query_string}*+OR+rider_name:*${this.query_string}*+OR+container_number:*${this.query_string}*+OR+container_destination:*${this.query_string}*+OR+consignee:*${this.query_string}*)&wt=json&indent=true&row=10&sort=order_id%20desc`,

        Outbound_movableUnitsView: `select?q=(order_no:*${this.query_string}*+OR+pickup:*${this.query_string}*+OR+destination:*${this.query_string}*+OR+user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+rider_email:*${this.query_string}*+OR+rider_phone_no:*${this.query_string}*+OR+rider_name:*${this.query_string}*+OR+container_number:*${this.query_string}*+OR+container_destination:*${this.query_string}*+OR+consignee:*${this.query_string}*)&wt=json&indent=true&row=10&sort=order_id%20desc`,
      };

      return data;
    },
    src() {
      // eslint-disable-next-line prettier/prettier
      return `${this.solarBase}${this.srcPath[this.page]}&jwt=${this.solarToken}`;
    },
    identifier() {
      const data = {
        Outbound_ordersView: 'order_no',
        Outbound_batchesView: 'batch_id',
        Outbound_movableUnitsView: 'movable_unit_id',
      };
      return data;
    },
    userCountries() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray.toLowerCase());
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedEntity: 'fulfilment/setSearchedEntity',
      updateSearchState: 'fulfilment/setSearchState',
      isSearching: 'fulfilment/setSearchingStatus',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
      fetchSingleOrder: 'fulfilment/fetchSingleOrder',
    }),
    async onHit(item) {
      this.isActive = false;
      this.updateSearchState(true);
      this.isSearching(true);
      const orderNo = item.order_no;
      const identifier = this.identifier[this.page];
      const entityID = item[identifier];
      await this.singleFulfilmentRequest(entityID);
    },
    async singleFulfilmentRequest(entityID) {
      if (!entityID) return;
      entityID = entityID.trim();
      try {
        const data = await this.fetchSingleOrder();
        this.updateSearchedEntity(data);
        this.isSearching(false);

        return (this.order = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        this.isSearching(false);
      }
    },
    prepareResponseData(data) {
      const response = data.response.docs;
      return response;
    },
    clear() {
      this.isActive = true;
    },
  },
};
</script>

<style scoped>
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
</style>
