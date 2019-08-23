/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const environment = process.env.DOCKER_ENV;
const customConfigsVar = process.env.customConfigs.customConfig;
const customConfig = customConfigsVar[environment];
const jwtToken = process.env.jwtToken;
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
  customConfig,
  jwtToken,
  order: null,
  order_request_object: null,
};

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions,
};
