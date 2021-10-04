export default {
  getOrders(state) {
    return state.orders;
  },
  getTableProps(state) {
    return state.tableProps;
  },
  getPagination(state) {
    return state.pagination;
  },
};
