/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  orders: [],
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
