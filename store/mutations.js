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
  setSelectedCopNames(state, SelectedCopNames) {
    state.selectedCopNames = SelectedCopNames;
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
  updateLocationPricing(state, val) {
    state.locationPricingData = val;
  },
  updateDedicatedPricing(state, val) {
    state.dedicatedPricingData = val;
  },
  updatePendingDistancePricing(state, val) {
    state.pendingPricingData = val;
  },
  updatePendingLocationPricing(state, val) {
    state.pendingLocationData = val;
  },
  updatePendingContainerPricing(state, val) {
    state.pendingContainerData = val;
  },
  updateApproveStatus(state, val) {
    state.approveStatus = val;
  },
  updateApproverId(state, val) {
    state.approverId = val;
  },
  setTableData(state, val) {
    state.tableData = val;
  },
  setCustomPricingDetails(state, val) {
    state.customPricingDetails = val;
  },
  modifyCustomPricingDetails(state, val) {
    state.customPricingDetails[val.index][val.model][val.field] = val.value;
  },
  modifyCustomLocationDetails(state, val) {
    state.locationPricingData[val.index][val.field] = val.value;
  },
  modifyDedicatedDetails(state, val) {
    state.dedicatedPricingData[val.index][val.field] = val.value;
  },
  setLoginErrors(state, val) {
    state.loginErrors = val;
  },
  setOrderAmount(state, val) {
    state.orderAmount = val;
  },
  setPickUp(state, val) {
    state.pickup = val;
  },
  setDropoff(state, val) {
    state.dropoff = val;
  },
  setCurrency(state, val) {
    state.offlineOrderCurrency = val;
  },
  setPricingId(state, val) {
    state.pricingId = val;
  },
  setVat(state, val) {
    state.vatAmount = val;
  },
  setOrderNumber(state, val) {
    state.orderNumber = val;
  },
  setPartnerPhone(state, val) {
    state.partnerPhone = val;
  },
  setPartnerSn(state, val) {
    state.snNumber = val;
  },
  setNPSRequest(state, val) {
    state.npsRequest = val;
  },
  setNPSActiveGroup(state, val) {
    state.activeGroup = val;
  },
  setNPSCommentStatus(state, val) {
    state.commentStatus = val;
  },
  setActiveCountries(state, val) {
    state.activeCountries = val;
  },
  setActiveAccountTypes(state, val) {
    state.activeAccountTypes = val;
  },
  setActiveBusinessUnits(state, val) {
    state.activeBusinessUnits = val;
  },
  setCurrentNPSPage(state, val) {
    state.currentNPSPage = val;
  },
  setLastNPSPage(state, val) {
    state.lastNPSPage = val;
  },
  setNPSStartDate(state, val) {
    state.npsStartDate = val;
  },
  setNPSEndDate(state, val) {
    state.npsEndDate = val;
  },
  setnpsDateRange(state, val) {
    state.npsDateRange = val;
  },
  setNPSMetaData(state, val) {
    state.npsMetaData = val;
  },
  setNPSFilters(state, val) {
    state.npsFilters = val;
  },
  setCoupons(state, val) {
    state.npsFilters = val;
  },
};
