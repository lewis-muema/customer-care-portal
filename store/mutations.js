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
};
