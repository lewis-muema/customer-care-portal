import Vuex from 'vuex';
import axios from 'axios';
import orders from './modules/orders';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      breadcrumbs: [],
      value: 0,
    },

    getters,
    mutations,
    actions,
    modules: {
      orders,
    },
  });
};

export default createStore;
