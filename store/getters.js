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
};
