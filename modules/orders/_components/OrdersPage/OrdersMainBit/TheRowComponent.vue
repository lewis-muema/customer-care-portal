<template>
  <tbody
    id="table_body_geg"
    v-infinite-scroll=""
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="limit"
    :key="rowComponentKey"
  >
    <rabbitMQcomponent @pushedSomething="handlePushInParent" />
    <tr
      v-if="orders.length === 0"
      id="initial_data_request_show"
      data-aos="slide-up"
      data-aos-offset="100"
      data-aos-easing="ease-out-back"
    >
      <td colspan="9">
        <div id="initial_load_box">Requesting for orders ...</div>
      </td>
    </tr>
    <template
      v-for="(order, index) in orders"
      :class="determineOrderColor(order.time_of_delivery, order.push_order)"
    >
      <tr
        @click="toggle(order.order_no)"
        :class="
          ({ opened: opened.includes(order.order_no) },
          determineOrderColor(order.time_of_delivery, order.push_order))
        "
        :key="`main_${index}`"
      >
        <td>
          <span
            :id="`tip_order_${order.order_no}`"
            data-toggle="tooltip"
            title=""
          >
            <span
              :id="`order_indicator_${order.order_no}`"
              :class="`label ${order.order_status.toLowerCase()}_ind`"
            >
              {{ order.order_status }}
            </span>
          </span>
        </td>
        <td v-html="smartify_display(order.client_name, 20)">
          <span
            v-if="order.pay_cash_on_delivery"
            title="Cash"
            class="badge"
            style="float:right; background-color: transparent;"
          >
            <i class="fa fa-fw fa-money" style=" color:green;"></i
          ></span>
          <span
            v-if="order.price_type === 'Standard'"
            title="Standard"
            class="badge bg-aqua"
            style="float:right;"
          >
            s
          </span>
        </td>
        <td>
          {{ order.rider_name }}
          <span style="float:right;">
            <span> {{ vendorLabels[order.vendor_type_id] }}</span>
            &nbsp;
            <img
              :src="
                `https://images.sendyit.com/web_platform/vendor_type/side/v2/${order.vendor_type_id}.svg`
              "
              height="14"
              style="float: right; image-rendering: auto;height:18px"
            />
          </span>
        </td>
        <td>
          {{ getFormattedDate(order.time_of_delivery, 'hh.mm a DD/MM/YYYY') }}
          <span
            v-if="compareDates(order.time_of_delivery)"
            title="Scheduled for tomorrow"
            class="fa fa-clock-o pull-right"
            style="color:deeppink; font-weight:100;"
          >
          </span>
        </td>
        <td v-html="smartify_display(order.from_name, 30)"></td>
        <td v-html="smartify_display(order.to_name, 30)"></td>
        <td>
          {{
            displayAmount(
              order.order_currency,
              order.order_amount,
              order.vendor_type_id,
              order.fixed_cost,
              order.customer_min_amount,
              order.confirm_status,
            )
          }}
        </td>
        <td>
          {{
            displayAmount(
              order.order_currency,
              order.rider_amount,
              order.vendor_type_id,
              order.fixed_cost,
              order.customer_min_amount,
              order.confirm_status,
            )
          }}
          <span
            title="showCity(order.city)"
            class="badge bg-aqua "
            style="float: right;"
            >{{ cityAbbrev[showCity(order.city)] }}
          </span>
          <span style="float: right;"> &nbsp; </span>
          <span title="Corporate Name" class="badge bg-aqua pull-right">
            {{ order.distance_read }} km</span
          >
        </td>
      </tr>
      <tr
        class="order_row_home_lower"
        v-if="opened.includes(order.order_no)"
        :key="`details_${index}`"
        :id="`child_row_${order.order_no}`"
      >
        <TheLowerSlideComponent :orderno="order.order_no" />
      </tr>
    </template>
    <tr v-if="!returned">
      <td colspan="9">
        <div class="text-center">
          <i class="fa fa-spinner fa-spin loader"></i>
        </div>
      </td>
    </tr>
    <tr v-if="!ordersExist">
      <td colspan="9">
        <div class="alert alert-info text-center">
          <strong>{{ msg }}</strong>
        </div>
      </td>
    </tr>
  </tbody>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import TheLowerSlideComponent from '../OrdersLowerBit/TheLowerSlideComponent';
