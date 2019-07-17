import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
    },
    mutations: {
      clearToken(state) {
        state.token = null;
      },
    },
    actions: {},
    getters: {},
  });
};

export default createStore;
