/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: null,
  order_request_object: null,
  actionErrors: [],
  selectedStatus: [],
  disabledStatus: false,
});

export { state, getters, mutations, actions };
