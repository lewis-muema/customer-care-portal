export default {
  setbreadcrumbs(state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs;
  },
  updateValue(state, payload) {
    state.value = payload;
  },
};
