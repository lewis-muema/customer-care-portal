export default {
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
  getSearchState(state) {
    return state.searchState;
  },
  getCopTypes(state) {
    return state.copTypes;
  },
  getAdmins(state) {
    return state.admins;
  },
  getSurveys(state) {
    return state.surveys;
  },
  getBusinessUnits(state) {
    return state.businessUnits;
  },
  getCities(state) {
    return state.cities;
  },
  getSelectedBusinessUnits(state) {
    return state.selectedBusinessUnits;
  },
  getSelectedCopNames(state) {
    return state.selectedCopNames;
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
  getConfiguredDedicatedPricing(state) {
    return state.dedicatedPricingData;
  },
  getPendingDistancePricing(state) {
    return state.pendingPricingData;
  },
  getPendingLocationPricing(state) {
    return state.pendingLocationData;
  },
  getPendingContainerPricing(state) {
    return state.pendingContainerData;
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
  getloginErrors(state) {
    return state.loginErrors;
  },
  getActionErrors(state) {
    return state.actionErrors;
  },
  getActionClass(state) {
    return state.actionClass;
  },
  getOrderAmount(state) {
    return state.orderAmount;
  },
  getPickup(state) {
    return state.pickup;
  },
  getDropoff(state) {
    return state.dropoff;
  },
  getOrderCurrency(state) {
    return state.offlineOrderCurrency;
  },
  getPricingId(state) {
    return state.pricingId;
  },
  getVat(state) {
    return state.vatAmount;
  },
  getOrderNumber(state) {
    return state.orderNumber;
  },
  getPartnerNumber(state) {
    return state.partnerPhone;
  },
  getSnNumber(state) {
    return state.snNumber;
  },
  getNPSRequest(state) {
    return state.npsRequest;
  },
  getNPSActiveGroup(state) {
    return state.activeGroup;
  },
  getNPSCommentStatus(state) {
    return state.commentStatus;
  },
  getCountries(state) {
    return state.countries;
  },
  getActiveCountries(state) {
    return state.activeCountries;
  },
  getVendorTypes(state) {
    return state.vendorTypes;
  },
  getActiveAccountTypes(state) {
    return state.activeAccountTypes;
  },
  getActiveBusinessUnits(state) {
    return state.activeBusinessUnits;
  },
  getCurrentNPSPage(state) {
    return state.currentNPSPage;
  },
  getLastNPSPage(state) {
    return state.lastNPSPage;
  },
  getNPSDateRange(state) {
    return state.npsDateRange;
  },
  getNPSMetaData(state) {
    return state.npsMetaData;
  },
  getNPSFilters(state) {
    return state.npsFilters;
  },
  getCoupons(state) {
    return state.coupons;
  },
  getCouponCountry(state) {
    return state.couponCountry;
  },
  getSearchedCoupon(state) {
    return state.searchedCoupon;
  },
  getProblematicOrderSearched(state) {
    return state.problematicOrderSearched;
  },
  getTypingState(state) {
    return state.typingState;
  },
  getAlertStatus(state) {
    return state.alertStatus;
  },
  getAdminID(state) {
    return state.adminID;
  },
  getActiveLiveOpsVendor(state) {
    return state.activeLiveOpsVendor;
  },
  getLiveOpsRefresh(state) {
    return state.liveOpsRefresh;
  },
  getAlertType(state) {
    return state.alertType;
  },
  getSelectedVendors(state) {
    return state.selectedVendors;
  },
  getSelectedAdmins(state) {
    return state.selectedAdmins;
  },
  getSelectedAlerts(state) {
    return state.selectedAlerts;
  },
  getSelectedOrder(state) {
    return state.selectedOrder;
  },
  getSearchedOrderStatus(state) {
    return state.searchedOrderStatus;
  },
  getCurrentPage(state) {
    return state.currentPage;
  },
  getReallocationReasons(state) {
    return state.reallocationReasons;
  },
  getDisabledStatus(state) {
    return state.disabledStatus;
  },
  getActiveCancellationReasons(state) {
    return state.activeCancellationReasons;
  },
  getDeactivatedCancellationReasons(state) {
    return state.deactivatedCancellationReasons;
  },
  getCancellationActions(state) {
    return state.cancellationActions;
  },
  getActiveCancellationConsequences(state) {
    return state.activeCancellationConsequences;
  },
  getDeactivatedCancellationConsequences(state) {
    return state.deactivatedCancellationConsequences;
  },
  getEnvironmentVariables(state) {
    const val = !state.environmentVariables
      ? JSON.parse(localStorage.getItem('environmentVariables'))
      : state.environmentVariables;

    return val;
  },
  getActivePage(state) {
    return state.activePage;
  },
};
