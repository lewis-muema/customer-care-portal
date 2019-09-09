import Vue from 'vue';
import moment from 'moment';
import config from '~/config/configs';

Vue.mixin({
  data() {
    return {
      vendorTypes: {
        1: 'Bike',
        2: 'Pickup',
        3: 'Van',
        5: 'Cooler Van',
        6: 'Three Tonne Truck',
        10: 'Five Tonne Truck',
        12: 'Tuk Tuk',
        13: 'Seven Tonne Truck',
        14: 'Ten Tonne Truck',
        17: '14 Tonne Truck',
        18: '20 Tonne Truck',
        19: '24 Tonne Truck',
        20: '28 Tonne Truck',
        21: 'Runner',
        22: 'standard',
        25: 'Freight',
      },
      errorCodes: {
        403: 'Your access token has expired. Please logout and login again',
        500: 'Page not found',
      },
      trucksArray: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      order: {
        order_details: {
          order_no: 'AC92UM132-6BV',
          pickup_time: '2019-08-30T11:11:14.000Z',
          order_status: 1,
          confirm_status: 1,
          delivery_status: 0,
          dispute_status: 0,
          batch_no: null,
          price_type: 1,
          errand_mode: 'one_way',
          client_mode: 0,
          dispute_delivery_doc_status: 0,
          delivery_verification: {
            delivery_image: [
              {
                document_tag: 'delivery_note',
                name: 'Delivery Note or Invoice',
              },
            ],
            delivery_image_status: false,
            location_proximity: [
              {
                pick_up: 2,
              },
              {
                destination: 2,
              },
            ],
            location_proximity_status: true,
            physical_delivery_note_status: false,
            security_code: [
              {
                value: '1234',
              },
            ],
            security_code_status: false,
          },
          next_order: '',
          previous_order: '',
          distance_read: 2,
          load_weight: '',
          way_points: 1,
          carrier_type: 2,
          from_name: 'Sendy Office, Marsabit Plaza 3rd Floor',
          to_name: 'Adams Arcade Total',
          to: '-1.3005695,36.780826700000034',
          from: '-1.3001097,36.772822099999985',
          polyline: [
            'b}|Feem_FDn@FHH@T?C}AEmBOcIKyFC}AQ_ICMC]CqACOOYCCGKCK?MFQBCNo@SsL?KJ?b@C?\\HpC@Z@`@|@?F?',
          ],
        },
        rider_details: {
          name: 'PETER KAMAU',
          phone_no: '0722810566',
          serial_no: '89254021064102398573',
          vendor_type_id: 2,
          load_capacity: '',
          default_currency: 'KES',
          photo: '1521027207889id.jpg',
          rider_cost: 1250,
          rider_id: 1743,
          city_id: 1,
        },
        client_details: {
          corporate_name: '',
          name: 'Joyce Uganda',
          email: 'joyce@sendyit.com',
          phone_no: '+256710123123',
          default_currency: '',
        },
        payment_details: {
          cash_status: '',
          order_currency: '',
          economy_order_cost: '',
          cost: '',
          return_cost: '',
          fixed_cost: '',
          customer_min_amount: '',
          order_amount: '',
          extra_distance_amount: '',
          waiting_time_amount: '',
          insurance_amount: '',
          sendy_fee: '',
          cash_to_collect: '',
        },
        delivery_details: {
          rider_delivery_docs: '',
        },
        price_tiers: [
          {
            best_option: true,
            tier_name: 'Direct',
            cost: 1500,
            return_cost: 1600,
            discount_amount: 0,
          },
        ],
        delivery_logs: [
          {
            log_type: 1,
            log_time: '2019-08-30T10:26:17.000Z',
            description: 'Order AC92UM132-6BV created',
          },
          {
            log_type: 5,
            log_time: '2019-08-30T10:46:16.000Z',
            description:
              'Order AC92UM132-6BV for Joyce Uganda reallocated to PETER KAMAU',
          },
          {
            log_type: 2,
            log_time: '2019-08-30T10:46:16.000Z',
            description:
              'Order AC92UM132-6BV for Joyce Uganda was confirmed by PETER KAMAU',
          },
        ],
        dispute: {
          billing_data: {
            resolve_id: '',
            resolve_description: '',
          },
        },
        paths: [
          {
            name: 'Sendy Office, Marsabit Plaza 3rd Floor',
            label: 'Sendy Office, Marsabit Plaza 3rd Floor',
            flat_name: '',
            house_door: '',
            road: 'Marsabit Plaza,  Nairobi',
            other_description: '',
          },
          {
            name: 'Adams Arcade Total',
            label: '',
            flat_name: '',
            house_door: '',
            road: 'Next To Tuskys,  Ngong Rd',
            other_description: '',
          },
        ],
        notes_log: [
          {
            rider_notification_id: 39848,
            order_no: 'AC92UM132-6BV',
            rider_phone: '0709779779',
            msg: 'none',
            date_time: '2019-08-30T10:26:17.000Z',
            status: 1,
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    display_order_action_notification(status) {
      console.log('status', status);

      let displayClass = 'info';
      if (!status) {
        displayClass = 'danger';
      }
      console.log('status', displayClass);

      return displayClass;
    },
    splitWords(words) {
      const n = words.split(' ');
      return n[n.length - 1];
    },
    display_code_notification(message) {
      const code = Number(this.splitWords(message));
      const notification = this.errorCodes[code];
      return notification;
    },
    getOrderFormattedDate(date, requiredFormat) {
      const dt = moment(date).format(requiredFormat);
      return dt;
    },
    getFormattedDate(date, requiredFormat) {
      const dt1 = moment(date, 'YYYY-MM-DD HH:mm:ss');
      const dt = moment(dt1).format(requiredFormat);
      return dt;
    },
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    displayDateTime(date) {
      let displayString = '--';
      if (typeof date !== 'undefined') {
        displayString = this.getFormattedDate(date, 'h.mm a');
      }
      return displayString;
    },
    displayDateRange(dateRange) {
      let displayString = '--';
      if (typeof dateRange !== 'undefined') {
        const range = dateRange.split('to');

        const eta_split = dateRange.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const timeFrom = this.getFormattedDate(start, 'h.mm a');
        const timeTo = this.getFormattedDate(end, 'h.mm a');
        displayString = `${timeFrom} - ${timeTo}`;
      }
      return displayString;
    },
    // eslint-disable-next-line prettier/prettier
    determineOrderAmounts(amount, vendorTypeID, fixedCost,  customerMinAmount, confirmStatus) {
      const freightArray = [20, 25];
      if (freightArray.includes(vendorTypeID) && !fixedCost) {
        if (confirmStatus < 1) {
          amount = customerMinAmount;
        }
      }
      return amount;
    },
    determine_vendor_name(vendorTypeID) {
      const vendorTypes = this.vendorTypes;
      let vendorName;
      if (vendorTypes[vendorTypeID] === 'undefined') {
        vendorName = 'New vendor type!';
      } else {
        vendorName = vendorTypes[vendorTypeID];
      }
      return vendorName;
    },
    showCurrencyBasedAmounts(orderDetails, currencyConversions, amount) {
      const clientCurrency = orderDetails.client_details.default_currency;
      const riderCurrency = orderDetails.rider_details.default_currency;
      const orderCurrency = orderDetails.payment_details.order_currency;

      const clientConversionArray = this.getSpecificCurrencyConversion(
        orderCurrency,
        clientCurrency,
        currencyConversions,
      );
      const clientAmount = this.calculateConvertedAmount(
        clientConversionArray,
        amount,
        orderCurrency,
        clientCurrency,
      );
      const riderAmount = this.calculateConvertedAmount(
        clientConversionArray,
        amount,
        orderCurrency,
        riderCurrency,
      );

      amount = Number(amount).toLocaleString('en');
      return `${orderCurrency} ${amount}${clientAmount}${riderAmount}`;
    },

    getSpecificCurrencyConversion(
      fromCurrency,
      toCurrency,
      currency_conversions,
    ) {
      const res = currency_conversions.filter(conversion =>
        conversion.from_currency.includes(fromCurrency),
      );
      const newArray = res.filter(arr => arr.to_currency.includes(toCurrency));
      return newArray;
    },

    calculateConvertedAmount(
      conversionArray,
      orderAmount,
      orderCurrency,
      currency,
    ) {
      let convertedAmount = '';

      if (currency !== orderCurrency) {
        convertedAmount = conversionArray[0].rate * orderAmount;
        convertedAmount = Number(convertedAmount).toLocaleString('en');
        convertedAmount = `<span class="col-md-8 pull-right exchangerate"> ( ${currency} ${convertedAmount} )</span>`;
      }

      return convertedAmount;
    },
    display_conditional_amounts(orderDetails, currencyConversions, amount) {
      let displayAmount = 0;
      const convertedAmount = this.showCurrencyBasedAmounts(
        orderDetails,
        currencyConversions,
        amount,
      );
      if (amount > 0) {
        displayAmount = convertedAmount;
      }
      return displayAmount;
    },
    smartify_display(myString, myLength, orderNo) {
      if (myString !== null && parseInt(myString.length) > myLength) {
        const myTruncatedString = myString.substring(0, myLength);

        return `<span data-toggle="tooltip" title="${myString}">${myTruncatedString}  ...  <span>`;
      } else {
        return myString;
      }
    },
  },
});
