<template>
  <div class="search-row">
    <div class="Typeahead">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
      <template v-else>
        <i class="fa fa-search" @click="byPassSolrSearch()"></i>
      </template>

      <input
        type="text"
        class="Typeahead__input"
        placeholder="Search for Order No"
        autocomplete="off"
        v-model="query"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="reset"
        @input="update"
        @click="clear"
      />
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
    <div class="searched-row" v-if="orderData.order_details.order_no">
      <div class="searched-columns">
        <span class="searched-single-column">
          <p class="searched-single-column-head">Pickup</p>
          <p class="searched-single-column-data">
            {{ orderData.paths[0].name }}, {{ orderData.paths[0].road }}
          </p>
        </span>
        <span class="searched-single-column">
          <p class="searched-single-column-head">Vendor type</p>
          <p class="searched-single-column-data">
            {{ vendorType[orderData.rider_details.vendor_type_id] }}
          </p>
        </span>
        <span class="searched-single-column">
          <p class="searched-single-column-head">Driver name</p>
          <p class="searched-single-column-data">
            {{ orderData.rider_details.name }}
          </p>
        </span>
      </div>
      <div class="searched-columns">
        <span class="searched-single-column">
          <p class="searched-single-column-head">Destination</p>
          <p class="searched-single-column-data">
            {{ orderData.paths[1].name }}, {{ orderData.paths[1].road }}
          </p>
        </span>
        <span class="searched-single-column">
          <p class="searched-single-column-head">Driver phone</p>
          <p class="searched-single-column-data">
            {{ orderData.rider_details.phone_no }}
          </p>
        </span>
      </div>
      <div class="searched-columns section-spacer">
        <span class="searched-single-column-left">
          <div class="amounts-section">
            <p class="searched-single-column-head">Customer amount</p>
            <span>
              <div class="currency-data">
                KES
              </div>
              <input
                v-model="customerAmount"
                type="number"
                class="searched-single-column-data amount-data"
                placeholder="0"
                min="0"
            /></span>
          </div>
          <div class="amounts-section">
            <p class="searched-single-column-head">Partner amount</p>
            <span>
              <div class="currency-data">
                KES
              </div>
              <input
                v-model="partnerAmount"
                type="number"
                class="searched-single-column-data amount-data"
                placeholder="0"
                min="0"
            /></span>
          </div>
          <div>
            <p class="searched-single-column-head">Sendy Take amount</p>
            <p class="take-home-amount">KES {{ takeHome }}</p>
          </div>
        </span>
        <span class="searched-single-column-right">
          <p class="searched-single-column-head">Tonnes Delivered</p>
          <input
            v-model="tonnes"
            type="number"
            class="searched-single-column-data tonnage-inputs"
            placeholder="Tonnes Delivered"
            min="0"
          />
          <p class="searched-single-column-head">Notes</p>
          <textarea
            rows="4"
            cols="50"
            type="text"
            class="searched-single-column-data notes-inputs"
            placeholder="Notes"
          ></textarea>
        </span>
      </div>
      <div class="searched-columns">
        <button
          class="submit-button"
          :class="
            activeButton ? 'active-submit-button' : 'inactive-submit-button'
          "
          @click="sendTonnagePaymentDetails()"
        >
          Submit
        </button>
      </div>
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
      orderData: {
        order_details: {
          order_no: '',
        },
      },
      customerAmount: '',
      partnerAmount: '',
      tonnes: '',
    };
  },
  computed: {
    ...mapState(['config', 'vendorType', 'userData']),

    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.trim();
    },
    activeButton() {
      if (this.customerAmount && this.partnerAmount && this.tonnes) {
        return true;
      }
      return false;
    },
    takeHome() {
      if (this.customerAmount && this.partnerAmount) {
        return this.customerAmount - this.partnerAmount;
      }
      return 0;
    },
    solarBase() {
      return this.config.SOLR_BASE;
    },
    solarToken() {
      return this.$env.SOLR_JWT;
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
      log_action: 'log_action',
      back_date_order_confirm: 'back_date_order_confirm',
    }),
    async byPassSolrSearch() {
      const orderNo = localStorage.query;
      await this.singleOrderRequest(orderNo);
    },
    async onHit(item) {
      this.isActive = false;
      const orderNo = item.order_no;
      this.query = orderNo;
      localStorage.setItem('query', this.query);
      const orderData = await this.singleOrderRequest(orderNo);
      this.orderData = orderData;
    },
    async singleOrderRequest(orderNo) {
      orderNo = orderNo.trim();
      try {
        const data = await this.request_single_order(orderNo);
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
    async sendTonnagePaymentDetails() {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'back_dated_order_confirm',
        params: {
          order_no: 'BZ244F977-WX2',
          sim_card_sn: '256754016798',
          Rider_phone: '+256754016798',
          version_code: 684,
          order_amount: 2787009,
          rider_amount: 2340426,
          vat_amount: 425137,
          service_fee: 11447,
          sendy_commission: 6,
          insurance: 10000,
        },
      };
      try {
        const data = await this.back_date_order_confirm(payload);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    async logAction(action) {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'log_cc_action',
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 23,
          _user_email: this.userData.payload.data.email,
          _user_id: this.userData.payload.data.admin_id,
          action_user: this.userData.payload.data.name,
          description: action,
          order_no: this.orderData.order_details.order_no,
        },
      };
      try {
        const data = await this.log_action(payload);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.Typeahead {
  position: relative;
  width: 33%;
  margin: auto;
}
.search-row {
  width: 100%;
}
.searched-row {
  padding-top: 20px;
  border: 1px solid #dcdcdc;
  margin-top: 15px;
  padding-bottom: 20px;
}
.Typeahead__input {
  width: 80%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  font-weight: 300;
  padding: 13px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
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
  width: 300px;
  color: #2c3e50;
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
.inactiveClass {
  display: none;
}
.searched-columns {
  display: flex;
  margin-bottom: 10px;
}
.searched-single-column {
  width: 33%;
  padding-left: 5%;
}
.searched-single-column-left {
  width: 55%;
  margin-right: 20px;
  padding-left: 35px;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  margin-left: 10px;
}
.searched-single-column-right {
  width: 40%;
  display: grid;
  padding: 10px;
}
.searched-single-column-data {
  margin-bottom: 10px;
}
.searched-single-column-head {
  margin-bottom: 10px;
  font-weight: 700;
}
.amounts-section {
  width: 50%;
  float: left;
}
.section-spacer {
  padding-top: 20px;
  border-top: 1px solid #dcdcdc;
}
.currency-data {
  width: max-content;
  float: left;
  height: 40px;
  padding: 10px;
  background: #e7e7e7;
}
.amount-data {
  width: 80px;
  height: 40px;
  padding-left: 10px;
}
.tonnage-inputs {
  height: 40px;
  padding-left: 10px;
}
.notes-inputs {
  padding-left: 10px;
  border: 1px solid #dfdfdf;
}
.take-home-amount {
  font-size: 23px;
}
.submit-button {
  margin: 15px;
  width: 30%;
  height: 45px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 5px;
}
.inactive-submit-button {
  background: #c7c7c7;
}
.active-submit-button {
  background: #3c8dbc;
}
</style>
