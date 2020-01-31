export default {
  // ...apix.getGetters(),

  breadcrumbs(state) {
    return state.breadcrumbs;
  },
  getNotification(state) {
    return state.notification;
  },
  getSearchedOrder(state) {
    return state.searchedOrder;
  },
  getBizUser(state) {
    return state.searchedBizUser;
  },
  getPeerUser(state) {
    return state.searchedPeerUser;
  },
  getRider(state) {
    return state.searchedRider;
  },
  getUser(state) {
    return state.searchedUser;
  },
  getOrderColumns(state) {
    return state.orderColumns;
  },
  getAuthenticationToken(state) {
    return state.jwtToken;
  },
  isAuthenticated(state) {
    return state.jwtToken !== null;
  },
  getSession(state) {
    return state.userData;
  },
  getOrderStatuses(state) {
    return state.selectedStatus;
  },
  getSearchState(state) {
    return state.searchState;
  },
  getSelectedBusinessUnits(state) {
    return state.selectedBusinessUnits;
  },
  getSelectedCities(state) {
    return state.selectedCities;
  },
  getDBUpdatedStatus(state) {
    return state.dbUpdated;
  },
  getUserActionSuccess(state) {
    return state.actionSuccess;
  },
  getReorganizeStatus(state) {
    return state.reorganizeStatus;
  },
  getOrderCount(state) {
    return state.orderCount;
  },
  getTokenExpiryStatus(state) {
    return state.tokenExpired;
  },
  getHelpScoutToken(state) {
    return state.helpScoutToken;
  },
  getSectionView(state) {
    return state.section;
  },
  getAddPricingState(state) {
    return state.addPricing;
  },
  getFirstPricingState(state) {
    return state.firstPricing;
  },
  getEditStatus(state) {
    return state.editStatus;
  },
  getViewStatus(state) {
    return state.viewDetails;
  },
  getSummaryStatus(state) {
    return state.viewSummary;
  },
  getConfiguredDistancePricing(state) {
    return state.distancePricingData;
  },
  getConfiguredLocationPricing(state) {
    return state.locationPricingData;
  },
  getPendingDistancePricing(state) {
    return state.pendingPricingData;
  },
  getPendingLocationPricing(state) {
    return state.pendingLocationData;
  },
  getApproveStatus(state) {
    return state.approveStatus;
  },
  getApproverId(state) {
    return state.approverId;
  },
  getTableData(state) {
    return state.tableData;
  },
  getCustomPricingDetails(state) {
    return state.customPricingDetails;
  },

  getActionErrors(state) {
    return state.actionErrors;
  },
  getActionClass(state) {
    return state.actionClass;
  },

  getloginErrors(state) {
    return state.loginErrors;
  },
};
