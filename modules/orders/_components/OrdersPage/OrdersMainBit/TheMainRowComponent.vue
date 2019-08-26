<template>
  <tbody id="table_body_geg">
    <tr v-if="orders.length === 0" id="initial_data_request_show">
      <td colspan="9">
        <div id="initial_load_box">Requesting for orders ...</div>
      </td>
    </tr>
    <tr v-for="order in orders.data" :key="order.order_no">
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
      <td>
        {{ order.client_name }}
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
          <span v-if="vendorLabels[order.vendor_type_id]">{{
            vendorLabels[order.vendor_type_id]
          }}</span>
          &nbsp;
          <img
            :src="
              'https://images.sendyit.com/web_platform/vendor_type/side/v2/' +
                order.vendor_type_id +
                '.svg'
            "
            height="14"
            style="float: right; image-rendering: auto;height:18px"
          />
        </span>
      </td>
      <td>
        {{ getFormattedDate(order.time_placed) }}
        <span
          v-if="compareDates(order.time_placed)"
          title="Scheduled for tomorrow"
          class="fa fa-clock-o pull-right"
          style="color:deeppink; font-weight:100;"
        >
        </span>
      </td>
      <td>{{ order.from_name }}</td>
      <td>{{ order.to_name }}</td>
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
  </tbody>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
import objectMerge from 'object-merge';
import mergeByKey from 'array-merge-by-key';
import _ from 'lodash';

PouchDB.plugin(PouchFind);

export default {
  name: 'TheRowComponent',
  components: {
    // TheLowerSlideComponent,
  },
  data() {
    return {
      orders: {},
      bottom: false,
      nextPage: null,
      ordersDB: process.browser ? new PouchDB('orders') : '',
      newData: null,
      cityAbbrev: {
        Nairobi: 'nbi',
        Kisumu: 'ksm',
        Mombasa: 'msa',
        Other: 'other',
      },
      vendorLabels: {
        6: '3T',
        10: '5T',
        13: '7T',
        14: '10T',
        17: '14T',
        18: '20T',
        19: '24T',
        20: '28T',
        25: 'F',
      },
    };
  },
  // pouch: {
  //   // The simplest usage. queries all documents from the "todos" pouch database and assigns them to the "todos" vue property.
  //   todos: {
  //     /* empty selector */
  //   },
  // },
  computed: {
    ...mapGetters(['getOrders']),
    autoLoadDisabled() {
      return this.loading || this.commentsData.length === 0;
    },
  },
  watch: {
    async getOrders(ordersData) {
      const currentPage = ordersData.pagination.page;
      this.nextPage = currentPage + 1;
      const storedOrders = await this.fetchOrders(); // fetch all stored data from pouchDB
      const storedDataID = await this.updateOrders(storedOrders, ordersData); // store data pouchDB
      console.log('updateDB', storedDataID);
      const currentOrderData = await this.fetchSingleDBInstance(storedDataID);
      console.log('stored', storedOrders);
      console.log('returned', ordersData);
      console.log('currentOrderData', currentOrderData);

      // console.log('docID', docID);

      return (this.orders = currentOrderData);
    },
    bottom(bottom) {
      if (bottom) {
        this.setOrders({
          page: this.nextPage,
        });
        console.log('bottom is here');
      }
    },
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible();
      });

      this.destroyPouchDB();
      //   window.addEventListener('beforeunload', () => {
      //     // event.returnValue = 'Write something';
      //     console.log('i am refreshing');
      //   });
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

    console.log('data', this.todos);
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
    getFormattedDate(date) {
      return moment(date).format('hh.mm a DD/MM/YYYY');
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
    async updateOrders(storedOrders, requestedOrders) {
      console.log('requestedOrders', requestedOrders);
      const currentPage = requestedOrders.pagination.page;
      let totalOrders;
      let rev = '';
      let id = currentPage;
      if (storedOrders.length > 0) {
        totalOrders = storedOrders[0].doc.data;
        totalOrders = this.addNewOrdersToStore(
          storedOrders[0].doc.data,
          requestedOrders.data,
        );
        // eslint-disable-next-line no-underscore-dangle
        rev = `${storedOrders[0].doc._rev}`;
        // eslint-disable-next-line no-underscore-dangle
        id = `${storedOrders[0].id}`;
      } else {
        totalOrders = requestedOrders.data;
      }
      const storeData = {
        data: totalOrders,
        pagination: requestedOrders.pagination,
        // eslint-disable-next-line no-underscore-dangle
        _id: `${id}`,
        _rev: `${rev}`,
      };
      console.log('stored data to store', storeData);
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
    addNewOrdersToStore(storedOrders, newOrders) {
      for (let i = 0; i < newOrders.length; i++) {
        storedOrders.push(newOrders[i]);
      }
      return storedOrders;
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      //   console.log('scrollY', scrollY);
      const visible = document.documentElement.clientHeight;
      //   console.log('visible', visible);
      //   console.log('visible+scrollY', visible + scrollY);

      const pageHeight = document.documentElement.scrollHeight;
      //   console.log('pageHeight', pageHeight);
      //   console.log('pageHeight -2 ', pageHeight - 20);

      const bottomOfPage = visible + scrollY >= pageHeight;
      //   console.log('bottomOfPage', bottomOfPage);

      return bottomOfPage || pageHeight < visible;
    },
    compareDates(date) {
      let currentDate = new Date();
      currentDate = moment(currentDate).format('YYYY-MM-DD');
      const orderDate = moment(date).format('YYYY-MM-DD');

      if (orderDate > currentDate) {
        return true;
      }
      return false;
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
      console.log('ttttttt', typeof cityName);
      if (city.id === 1 || city.id === 2 || city.id === 3) {
        cityName = city.name;
      } else {
        cityName = 'Other';
      }

      // const cityDisplay = ``;
      return cityName;
    },
  },
};
</script>
<style>
/* .pending_ind {
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
} */
</style>
