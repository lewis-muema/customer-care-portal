<template>
  <tbody
    id="table_body_geg"
    v-infinite-scroll=""
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="limit"
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
    <template v-for="order in orders">
      <tr
        :key="order.index"
        :class="determineOrderColor(order.time_of_delivery)"
        @click="viewOrder(order.order_no)"
        v-show="showBasedOnStatus(order.order_status)"
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

import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
import TheLowerSlideComponent from '../OrdersLowerBit/TheLowerSlideComponent';
import rabbitMQcomponent from '../../../../rabbitMQ/rabbitMQComponent';

PouchDB.plugin(PouchFind);

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
      ordersDB: process.browser ? new PouchDB('orders') : '',
      newData: null,
      busy: false,
      show: false,
      statusArray: [
        'pending',
        'confirmed',
        'transit',
        'cancelled',
        'delivered',
      ],
    };
  },
  computed: {
    ...mapGetters(['getOrders', 'getOrderStatuses']),
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
      const currentOrdersData = this.orders;
      const pagination = ordersData.pagination;
      const newOrders = currentOrdersData.concat(ordersData.data);
      const storeData = await this.updateOrders(newOrders, pagination);
      const storedOrders = await this.fetchOrders();
      return (this.orders = storedOrders[0].doc.data);
    },
    getOrderStatuses(statusArray) {
      return (this.statusArray = statusArray);
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
    showBasedOnStatus(status) {
      const orderStatus = status.toLowerCase().trim();
      return this.statusArray.includes(orderStatus);
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

      if (index >= 0) {
        this.orders.splice(index, 1);
        this.orders.unshift(pushobj);
      } else {
        this.orders.unshift(pushobj);
      }
    },
  },
};
</script>
