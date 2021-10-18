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
  setTableData(state, payload) {
    state.tableData = payload;
  },
  setHubs(_state, payload) {
    _state.hubs = payload;
  },
  setSelectedHubs(_state, payload) {
    _state.selectedHubs = payload;
  },
  setProcessingStatus(_state, payload) {
    _state.processing = payload;
  },
  setRegions(_state, payload) {
    _state.regions = payload;
  },
  setSelectedRegions(_state, payload) {
    _state.selectedRegions = payload;
  },
  setCheckedOrders(_state, payload) {
    _state.checkedOrders = payload;
  },
  setSelectedStatus(_state, payload) {
    _state.selectedStatus = payload;
  },
  resetHubDialog(state, val) {
    state.hubDialog = val;
  },
};
