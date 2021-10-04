export default {
  setOrders(_state, payload) {
    _state.orders = payload;
  },
  setOrderActivity(_state, payload) {
    _state.orderActivity = payload;
  },
  setPagination(_state, payload) {
    _state.pagination = payload;
  },
};
