<template>
  <tbody
    id="table_body_geg"
    v-infinite-scroll=""
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="limit"
  >
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
    <template v-for="order in orders">
      <tr
        :key="order.order_no"
        :class="determineOrderColor(order.time_placed)"
        @click="viewOrder(order.order_no)"
      >
        <td>
          <span
            :id="`tip_order_${order.order_no}`"
            data-toggle="tooltip"
            title=""
          >
            <span
              :id="`order_indicator_${order.order_no}`"
              :class="`label ${order.order_status}_ind`"
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
          {{ getFormattedDate(order.time_placed, 'hh.mm a DD/MM/YYYY') }}
          <span
            v-if="compareDates(order.time_placed)"
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
        :key="`details_${order.order_no}`"
        :id="`child_row_${order.order_no}`"
        v-if="show === order.order_no"
      >
        <TheLowerSlideComponent :orderno="order.order_no" />
      </tr>
    </template>
  </tbody>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import moment from 'moment';
import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';

PouchDB.plugin(PouchFind);

export default {
  name: 'TheRowComponent',
  components: {
    // TheLowerSlideComponent,
    TheLowerSlideComponent: () =>
      import('../OrdersLowerBit/TheLowerSlideComponent'),
  },
  data() {
    return {
      orders: [],
      bottom: false,
      nextPage: null,
      orderColorClass: '#fff',
      ordersDB: process.browser ? new PouchDB('orders') : '',
      newData: null,
      busy: false,
      show: false,
    };
  },
  computed: {
    ...mapGetters(['getOrders']),
    ...mapState(['delayLabels', 'vendorLabels', 'cityAbbrev']),
    autoLoadDisabled() {
      return this.loading || this.commentsData.length === 0;
    },
  },
  watch: {
    async getOrders(ordersData) {
      this.busy = true;

      const currentPage = ordersData.pagination.page;
      this.nextPage = currentPage + 1;
      const currentOrders = this.orders;
      let currentOrdersData;
      if (currentOrders.length === 0) {
        currentOrdersData = this.orders;
      } else {
        currentOrdersData = this.orders;
      }
      const pagination = ordersData.pagination;
      const newOrders = currentOrdersData.concat(ordersData.data);
      this.busy = false;

      const storeData = await this.updateOrders(newOrders, pagination);
      return (this.orders = newOrders);
    },
    bottom(bottom) {
      if (bottom) {
        this.setOrders({
          page: this.nextPage,
        });
      }
    },
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible();
      });

      this.destroyPouchDB();
    }
  },
  mounted() {
    this.setOrders({
      page: 1,
      //   params: {
      //     status: 'all',
      //     request_id: 11,
      //   },
    });
  },
  methods: {
    ...mapMutations({
      setOrdersObject: '$_orders/setOrdersObject',
    }),
    ...mapActions(['setOrders']),
    initialOrderRequest() {
      this.setOrders();
    },
    destroyPouchDB() {
      this.ordersDB
        .allDocs({ include_docs: true })
        .then(allDocs => {
          return allDocs.rows.map(row => {
            // eslint-disable-next-line no-underscore-dangle
            return { _id: row.id, _rev: row.doc._rev, _deleted: true };
          });
        })
        .then(deleteDocs => {
          return this.ordersDB.bulkDocs(deleteDocs);
        });
    },

    saveOrders(orders) {
      return this.ordersDB.post(orders, (err, res) => {
        if (err) {
          console.info('error creating new doc', err);
        }
        if (res) {
          console.info('new doc created', res);
        }
      });
    },
    // eslint-disable-next-line require-await
    async updateOrders(orders, pagination) {
      const storedOrders = await this.fetchOrders(); // fetch all stored data from pouchDB
      let totalOrders;
      let rev = '';
      let id = 1;
      if (storedOrders.length > 0) {
        // eslint-disable-next-line no-underscore-dangle
        rev = `${storedOrders[0].doc._rev}`;
        // eslint-disable-next-line no-underscore-dangle
        id = `${storedOrders[0].id}`;
      }
      const storeData = {
        data: orders,
        pagination,
        // eslint-disable-next-line no-underscore-dangle
        _id: `${id}`,
        _rev: `${rev}`,
      };
      try {
        const res = await this.ordersDB.put(storeData);
        return res.id;
      } catch (error) {
        return error;
      }
    },
    async fetchOrders() {
      const res = await this.ordersDB.allDocs({ include_docs: true });
      return res.rows;
    },
    async fetchSingleDBInstance(ID) {
      const res = await this.ordersDB.get(ID);
      return res;
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight - 100 < visible;
    },
    getFormattedDate(date, format) {
      return moment(date).format(format);
    },
    compareDates(date) {
      let currentDate = new Date();
      currentDate = this.getFormattedDate(currentDate, 'YYYY-MM-DD');
      const orderDate = this.getFormattedDate(date, 'YYYY-MM-DD');

      if (orderDate > currentDate) {
        return true;
      }
      return false;
    },
    determineOrderColor(date) {
      const currentDate = this.getFormattedDate(new Date(), 'YYYY-MM-DD');
      const orderDate = this.getFormattedDate(date, 'YYYY-MM-DD');
      // .pull_attention
      let colorClass = 'tetst';
      if (orderDate < currentDate) {
        colorClass = 'pull_attention';
      }
      return colorClass;
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    showCity(city) {
      let cityName;
      if (city.id === 1 || city.id === 2 || city.id === 3) {
        cityName = city.name;
      } else {
        cityName = 'Other';
      }
      return cityName;
    },

    smartify_display(myString, myLength) {
      if (parseInt(myString.length) > myLength) {
        const myTruncatedString = myString.substring(0, myLength);

        return `<span data-toggle="tooltip" title="${myString}">${myTruncatedString}  ...  <span>`;
      } else {
        return myString;
      }
    },
    viewOrder(orderNo) {
      this.show = orderNo;

      // console.log(this.componentName);
    },
  },
};
</script>
<style>
.pending_ind {
  background-color: #dd4b39 !important;
}
.Cancelled_ind {
  background-color: purple !important;
}
.transit_ind {
  background-color: #00a65a !important;
}
.confirmed_ind {
  background-color: #f39c12 !important;
}
.delivered_ind {
  background-color: #3c8dbc !important;
}
.picked_ind {
  background-color: #3c8dbc !important;
}
.request_ind {
  background-color: blueviolet !important;
}
.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: #777;
  border-radius: 10px;
}
.table > tbody > tr > td,
.table > tbody > tr > th,
.table > tfoot > tr > td,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}
.pull_attention {
  background-color: rgba(197, 2, 2, 0.18);
  border: 1px solid #f4f4f4;
}
table {
  cursor: pointer;
}
</style>
