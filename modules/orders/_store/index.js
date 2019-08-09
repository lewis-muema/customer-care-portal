/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
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
  sampleData: {
    pagination: {
      total: 33301,
      perPage: 10,
      page: 1,
      lastPage: 3331,
    },
    data: [
      {
        order_no: 'AC27VQ958-DBP',
        order_status: 'Cancelled',
        client_name: 'Toni Gathoni hefhsefhs',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'anthony ngethe',
        vendor_type_id: 1,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 0,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-XXX',
        order_status: 'Pending',
        client_name: 'Toni Gathoni hdbfhsdfuhs',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Evans Omondi',
        vendor_type_id: 2,
        time_placed: '2019-07-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Toyota Tsusho Fertilizer Afric  ... ',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 0,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-ZZZ',
        order_status: 'Confirmed',
        client_name: 'Toni Gathoni treeem',
        pay_cash_on_delivery: false,
        price_type: 'Standard',
        rider_name: 'Sendy Rider',
        vendor_type_id: 3,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-YYY',
        order_status: 'Delivered',
        client_name: 'Toni Gathoni Toni Gathoni',
        pay_cash_on_delivery: true,
        price_type: 'Standard',
        rider_name: 'Evanson Biwott',
        vendor_type_id: 6,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 3,
          name: 'Kisumu',
        },
      },
      {
        order_no: 'AC27VQ958-PPP',
        order_status: 'Picked',
        client_name: 'Toni Gathoni mmmmm',
        pay_cash_on_delivery: false,
        price_type: 'Standard',
        rider_name: 'Sendy Rider',
        vendor_type_id: 10,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 2,
          name: 'Mombasa',
        },
      },
      {
        order_no: 'AC27VQ958-TTT12',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 12,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 25052355,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-TTT14',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 14,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 5,
          name: 'Kampala',
        },
      },
      {
        order_no: 'AC27VQ958-TTT17',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 17,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-TTT20',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 20,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 25777777777,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 0,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-TTT21',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 21,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-TTT22',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 22,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
      {
        order_no: 'AC27VQ958-TTT25',
        order_status: 'In Transit',
        client_name: 'Jackqueline Ingairu',
        pay_cash_on_delivery: false,
        price_type: 'Express',
        rider_name: 'Sendy Rider',
        vendor_type_id: 25,
        time_placed: '2019-08-04T11:42:07.000Z',
        from_name: 'Kenyatta Hospital',
        to_name: 'Kikuyu',
        order_currency: 'KES',
        order_amount: 250000000000,
        rider_amount: 259,
        distance_read: 21,
        confirm_status: 1,
        fixed_cost: false,
        customer_min_amount: 40000,
        city: {
          id: 1,
          name: 'Nairobi',
        },
      },
    ],
  },

  orders: [],
  order_request_object: null,
};

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions,
};
