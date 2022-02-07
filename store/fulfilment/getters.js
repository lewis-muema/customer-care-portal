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
  getFulfilmentType(state) {
    return state.fulfilmentType;
  },
  getPagination(state) {
    return state.pagination;
  },
  getTableData(state) {
    return state.tableData;
  },
  getHubs(state) {
    return state.hubs;
  },
  getSelectedHubs(state) {
    return state.selectedHubs;
  },
  getProcessingStatus(state) {
    return state.processing;
  },
  getRegions(state) {
    return state.regions;
  },
  getSelectedRegions(state) {
    return state.selectedRegions;
  },
  getCheckedOrders(state) {
    return state.checkedOrders;
  },
  getSelectedStatus(state) {
    return state.selectedStatus;
  },
  getSelectedCountry(state) {
    return state.selectedCountry;
  },
  getHubDialog(state) {
    return state.hubDialog;
  },
  getTableDetailKeyMetric(state) {
    return state.tableDetailKeyMetrics;
  },
  getTableDetails(state) {
    return state.tableDetails;
  },
  getStatusMapping(state) {
    return state.statusMapping;
  },
  getVehicles(state) {
    return state.vehicles;
  },
  getAgentVehicleType(state) {
    return state.vehicles_type;
  },
  getBatchChildOrderDetails(state) {
    return state.batchChildOrderData;
  },
  getRemoveOrderStoreValue(state) {
    return state.remove_order_state;
  },
  getStatusChanged(state) {
    return state.statusChanged;
  },
  getSupportedCountries(state) {
    return state.supported_countries;
  },
  getBatchDetailsDialogState(state) {
    return state.batch_details_dialog_state;
  },
  getSellerPage(state) {
    return state.seller_active_page;
  },
};
