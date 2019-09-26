import Vue from 'vue';
import moment from 'moment';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import config from '~/config/configs';

Vue.mixin({
  data() {
    return {
      userImage: config.USER_IMAGE,
      riderDeliveryImg: config.RIDER_DELIVERY_IMG,
      orderColumns: [
        'Status',
        'Client',
        'Rider',
        'Time',
        'Pick up',
        'Delivery',
        'Amount',
        'Rider Amount',
      ],
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
      logTypesColors: {
        1: 'fa-get-pocket bg-green',
        2: ' fa-thumbs-up bg-aqua',
        3: 'fa-road bg-blue',
        4: 'fa-check bg-green',
        5: 'fa-reply bg-yellow',
        6: 'fa-close bg-red',
        7: 'fa-calendar bg-purple',
        10: 'fa-envelope bg-orange',
        11: 'fa-envelope bg-blue',
        14: 'fa-envelope bg-red',
      },
      customerInfo: [
        { code: '1', reason: 'More information' },
        { code: '2', reason: 'Delivery delay' },
        { code: '3', reason: 'Customer not reachable' },
        { code: '4', reason: 'Customer feedback' },
      ],
      departments: [
        { code: '1', department: 'Operations' },
        { code: '2', department: 'Customer Support' },
      ],
      peerUser: {
        user_details: {
          user_email: 'missvicky254@gmail.com',
          user_id: 80239,
          user_phone: '+254790723348',
          date_signed_up: '2019-09-22 07:30:48.0',
          default_currency: 'KES',
          user_name: 'Vicky Mulema',
        },
        delivey_list: [
          {
            order_no: 'AS458X454-62F',
            time_stamp: '2019-09-23 11:23:29.0',
            rider_details: {
              name: 'Denis',
            },
            path: {
              from: 'machakos',
              to: 'machakos',
            },
          },
          {
            order_no: 'AS458X454-62F',
            time_stamp: '2019-09-23 11:23:29.0',
            rider_details: {
              name: 'Denis',
            },
            path: {
              from: 'bbbb',
              to: 'machakos',
            },
          },
        ],
        payments: [
          {
            rb: -1400,
            amount: -200,
            date_time: '2016-04-01 16:34:28.0',
            description: 'Transfer from Current',
            pay_type: 'Payin',
            pay_method: 'System',
            txn: 'VYUFZNUPBLH',
            status: 'Completed',
          },
        ],
      },
      riders_data: {
        phone_no: '0723049879',
        running_bal: 136,
        delivery_detail: [
          {
            from_name: 'Simba & Simba Advocates',
            Address: 'Loita St, Nairobi, Kenya',
            to_name: 'Loresho Ridge Estate',
            user_name: 'Loise Mbarire',
            confirm_status: 1,
            confirm_status_name: 'Confirmed',
            order_status: 1,
            delivery_status_name: 'Transit',
            delivery_status: 2,
          },
        ],
        payments: {
          savings_list: {
            running_balance: -40000,
            paylist: [
              {
                rb: -34700,
                amount: -200,
                date_time: '2019-05-03 08:14:54.0',
                description: 'Transfer from Current',
                pay_type: 'Payin',
                pay_method: 'System',
                txn: 'FZ1ZQKIGM5G',
                status: 'Completed',
              },
            ],
          },
          loan_list: {
            running_balance: 26126,
            paylist: [
              {
                rb: 17826,
                amount: -1000,
                date_time: '2019-04-12 23:00:00.0',
                description: 'Transfer from Current',
                pay_type: 'Payin',
                pay_method: 'System',
                txn: 'MHMIG2TZ4LL',
                status: 'Completed',
              },
            ],
          },
          current_list: {
            running_balance: 136.20000000000073,
            paylist: [
              {
                rb: -3750.7999999999993,
                amount: -270,
                date_time: '2019-09-20 14:36:39.0',
                description: 'delivery',
                pay_type: 'Payin',
                pay_method: 'System',
                txn: 'AR96WQ796-UW1',
                status: 'Completed',
              },
            ],
          },
          rider_status: 'Active',
          carrier_type: 1,
          city_name: 'Nairobi',
          tracker: 1,
          rider_id: 79,
          email: 'geoffoloo@gmail.com',
          vendor_type: 1,
          photo: 'geoffrey.jpg',
          savings_bal: -40000,
          rider_stat: 1,
          rider_name: 'Geoffrey Oloo',
          alloc_cop_id:
            '122,27,77,131,241,346,375,541,3,890,665,1517,1517,1364,1364,415,1603,1603,1687,415,415,1779,1603,1891,1891,1891,1979,1891,3137',
          incentiveBalance: 6678,
          position: {
            status: false,
          },
          default_currency: 'KES',
          city_id: 1,
          exclusivity_status: 0,
        },
      },
      bizUser: {
        user_details: {
          cop_name: 'Sugarcane Caribbean Food',
          cop_id: 929,
          cop_email: 'kcreavalle@sugarcane.co.ke',
          cop_phone: '0722598850',
          account_manager: 'Njeri',
          approved: 1,
          date_signed_up: '2016-03-21 20:19:17.0',
          channel_name: 'Other (specify below)',
          cop_type_name: 'Food',
          payment_option: 1,
          cop_contact_person: 'Kathleen Creavalle',
          city_name: 'Nairobi',
          cop_address: 'none',
          country_name: 'Kenya',
          cop_category: 0,
          sales_agent: 0,
          strict_allocation: 0,
          credit_period: 15,
          default_currency: 'KES',
        },
        invoice_receivers: [
          {
            name: 'test person 1',
            email: 'test@person1.com',
          },
          {
            name: 'test person 2',
            email: 'test@person2.com',
          },
        ],

        cop_type_list: [
          {
            cop_type_id: 1,
            name: 'Ecommerce',
          },
        ],
        rider_list: [
          {
            rider_id: 1,
            rider_name: 'Sendy Driver',
            phone_no: '07333',
            rider_stat: 1,
            carrier_type: 0,
            phone_no_1: '89254021004056320520',
          },
        ],
        delivey_list: [
          {
            order_no: 'AS458X454-62F',
            time_stamp: '2019-09-23 11:23:29.0',
            rider_details: {
              name: 'Denis',
            },
            path: {
              from: 'machakos',
              to: 'machakos',
            },
          },
          {
            order_no: 'AS458X454-62F',
            time_stamp: '2019-09-23 11:23:29.0',
            rider_details: {
              name: 'Denis',
            },
            path: {
              from: 'bbbb',
              to: 'machakos',
            },
          },
        ],
        payments: [
          {
            rb: -1400,
            amount: -200,
            date_time: '2016-04-01 16:34:28.0',
            description: 'Transfer from Current',
            pay_type: 'Payin',
            pay_method: 'System',
            txn: 'VYUFZNUPBLH',
            status: 'Completed',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ session: 'getSession' }),
    userData() {
      return this.session.payload.data;
    },
  },
  methods: {
    display_order_action_notification(status) {
      let displayClass = 'success';
      if (!status) {
        displayClass = 'danger';
      }

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
    displayAmount(currency, amount, vendor_type_id,fixed_cost, customer_min_amount,confirm_status) {
      // eslint-disable-next-line prettier/prettier
      const computedAmount = this.determineOrderAmounts(amount, vendor_type_id, fixed_cost, customer_min_amount, confirm_status);
      currency = currency || '';
      amount = this.numberWithCommas(computedAmount);
      let amountString = `${currency} ${amount}`;
      if (vendor_type_id === 25 && confirm_status < 1) {
        amountString = '-';
      }
      return amountString;
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
    smartify_display(myString, myLength) {
      if (myString !== null && parseInt(myString.length) > myLength) {
        const myTruncatedString = myString.substring(0, myLength);

        return `<span data-toggle="tooltip" title="${myString}">${myTruncatedString}  ...  <span>`;
      } else {
        return myString;
      }
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
  },
});
