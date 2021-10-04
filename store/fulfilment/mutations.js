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
  setPagination(_state, payload) {
    _state.pagination = payload;
  },
  setSearchedEntity(_state, val) {
    _state.searchedEntity = val;
  },
  setSearchState(_state, searchState) {
    _state.searchState = searchState;
  },
  setSearchingStatus(_state, data) {
    _state.isSearching = data;
  },
};
