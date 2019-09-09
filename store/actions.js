// global functions (es6)
import axios from 'axios';
import moment from 'moment';

export default {
  setBreadCrumbs({ commit }) {
    const breadcrumbsObject = {
      peer: {
        name: 'Peer',
        description: 'clients',
        mainName: 'Home',
        category: 'Clients',
        subCategory: 'Peer',
      },

      biz: {
        name: 'biz',
        description: 1,
        mainName: 'dfff',
        category: '',
        subCategory: '',
      },
    };
    const routeName = $nuxt.$route.name;
    commit('setbreadcrumbs', breadcrumbsObject.peer);
  },
  async requestAxiosPost({ state, commit }, payload) {
    const customConfig = state.config;
    const url = customConfig[payload.app];
    let endpoint = payload.endpoint;
    let backendKey = null;
    const jwtToken = state.jwtToken;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };
    if (process.env.DOCKER_ENV !== 'production' && payload.apiKey) {
      backendKey = customConfig.BACKEND_KEY;
      endpoint = `${endpoint}?apikey=${backendKey}`;
    }
    const values = JSON.stringify(payload.params);

    try {
      const response = await axios.post(`${url}${endpoint}`, values, config);
      return response;
    } catch (error) {
      return error.message;
    }
  },
  async request_single_order({ state }, orderNo) {
    const config = state.config;
    const url = `${config.ADONIS_API}orders/${orderNo}`;
    try {
      const response = await axios.get(url);
      const data = await response;
      const orderDetails = data.data;
      return orderDetails;
    } catch (error) {
      return error.message;
    }
  },
  async request_dispatch_list({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
};
