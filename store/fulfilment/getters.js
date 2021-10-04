export default {
  getOrders(state) {
    return state.orders;
  },
  getTableProps(state) {
    return state.tableProps;
  },
  getFulfilmentType(state) {
    return state.fulfilmentType;
  },
};
