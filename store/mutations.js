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
};
