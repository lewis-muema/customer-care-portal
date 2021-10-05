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
};
