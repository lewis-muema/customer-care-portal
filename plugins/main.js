import Vue from 'vue';
import moment from 'moment';

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
    };
  },
  created() {},
  methods: {
    getFormattedDate(date, requiredFormat) {
      const dt = moment(date, 'YYYY-MM-DD HH:mm:ss');
      return dt.format(requiredFormat);
    },
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
      if (parseInt(myString.length) > myLength) {
        const myTruncatedString = myString.substring(0, myLength);

        return `<span data-toggle="tooltip" title="${myString}">${myTruncatedString}  ...  <span>`;
      } else {
        return myString;
      }
    },
    singleOrder() {
      const order = {
        order_details: {
          order_no: 'AC57XS781-ED7',
          pickup_time: '2019-08-19T16:34:42.000Z',
          order_status: 1,
          confirm_status: 0,
          delivery_status: 0,
          dispute_status: 0,
          batch_no: null,
          price_type: 1,
          errand_mode: 'one_way',
          client_mode: 0,
          dispute_delivery_doc_status: 0,
          delivery_verification: '',
          next_order: '',
          previous_order: '',
          distance_read: '7',
          load_weight: '28',
          no_of_loaders: '3',
          way_points: '1',
          carrier_type: '',
        },
        rider_details: {
          name: 'Sendy Rider',
          phone_no: '+254714454473',
          serial_no: 89254021074127500000,
          vendor_type_id: 20,
          load_capacity: '28',
          default_currency: 'KES',
          photo: 'zfkkxkvhgf-tim.jpeg',
          rider_cost: 0,
          amount: 3000,
        },
        client_details: {
          corporate_name: 'Sendy',
          name: 'Faithshopy',
          email: 'faithshop@gmail.com',
          phone_no: '+254778987789',
          default_currency: 'UGX',
        },
        payment_details: {
          cash_status: false,
          order_currency: 'KES',
          economy_order_cost: 8270,
          cost: 8270,
          return_cost: 8760,
          fixed_cost: false,
          customer_min_amount: 483,
          order_amount: 3000,
          extra_distance_amount: 0,
          waiting_time_amount: 0,
          insurance_amount: 200,
          sendy_fee: 0,
          cash_to_collect: 0,
        },
        price_tiers: [
          {
            best_option: true,
            tier_name: 'testing',
            discount_amount: 0,
            cost: 4555,
            return_cost: 3455,
            eta: 2700,
          },
        ],
        delivery_log: [
          {
            log_type: 1,
            description: 'Order AC31ZN137-CBD created',
            log_time: '2019-04-12 16:29:18.0',
          },
          {
            log_type: 5,
            description:
              'Order AC31ZN137-CBD for Faith shop reallocated to Kebati Dereva',
            log_time: '2019-04-12 17:21:15.0',
          },
          {
            log_type: 2,
            description:
              'Order AC31ZN137-CBD for Faith shop was confirmed by Kebati Dereva',
            log_time: '2019-04-12 17:21:15.0',
          },
          {
            log_type: 11,
            description:
              'Kebati, You are OFFLINE thus we are unable to calculate the distance traveled. This will reduce the amount paid for this trip. Please put the phone ONLINE to receive full payment for the trip.',
            log_time: '2019-04-12 17:45:00.0',
          },
          {
            log_type: 11,
            description:
              'Kebati, You are OFFLINE thus we are unable to calculate the distance traveled. This will reduce the amount paid for this trip. Please put the phone ONLINE to receive full payment for the trip.',
            log_time: '2019-04-12 18:00:00.0',
          },
          {
            log_type: 11,
            description:
              'Kebati, You are OFFLINE thus we are unable to calculate the distance traveled. This will reduce the amount paid for this trip. Please put the phone ONLINE to receive full payment for the trip.',
            log_time: '2019-04-12 18:15:00.0',
          },
          {
            log_type: 3,
            description:
              'Order AC31ZN137-CBD for Faith shop collected by Kebati Dereva',
            log_time: '2019-04-30 13:50:04.0',
          },
        ],
        time_metrics: {
          actual_delivery_duration: 0,
          lifetime_delay: 0,
          estimated_delivery_duration: 0,
          estimated_lifetime: 0,
          pickup_delay: 0,
          delivery_delay: 0,
          actual_lifetime: 0,
          estimated_pickup_duration: 0,
          actual_pickup_duration: 0,
        },
        delivery_details: {
          rider_delivery_image: '',
          rider_delivery_docs: '',
        },
        dispute: {
          billing_data: ' { resolve_id, resolve_description }',
        },
        path: [
          {
            name: 'Marsabit Plaza',
            Label: 'Marsabit Plaza',
            FlatName: '',
            Road: 'Marsabit Plaza,  Nairobi',
            Otherdescription: '',
          },
        ],
        notes_log: [
          {
            msg: 'NOTES: These are the notes',
          },
        ],
        delivery_verification: {
          physical_delivery_note_status: true,
          next_order: '',
          previous_order: 'AC68M8915-QXI',
        },
        rider_deliver_img: [
          {
            img: 'rider_dropoff//AC29WA232-R9A1.jpg',
            physical_delivery_note_status: 1,
            name: 'gg',
            waypoint_no: 1,
            delivery_image: [
              {
                images: ['AC29WA232-R9A1-delivery_note-0.jpg'],
                document_tag: 'delivery_note',
                name: 'Delivery Note',
              },
            ],
          },
        ],
      };
      return order;
    },
  },
});
