/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  orderDetails: { orderNo: 'joy' },
  orders: null,
};

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions,
};
