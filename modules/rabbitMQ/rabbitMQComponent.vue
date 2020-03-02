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

let _ = require('lodash');

export default {
  name: 'rabbitMQComponent',
  data() {
    return {
      client: null,
      new_ws: null,
      orders: [],
      pushes: [],
      orderNo: null,
      destination: null,
      cityname: '',
    };
    /**
     * Function for debugging rabbitMQ
     */
    // this.client.debug = function(str) {
    //   console.log(str);
    // };
  },

  computed: {
    ...mapState(['config']),
    url() {
      return this.config.RABBITMQ_URL;
    },
    headers() {
      const params = {
        login: this.config.BROKER_USER,
        passcode: this.config.BROKER_PASS,
      };
      return params;
    },
  },
  methods: {
    ...mapActions({
      getcitydetails: 'getCity',
    }),
    /**
     * This the callback called after the websocket connection to rabbitMQ has been established
     * which then subscribes to the exchange for order pushes.
     */
    connectCallback(message) {
      console.log('RabbitMQ is connected');
      const exchangeStr = this.client.subscribe(
        '/exchange/order_pushes/sendy.orders.ke',
        ({ body }) => {
          this.order_body = JSON.parse(body);
          this.onmessage(this.order_body);
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
      this.client.debug = function(str) {};
      this.client.reconnect_delay = 5000;
      setTimeout(() => {
        this.client.connect(
          this.headers,
          () => {
            this.connectCallback();
          },
          () => {
            this.errorCallback();
          },
        );
      }, 5000);
    },

    getRiderAmount(
      riderCost,
      insurance,
      servicefee,
      orderAmount,
      vat_amount,
      partner_amount,
      orderStatus,
    ) {
      const riderAmount =
        orderAmount + riderCost - (vat_amount + insurance + servicefee);
      if (partner_amount) {
        return orderStatus == 'price request' || orderStatus == 'pending'
          ? riderAmount
          : partner_amount;
      }

      return riderAmount;
    },
    /**
     * This is the callback that works on the messages/pushes received from the subscription to
     * the exchange. It then runs a check for the status of the order and if it exists on pouchdb then either storing or
     * updating it on the database
     */
    async onmessage() {
      this.order_push = this.order_body.result[0];
      this.orderNo = this.order_push.order_no;
      const ordernumber = this.order_push.order_no;
      const riderCost = this.order_push.rider_cost;
      const insurance = this.order_push.insurance_amount;
      const servicefee = this.order_push.sendy_fee;
      const orderAmount = this.order_push.amount;
      const partner_amount = this.order_push.partner_amount;
      const orderCountryCode = this.order_push.country_codes;
      const vat_amount = this.order_push.rider_details.rider_vat_compliant
        ? this.order_push.vat_amount
        : 0;
      const orderStatus = this.determineOrderStatus(this.order_push);
      this.determinePaymentMethod(this.cashStatus);
      this.deteremineOrderType(this.priceType);
      await this.getCity(this.order_push.order_details.values.city_id);
      const pushobj = new Object();
      pushobj.client_name = this.order_push.user_name;
      pushobj.distance_read = this.order_push.order_details.values.distance_read;
      pushobj.from_name =
        this.order_push.path.length > 1
          ? this.order_push.path[0].name
          : this.order_push.path[0][0].name;
      pushobj.order_amount = this.order_push.amount;
      pushobj.order_currency = this.order_push.price_details.currency;
      pushobj.order_no = this.order_push.order_no;
      pushobj.order_status = this.determineOrderStatus(this.order_push);
      pushobj.pay_cash_on_delivery = this.order_push.cash_status;
      pushobj.price_type = this.order_push.order_details.values.price_type;
      pushobj.rider_amount = this.getRiderAmount(
        riderCost,
        insurance,
        servicefee,
        orderAmount,
        vat_amount,
        partner_amount,
        orderStatus,
      );
      pushobj.rider_name = this.order_push.rider_name;
      pushobj.time_of_delivery = this.order_push.date_time.includes('.')
        ? this.order_push.date_time.split('.')[0]
        : this.order_push.date_time;
      pushobj.time_placed = this.order_push.date_time.includes('.')
        ? this.order_push.date_time.split('.')[0]
        : this.order_push.date_time;
      pushobj.to_name =
        this.order_push.path.length > 1
          ? this.order_push.path[1].name
          : this.order_push.path[0][1].name;
      pushobj.vendor_type_id = this.order_push.vendor_type;
      pushobj.orderCountryCode = this.order_push.country_codes;
      pushobj.push_order = true;
      pushobj.city_name = this.cityname;
      this.handlePush(pushobj);
    },

    handlePush(pushobj) {
      this.$emit('pushedSomething', pushobj);
    },
    async getCity(city_id) {
      if (this.cityname.length <= 1) {
        try {
          const res = await this.getcitydetails(city_id);
          this.cityname = res.city_name;
          return this.cityname;
        } catch (error) {
          error;
        }
      } else {
        return this.cityname;
      }
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
          return this.deliveryStatus(order_push);
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

    /**
     * This removes the default logging by rabbitMQ
     */
    this.client.debug = function(str) {};
  },
};
</script>
