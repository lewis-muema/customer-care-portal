<template> </template>
<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
></script>
<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js"
></script>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import PouchDB from 'pouchdb-browser';
import PouchFind from 'pouchdb-find';
import TheLowerSlideComponent from '../orders/_components/OrdersPage/OrdersLowerBit/TheLowerSlideComponent';

var _ = require('lodash');
PouchDB.plugin(require('pouchdb-upsert'));

export default {
  name: 'rabbitMQComponent',
  components: {
    TheLowerSlideComponent,
  },
  data() {
    return {
      client: null,
      new_ws: null,
      orders: [],
      pushes: [],
      orderNo: null,
      destination: null,
      orderColorClass: '#fff',
      busy: false,
      show: false,
      ordersDB: process.browser ? PouchDB('orders') : '',
      headers: {
        login: 'production',
        passcode: 'Z_EQ-T5rO-oQVx-OqL2',
      },
      url: 'wss://prod-stomp.sendyit.com:15675/ws',
    };
    this.client.debug = function(str) {
      console.log(str);
    };
  },

  computed: {
    ...mapState(['delayLabels', 'vendorLabels', 'cityAbbrev']),
  },
  methods: {
    /**
     * This the callback called after the websocket connection to rabbitMQ has been established
     * which then subscribes to the exchange for order pushes.
     */
    connectCallback(message) {
      const exchangeStr = this.client.subscribe(
        '/exchange/order_pushes/sendy.orders.ke',
        ({ body }) => {
          this.order_body = JSON.parse(body);
          this.onmessage(this.order_body);
          // this.order_index(this.order_body.result[0].order_no);
        },
      );
    },
    /**
     * This the callback called whenever there is an error with the websocket connection to rabbitMQ.
     * This callback is responsible for reconnection by re-calling the connect method which reruns all
     * the methods from reconnection, subscribing and handling the message.
     */
    errorCallback() {
      console.log('Connection Dropped Trying to Reconnect');
      this.client = Stomp.client(this.url);
      this.client.connect(
        this.headers,
        () => {
          this.connectCallback();
        },
        () => {
          this.errorCallback();
        },
      );
    },

    /**
     * This is the callback that works on the messages/pushes received from the subscription to
     * the exchange. It then runs a check for the status of the order and if it exists on pouchdb then either storing or
     * updating it on the database
     */
    onmessage() {
      // console.log
      this.ordersDB.get('1').then(doc => {
        let storedData = doc;
        let orders = doc.data;
        this.order_push = this.order_body.result[0];
        console.log(JSON.stringify(this.order_push));
        const orderNumber = this.order_push.order_no;
        this.orderNo = orderNumber;
        const orderStatus = this.order_push.order_status;
        const city = this.order_push.order_details.values.city_id;
        const currency = this.order_push.price_details.currency;
        const riderName = this.order_push.rider_name;
        const distanceMetric = this.order_push.distance_read;
        const distance = this.order_push.order_details.values.distance_read;
        const clientName = this.order_push.user_name;
        const date = this.order_push.date_time;
        const vendorType = this.order_push.vendor_type;
        const pickup = this.order_push.path[0].name;
        const orderAmount = this.order_push.amount;
        const riderCost = this.order_push.rider_cost;
        const insurance = this.order_push.insurance_amount;
        const servicefee = this.order_push.sendy_fee;
        const destination = this.order_push.path[1].name;
        const priceType = this.order_push.order_details.values.price_type;
        const cashStatus = this.order_push.cash_status;
        this.determineOrderStatus(this.order_push);
        this.determinePaymentMethod(this.cashStatus);
        this.deteremineOrderType(this.priceType);
        const pushobj = new Object();
        pushobj.city = city;
        pushobj.client_name = clientName;
        pushobj.distance_read = distance;
        pushobj.from_name = pickup;
        pushobj.order_amount = orderAmount;
        pushobj.order_currency = currency;
        pushobj.order_no = orderNumber;
        pushobj.order_status = this.determineOrderStatus(this.order_push);
        pushobj.pay_cash_on_delivery = cashStatus;
        pushobj.price_type = priceType;
        pushobj.rider_amount = this.determineRiderAmount(
          orderAmount,
          riderCost,
          insurance,
          servicefee,
        );
        pushobj.rider_name = riderName;
        pushobj.time_of_delivery = date;
        pushobj.time_placed = date;
        pushobj.to_name = destination;
        pushobj.vendor_type_id = vendorType;

        this.pushes.push(pushobj);
        this.handlePush(pushobj);

        // console.log('This is the created object', pushobj);
        console.log('This is the array of the object', this.pushes);
        console.log('orderamount', orderAmount);
      });
    },

    handlePush(pushobj) {
      this.$emit('pushedSomething', pushobj);
    },

    deteremineOrderType(priceType) {
      if (priceType === 1) {
        return 'Standard';
      }
      return 'Express';
    },

    determinePaymentMethod(cashStatus) {
      if (cashStatus === 1) {
        return true;
      }
      return false;
    },

    determineRiderAmount(orderAmount, riderCost, insurance, servicefee) {
      let rideramount = orderAmount + riderCost - (insurance + servicefee);
      return rideramount;
    },

    determineOrderStatus(order_push) {
      console.log('This is the order', this.order_push);
      const status = this.order_push.status;
      const orderStatus = this.order_push.order_status;
      const confirmStatus = this.order_push.confirm_status;
      const deliveryStatus = this.order_push.delivery_status;
      if (status === 1) {
        if (orderStatus === 0 && confirmStatus === 0 && deliveryStatus === 0) {
          return 'price request';
        }
        if (orderStatus === 1 && confirmStatus === 0 && deliveryStatus === 0) {
          return 'pending';
        }
        if (orderStatus === 1 && confirmStatus === 1 && deliveryStatus === 0) {
          return 'confirmed';
        }
        if (orderStatus === 1 && confirmStatus === 1 && deliveryStatus === 2) {
          return 'In Transit';
        }
        if (orderStatus === 1 && confirmStatus === 1 && deliveryStatus === 3) {
          return 'delivered';
        }
      }
      return 'Cancelled';
    },
  },

  mounted() {
    this.client = Stomp.client(this.url);

    this.client.connect(
      this.headers,
      () => {
        this.connectCallback();
      },
      () => {
        this.errorCallback();
      },
    );

    console.log(this.client);
  },
};
</script>
