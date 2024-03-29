export default {
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
  setCities(state, cities) {
    state.cities = cities;
  },
  setBusinessUnits(state, businessUnits) {
    state.businessUnits = businessUnits;
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
    if (val === null && process.client) {
      val = localStorage.getItem('jwtToken');
    }
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
  setExchangeRates(state, exchangeRates) {
    state.exchangeRates = exchangeRates;
  },
  setCopTypes(state, copTypes) {
    state.copTypes = copTypes;
  },
  setAdmins(state, admins) {
    state.admins = admins;
  },
  setSurveys(state, surveys) {
    state.surveys = surveys;
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
  setCountries(state, countries) {
    state.countries = countries;
  },
  setActiveCountries(state, val) {
    state.activeCountries = val;
  },
  setVendorTypes(state, vendorTypes) {
    state.vendorTypes = vendorTypes;
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
  setCouponCounty(state, val) {
    state.couponCountry = val;
  },
  setSearchedCoupon(state, val) {
    state.searchedCoupon = val;
  },
  setProblematicOrderSearched(state, val) {
    state.problematicOrderSearched = val;
  },
  setAlertStatus(state, val) {
    state.alertStatus = val;
  },
  setAdminID(state, val) {
    state.adminID = val;
  },
  setActiveLiveOpsVendor(state, val) {
    state.activeLiveOpsVendor = val;
  },
  setLiveOpsRefresh(state, val) {
    state.liveOpsRefresh = val;
  },
  setTypingState(state, val) {
    state.typingState = val;
  },
  setAlertType(state, val) {
    state.alertType = val;
  },
  setSelectedVendors(state, val) {
    state.selectedVendors = val;
  },
  setSelectedAdmins(state, val) {
    state.selectedAdmins = val;
  },
  setSelectedAlerts(state, val) {
    state.selectedAlerts = val;
  },
  setSelectedOrder(state, val) {
    state.selectedOrder = val;
  },
  setSearchedOrderStatus(state, val) {
    state.searchedOrderStatus = val;
  },
  setCurrentPage(state, val) {
    state.currentPage = val;
  },
  setSelectedVendorType(state, val) {
    state.selectedVendorType = val;
  },
  setSelectedCountryCode(state, val) {
    state.selectedCountryCode = val;
  },
  setReallocationReasons(state, val) {
    state.reallocationReasons = val;
  },
  setActiveCancellationReasons(state, val) {
    state.activeCancellationReasons = val;
  },
  setDeactivatedCancellationReasons(state, val) {
    state.deactivatedCancellationReasons = val;
  },
  setCancellationActions(state, val) {
    state.cancellationActions = val;
  },
  setActiveCancellationConsequences(state, val) {
    state.activeCancellationConsequences = val;
  },
  setDeactivatedCancellationConsequences(state, val) {
    state.deactivatedCancellationConsequences = val;
  },
  setEnvironmentVariables(state, val) {
    const data = !val ? localStorage.getItem('environmentVariables') : val;
    state.environmentVariables = data;
  },
  setActivePage(state, val) {
    state.activePage = val;
  },
};
