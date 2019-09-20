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
  updateSearchState(state, searchState) {
    state.search_state = searchState;
  },
  setSearchedOrder(state, val) {
    state.searchedOrder = val;
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
};
