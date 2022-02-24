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
  setTableDataAppend(state, payload) {
    payload.forEach(order => {
      state.tableData.push(order);
    });
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
  setSelectedCountry(_state, payload) {
    _state.selectedCountry = payload;
  },
  resetHubDialog(state, val) {
    state.hubDialog = val;
  },
  setTableDetailKeyMetric(state, val) {
    state.tableDetailKeyMetrics = val;
  },
  setTableDetails(state, val) {
    state.tableDetails = val;
  },
  setStatusMapping(state, val) {
    state.statusMapping = val;
  },
  setVehicles(state, val) {
    state.vehicles = val;
  },
  setAgentVehicleType(state, val) {
    state.vehicles_type = val;
  },
  setBatchChildOrderDetails(state, val) {
    state.batchChildOrderData = val;
  },
  setRemoveOrderStoreValue(state, val) {
    state.remove_order_state = val;
  },
  setStatusChanged(state, val) {
    state.statusChanged = val;
  },
  setSupportedCountries(state, payload) {
    state.supported_countries = payload;
  },
  setBatchDetailsDialogState(state, payload) {
    state.batch_details_dialog_state = payload;
  },
  setSellerPage(state, payload) {
    state.seller_active_page = payload;
  },
  setMapDialogVisible(state, payload) {
    state.dialogVisible = payload;
  },
  setRouteDistance(state, payload) {
    state.routeDistance = payload;
  },
  setChosenHub(state, payload) {
    state.chosenHub = payload;
  },
  setSelectedDate(state, payload) {
    state.selectedDate = payload;
  },
  setSingleSellerPage(state, payload) {
    state.single_seller_page = payload;
  },
  setSellerInfo(state, payload) {
    state.seller_info = payload;
  },
  setSelectedDate(_state, payload) {
    _state.selectedDate = payload;
  },
  updateInvoiceSearchedEntity(_state, val) {
    _state.invoiceSearchedEntity = val;
  },
  updateSellerSearchedEntity(_state, val) {
    _state.sellerSearchedEntity = val;
  },
};
