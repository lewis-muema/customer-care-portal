// States
export const state = () => ({
  toggleSidebar: false,
});

// mutations
export const mutations = {
  // eslint-disable-next-line no-shadow
  TOGGLE_SIDEBAR(state) {
    state.toggleSidebar = !state.toggleSidebar;
  },
};

// actions
export const actions = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
};

// Getters
export const getters = {
  // eslint-disable-next-line no-shadow
  toggleSidebar: state => state.toggleSidebar,
};
