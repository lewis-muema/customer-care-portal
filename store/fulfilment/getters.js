export default {
  getOrders(state) {
    return state.orders;
  },
  getTableProps(state) {
    return state.tableProps;
  },
  getSearchedEntity(state) {
    return state.searchedEntity;
  },
  getSearchState(state) {
    return state.searchState;
  },
  getSearchingStatus(state) {
    return state.isSearching;
  },
};
