/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const jwtToken = process.env.JWT_TOKEN;
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
  jwtToken,
  order: null,
  order_request_object: null,
  actionErrors: [],
};

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions,
};
