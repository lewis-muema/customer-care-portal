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
