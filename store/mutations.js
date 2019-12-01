export default {
  // ...apix.getMutations(),

  setbreadcrumbs(state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs;
  },
  setNotification(state, notification) {
    state.notification = notification;
  },
  setErrors(state, errors) {
    state.errors = errors;
  },
  setActionErrors(state, val) {
    state.actionErrors = val;
  },
  setActionClass(state, val) {
    state.actionClass = val;
  },
  setSelectedBusinessUnits(state, selectedBusinessUnits) {
    state.selectedBusinessUnits = selectedBusinessUnits;
  },
  setSelectedCities(state, selectedCities) {
    state.selectedCities = selectedCities;
  },
  setSearchState(state, searchState) {
    state.searchState = searchState;
  },
  setSearchedOrder(state, val) {
    state.searchedOrder = val;
  },
  setSearchedBizUser(state, val) {
    state.searchedBizUser = val;
  },
  setSearchedPeerUser(state, val) {
    state.searchedPeerUser = val;
  },
  setSearchedRider(state, val) {
    state.searchedRider = val;
  },
  setSearchedUser(state, val) {
    state.searchedUser = val;
  },
  setToken(state, val) {
    state.jwtToken = val;
  },
  setRefreshToken(state, val) {
    state.refreshToken = val;
  },
  clearToken(state) {
    state.jwtToken = null;
  },
  setSession(state, session) {
    state.userData = session;
  },
  setOrderStatuses(state, val) {
    state.selectedStatus = val;
  },
  setDBUpdatedStatus(state, val) {
    state.dbUpdated = val;
  },
  setUserActionSuccess(state, val) {
    state.actionSuccess = val;
  },
  setReorganizeStatus(state, val) {
    state.reorganizeStatus = val;
  },
  setOrderCount(state, val) {
    state.orderCount = val;
  },
  setTokenExpiryStatus(state, val) {
    state.tokenExpired = val;
  },
  setHelpScoutTokenExpiryStatus(state, val) {
    state.helpScoutTokenExpired = val;
  },
  setHelpScoutToken(state, val) {
    state.helpScoutToken = val;
  },
  setSectionView(state, val) {
    state.section = val;
  },
  updatePricing(state, val) {
    state.addPricing = val;
  },
  setFirstPricing(state, val) {
    state.firstPricing = val;
  },
  updateEditStatus(state, val) {
    state.editStatus = val;
  },
  updateViewStatus(state, val) {
    state.viewDetails = val;
  },
  updateSummaryStatus(state, val) {
    state.viewSummary = val;
  },
  updateDistancePricing(state, val) {
    state.distancePricingData = val;
  },
  updatePendingDistancePricing(state, val) {
    state.pendingPricingData = val;
  },
  updateApproveStatus(state, val) {
    state.approveStatus = val;
  },
  updateApproverId(state, val) {
    state.approverId = val;
  },
};
