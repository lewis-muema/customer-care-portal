/* eslint no-shadow: ["error", { "allow": ["state"] }] */
const state = {
  orderDetails: { orderNo: 'AC2728669-I1C' },
};

const getters = {
  orderDetails(state) {
    return state.orderDetails;
  },
};

const mutations = {
  setOrderDetails(state, orderDetails) {
    state.orderDetails = orderDetails;
  },
};

const actions = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
