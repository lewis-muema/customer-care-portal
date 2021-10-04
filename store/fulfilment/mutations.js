export default {
  setOrders(state, payload) {
    state.orders = payload;
  },
  setOrderActivity(state, payload) {
    state.orderActivity = payload;
  },
  setFulfilmentType(state, value) {
    state.fulfilmentType = value;
  },
  setTableProps(state, array) {
    state.tableProps = array;
  },
};