import rabbitMQcomponent from '../../../../rabbitMQ/rabbitMQComponent';

export default {
  name: 'TheRowComponent',
  components: {
    TheLowerSlideComponent,
    rabbitMQcomponent,
  },
  data() {
    return {
      orders: [],
      bottom: false,
      nextPage: null,
      orderColorClass: '#fff',
      orderNotification: true,
      ordersExist: true,
      newData: null,
      busy: false,
      show: false,
      businessUnits: null,
      rowComponentKey: 0,
      statusArray: null,
      opened: [],
      cities: null,
      msg: '',
      returned: false,
      companyUnits: [],
    };
  },
  computed: {
    ...mapGetters([
      'getOrders',
      'getOrderStatuses',
      'getSelectedBusinessUnits',
      'getSelectedCities',
      'getReorganizeStatus',
      'getOrderCount',
      'getBusinessUnits',
    ]),
    ...mapState(['delayLabels', 'vendorLabels', 'cityAbbrev']),
    autoLoadDisabled() {
      return this.loading || this.commentsData.length === 0;
    },
    confirmedOrders() {
      return this.orders.filter(el => {
        return el.order_status.toLowerCase() === 'confirmed';
      });
    },
    pendingOrders() {
      return this.orders.filter(el => {
        return el.order_status.toLowerCase() === 'pending';
      });
    },
    transitOrders() {
      return this.orders.filter(el => {
        return el.order_status.toLowerCase() === 'in transit';
      });
    },
    orderCount() {
      const confirmedCount = this.confirmedOrders.length;
      const count = {};
      count.confirmed = this.confirmedOrders.length;
      count.transit = this.transitOrders.length;
      count.pending = this.pendingOrders.length;
      return count;
    },
    params() {
      const city = this.cities;
      const business_unit = this.businessUnits;
      const status = this.statusArray;

      const params = {
        business_unit,
        status,
        city,
      };
      for (const param in params) {
        if (params[param] === null || params[param] === undefined) {
          delete params[param];
        }
      }
      return params;
    },
  },
  watch: {
    getOrders(ordersData) {
      this.ordersExist = this.ordersAvailable(ordersData);
      this.returned = true;
      const currentPage = ordersData.pagination.page;
      this.nextPage = currentPage + 1;
      const currentOrders = this.orders;
      const currentOrdersData = this.orders;
      const pagination = ordersData.pagination;
      const newOrders = currentOrdersData.concat(ordersData.data);
      this.orders = newOrders;
      return this.updateOrderCount(this.orderCount);
    },
    getBusinessUnits(units) {
      return (this.companyUnits = units);
    },
    getOrderStatuses(statusArray) {
      this.orders = [];
      this.statusArray = statusArray;
      this.sendRequest(this.params);
      return (this.statusArray = statusArray);
    },
    getSelectedCities(cities) {
      this.orders = [];
      this.cities = cities;
      this.sendRequest(this.params);
      return (this.cities = cities);
    },
    getReorganizeStatus(status) {
      this.orders = [];
      this.sendRequest(this.params);
      this.updateReorganizeStatus(false);
    },
    bottom(bottom) {
      const params = this.isEmpty(this.params) ? '' : this.params;
      if (bottom && this.ordersExist) {
        this.returned = false;
        this.setOrders({
          page: this.nextPage,
          params,
        });
      }
    },
    getSelectedBusinessUnits(units) {
      this.orders = [];
      this.businessUnits = units;
      console.log('unitsselected', units);
      this.ordersExist = false;
      this.msg = 'There are no orders fitting these criteria';
      if (!this.isEmpty(units)) {
        this.sendRequest(this.params);
        this.ordersExist = true;
        this.msg = '';
      }
      return (this.businessUnits = units);
    },
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible();
      });
    }
  },
  mounted() {
    this.setOrders({
      page: 1,
    });
    // this.companyUnits
    // state.index = state.array.findIndex(x => x.word === 'you')
    // console.log('companyUnits', this.getBusinessUnits);
  },
  methods: {
    ...mapMutations({
      setOrdersObject: '$_orders/setOrdersObject',
      setDBUpdatedStatus: 'setDBUpdatedStatus',
      setOrderCount: 'setOrderCount',
      updateReorganizeStatus: 'setReorganizeStatus',
      updateOrderCount: 'setOrderCount',
    }),
    ...mapActions(['setOrders']),
    initialOrderRequest() {
      this.setOrders();
    },
    forceRerender() {
      this.rowComponentKey += 1;
    },
    mapVendorToBusinessUnit(array) {
      // vendorTypes = units[i].vendorTypes;

      console.log('array', array);
    },
    ordersAvailable(orders) {
      const data = orders.data;
      let status = true;
      if (data.length === 0) {
        status = false;
        this.msg = 'There are no more orders in this category';
      }
      return status;
    },

    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    showBasedOnStatus(status) {
      const orderStatus = status.toLowerCase().trim();
      return this.statusArray.includes(orderStatus);
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight - 100 < visible;
    },

    determineOrderColor(date, push_order) {
      const currentDate = this.getFormattedDate(new Date(), 'YYYY-MM-DD');
      const orderDate = this.getFormattedDate(date, 'YYYY-MM-DD');
      // .pull_attention
      let colorClass = 'tetst';
      if (orderDate < currentDate) {
        colorClass = 'pull_attention';
      }
      if (push_order) {
        colorClass = 'push_order';
      }
      return colorClass;
    },

    // eslint-disable-next-line prettier/prettier
    determineAmounts(amount, vendor_type_id, fixed_cost,  customer_min_amount,confirm_status,  ) {
      if (vendor_type_id === 20 && fixed_cost !== true) {
        if (confirm_status < 1) {
          amount = customer_min_amount;
        }
      }
      return amount;
    },
    // eslint-disable-next-line prettier/prettier
    displayAmount(currency, amount, vendor_type_id,fixed_cost, customer_min_amount,confirm_status,) {
      // eslint-disable-next-line prettier/prettier
      const computedAmount = this.determineAmounts(amount, vendor_type_id, fixed_cost, customer_min_amount, confirm_status,);
      currency = currency || '';
      amount = this.numberWithCommas(computedAmount);
      let amountString = `${currency} ${amount}`;
      if (vendor_type_id === 25 && confirm_status < 1) {
        amountString = '-';
      }
      return amountString;
    },
    viewOrder(orderNo) {
      this.show = orderNo;
    },
    handlePushInParent(pushobj) {
      const index = _.findIndex(this.orders, [
        'order_no',
        `${pushobj.order_no}`,
      ]);

      const units = this.companyUnits;
      const selectedUnits = this.businessUnits;
      let vendorTypes = [];
      const vendorID = pushobj.vendor_type_id;
      for (let i = 0; i < units.length; i++) {
        const types = units[i].vendorTypes;

        vendorTypes = vendorTypes.concat(types);
      }

      const existIndex = vendorTypes.findIndex(
        type => type.vendor_type_id === vendorID,
      );
      const unitArray = vendorTypes[existIndex];

      const vendorUnit = units.findIndex(
        unit => unit.business_unit_id === unitArray.business_unit_id,
      );
      const vendorAbbr = units[vendorUnit].abbr;
      if (selectedUnits !== null) {
        if (selectedUnits.includes(vendorAbbr.toLowerCase())) {
          this.displayPushedOrder(pushobj, index);
        }
      } else {
        this.displayPushedOrder(pushobj, index);
      }
    },
    displayPushedOrder(pushobj, index) {
      if (index >= 0) {
        this.orders.splice(index, 1);
        this.orders.unshift(pushobj);
      } else {
        this.orders.unshift(pushobj);
      }
    },
    sendRequest(payload) {
      const params = this.isEmpty(payload) ? '' : payload;
      this.setOrders({
        page: 1,
        params,
      });
      this.forceRerender();
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style scoped>
.label {
  text-transform: capitalize;
}
</style>
