export default {
  setOrders(_state, payload) {
    _state.orders = payload;
  },
  setOrderActivity(_state, payload) {
    _state.orderActivity = payload;
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
