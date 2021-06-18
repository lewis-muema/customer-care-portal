<template>
  <div class="">
    <div class="Typeahead">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
      <div class="form-group has-search">
        <span class="fa fa-search form-control-feedback "></span>
        <div class="row ml-1">
          <input
            type="text"
            class="form-control Typeahead__input"
            placeholder="Search Order No/ Customer name/ User Phone"
            autocomplete="off"
            v-model="query"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @input="update"
            @click="clear"
          />
          <i class="fa fa-search" @click="byPassSolrSearch()"></i>
        </div>
      </div>

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
          <span>Client: {{ item.user_name }}</span>
          <span>Client phone: {{ item.user_phone }}</span>
          <span>Rider: {{ item.rider_name }}</span>
          <span>Date: {{ getFormattedDate(item.date_time, 'LLLL') }}</span>
          <span>
            <strong>Pickup: {{ item.pickup }}</strong>
          </span>
          <span>
            <strong>Delivery: {{ item.destination }}</strong>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  extends: VueTypeahead,
  data() {
    return {
      limit: 10,
      minChars: 1,
      query: '',
      order: null,
      isActive: true,
    };
  },
  computed: {
    ...mapState(['config']),

    ...mapGetters(['getEnvironmentVariables']),

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
    src() {
      return `${this.solarBase}select?q=(order_no:*${this.query_string}*+OR+pickup:*${this.query_string}*+OR+destination:*${this.query_string}*+OR+user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*+OR+user_email:*${this.query_string}*+OR+rider_email:*${this.query_string}*+OR+rider_phone_no:*${this.query_string}*+OR+rider_name:*${this.query_string}*+OR+container_number:*${this.query_string}*+OR+container_destination:*${this.query_string}*+OR+consignee:*${this.query_string}*)&wt=json&indent=true&row=10&sort=order_id%20desc&jwt=${this.solarToken}`;
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedOrder: 'setSearchedOrder',
      updateSearchState: 'setSearchState',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    async byPassSolrSearch() {
      this.updateSearchState(true);
      const orderNo = localStorage.query;
      await this.singleOrderRequest(orderNo);
    },
    async onHit(item) {
      this.isActive = false;
      this.updateSearchState(true);
      const orderNo = item.order_no;
      await this.singleOrderRequest(orderNo);
    },
    async singleOrderRequest(orderNo) {
      orderNo = orderNo.trim();
      try {
        const data = await this.request_single_order(orderNo);
        this.updateSearchedOrder(data);
        return (this.order = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    prepareResponseData(data) {
      return data.response.docs;
    },
    clear() {
      this.isActive = true;
    },
  },
};
</script>

<style scoped>
.Typeahead {
  position: relative;
}
.Typeahead .pass-solr {
  margin-top: -3rem;
  padding-left: 2.375rem;
  padding-bottom: 0px;
}
.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
  padding-top: 15px;
}
.Typeahead__input {
  background: #ffffff;
  border: 1px solid #c0c4cc;
  box-sizing: border-box;
  border-radius: 8px;
  width: 85%;
  height: 40px;
  font-size: 14px;
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
.inactiveClass {
  display: none;
}
</style>
