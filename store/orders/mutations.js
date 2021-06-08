export default {
  setOrders(state, orders) {
    state.orders = orders;
  },
  setOrderDetails(state, val) {
    state.orderDetails = val;
  },
  setOrderStatuses(state, selectedStatus) {
    state.selectedStatus = selectedStatus;
  },
  setDisabledStatus(state, disabledStatus) {
    state.disabledStatus = disabledStatus;
  },
};
