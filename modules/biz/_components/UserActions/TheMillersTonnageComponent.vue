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
    <div
      class="searched-row"
      v-if="orderData.order_details.order_no && orderCheck && !cashStatusCheck"
    >
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
                {{ orderData.payment_details.order_currency }}
              </div>
              <input
                v-model="customerAmount"
                type="text"
                class="searched-single-column-data amount-data"
                placeholder="0"
                min="0"
            /></span>
          </div>
          <div class="amounts-section">
            <p class="searched-single-column-head">Partner amount</p>
            <span>
              <div class="currency-data">
                {{ orderData.payment_details.order_currency }}
              </div>
              <input
                v-model="partnerAmount"
                type="text"
                class="searched-single-column-data amount-data"
                placeholder="0"
                min="0"
            /></span>
          </div>
          <div>
            <p class="searched-single-column-head">Sendy Take amount</p>
            <p class="take-home-amount">KES {{ takeHome }}</p>
            <p v-if="takeHome < 0" class="amount-error">
              (Amount should not be negative)
            </p>
          </div>
        </span>
        <span class="searched-single-column-right">
          <p class="searched-single-column-head">Tonnes Delivered</p>
          <input
            v-model="tonnes"
            type="text"
            class="searched-single-column-data tonnage-inputs"
            placeholder="Tonnes Delivered"
            min="0"
          />
          <p class="searched-single-column-head">Notes</p>
          <textarea
            rows="4"
            cols="50"
            type="text"
            v-model="notes"
            class="searched-single-column-data notes-inputs"
            placeholder="Notes"
          ></textarea>
        </span>
      </div>
      <div class="searched-columns">
        <div class="submit-container">
          <p class="amount-error">
            {{ errorStatus }}
          </p>
          <button
            class="submit-button"
            :class="
              activeButton ? 'active-submit-button' : 'inactive-submit-button'
            "
            @click="sendTonnagePaymentDetails()"
          >
            Submit
            <i class="fa fa-spinner fa-spin submit-icon" v-if="searching"></i>
          </button>
        </div>
      </div>
    </div>
    <div>
      <div class="order-error">
        <p
          class="amount-error"
          v-if="orderData.order_details.order_no && !orderCheck"
        >
          (This is not a miller order)
        </p>
        <p
          class="amount-error"
          v-else-if="orderData.order_details.order_no && cashStatusCheck"
        >
          (This is a cash order thus cannot be billed)
        </p>
      </div>
      <img
        src="https://images.sendyit.com/CCredesign/searchIllustatration.png"
        alt="search-img"
        class="search-illustration"
        v-if="
          !orderData.order_details.order_no || !orderCheck || cashStatusCheck
        "
      />
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
      notes: '',
      searching: false,
    };
  },
  computed: {
    ...mapState(['config', 'vendorType', 'userData']),

    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.trim();
    },
    activeButton() {
      if (
        this.customerAmount &&
        this.partnerAmount &&
        !this.searching &&
        this.takeHome > -1 &&
        this.orderData.order_details.delivery_status === 3 &&
        this.orderData.payment_details.cost -
          (this.orderData.payment_details.insurance_amount +
            this.orderData.payment_details.vat_amount) ===
          0
      ) {
        return true;
      }
      return false;
    },
    errorStatus() {
      if (
        this.orderData.payment_details.cost -
          (this.orderData.payment_details.insurance_amount +
            this.orderData.payment_details.vat_amount) !==
        0
      ) {
        return '(This order has already been priced)';
      } else if (this.orderData.order_details.delivery_status !== 3) {
        return '(The order needs to be completed first)';
      }
      return '';
    },
    orderCheck() {
      if (
        this.orderData.price_tiers[0].cost ===
          this.orderData.price_tiers[0].return_cost &&
        this.orderData.rider_details.vendor_type_id === 20
      ) {
        return true;
      }
      return false;
    },
    cashStatusCheck() {
      if (this.orderData.payment_details.cash_status === 1) {
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
  watch: {
    customerAmount() {
      this.customerAmount = this.customerAmount
        .toString()
        .replace(/[^0-9]/g, '');
    },
    partnerAmount() {
      this.partnerAmount = this.partnerAmount.toString().replace(/[^0-9]/g, '');
    },
    tonnes() {
      this.tonnes = this.tonnes.toString().replace(/[^0-9]/g, '');
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedOrder: 'setSearchedOrder',
      updateSearchState: 'setSearchState',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
      custom_deliver: 'custom_deliver',
      log_action: 'log_action',
      back_date_order_confirm: 'back_date_order_confirm',
    }),
    async byPassSolrSearch() {
      this.isActive = false;
      const orderNo = localStorage.query;
      const orderData = await this.singleOrderRequest(orderNo);
      this.orderData = orderData;
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
        this.updateClass('danger');
        this.updateErrors(['Could not find the order']);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
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
          order_no: this.orderData.order_details.order_no,
          sim_card_sn: this.orderData.rider_details.serial_no,
          rider_phone: this.orderData.rider_details.phone_no,
          version_code: 1250,
          order_amount: this.customerAmount,
          rider_amount: this.partnerAmount,
          vat_amount: 0,
          service_fee: 0,
          sendy_commission: 0,
          insurance: 0,
        },
      };
      try {
        this.searching = true;
        const data = await this.back_date_order_confirm(payload);
        if (data.status) {
          this.updateClass('success');
          this.customDeliver();
          const tonnesString =
            this.tonnes !== '' ? `, Tonnes delivered ${this.tonnes}` : '';
          const notesString = this.notes !== '' ? `, Notes: ${this.notes}` : '';
          this.logAction(
            `Adjust order amounts for order ${this.orderData.order_details.order_no} with customer amount ${this.orderData.payment_details.order_currency} ${this.customerAmount} and partner amount ${this.orderData.payment_details.order_currency} ${this.partnerAmount} for account SENDY${this.orderData.client_details.client_id} ${tonnesString} ${notesString}`,
            33,
          );
        } else {
          this.updateClass('danger');
          this.searching = false;
        }
        this.updateErrors([data.message]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      } catch (err) {
        this.updateClass('danger');
        this.updateErrors([err.message]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      }
    },
    async customDeliver() {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'CUSTOM_DELIVER',
        params: {
          order_no: this.orderData.order_details.order_no,
        },
      };
      try {
        const data = await this.custom_deliver(payload);
        if (data.status) {
          this.updateClass('success');
          this.orderData = await this.singleOrderRequest(
            this.orderData.order_details.order_no,
          );
          this.customerAmount = '';
          this.partnerAmount = '';
          this.tonnes = '';
          this.notes = '';
          this.logAction(
            `Debit the client SENDY${this.orderData.client_details.client_id} with amount ${this.orderData.payment_details.order_currency} ${data.amount} and credit the partner ${this.orderData.rider_details.name} ${this.orderData.rider_details.phone_no} with ${this.orderData.payment_details.order_currency} ${this.partnerAmount} for order ${this.orderData.order_details.order_no}`,
            34,
          );
        } else {
          this.updateClass('danger');
        }
        this.searching = false;
        this.updateErrors([data.reason]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      } catch (err) {
        this.updateClass('danger');
        this.updateErrors([err.message]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      }
    },
    async logAction(action, actionId) {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'log_cc_action',
        params: {
          channel: 'customer_support',
          data_set: 'cc_actions',
          action_id: actionId,
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
  margin-top: 5px;
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
  pointer-events: none;
}
.active-submit-button {
  background: #3c8dbc;
}
.search-illustration {
  margin: auto;
  display: block;
  margin-top: 40px;
  margin-bottom: 40px;
}
.submit-icon {
  top: 4px;
  right: 25%;
}
.amount-error {
  color: red;
  font-style: italic;
  margin: 0;
}
.submit-container {
  width: 100%;
  padding-left: 15px;
}
.order-error {
  text-align: center;
  padding: 13px;
}
</style>
