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
};
