// global functions (es6)
import axios from 'axios';
import moment from 'moment';
import Cookie from 'js-cookie';

export default {
  initAuth({ state, commit }, req) {
    let token = null;
    let expirationDate = null;
    if (req) {
      if (!req.headers.cookie) {
        return;
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('jwt='));
      if (!jwtCookie) {
        return;
      }
      token = jwtCookie.split('=')[1];
      expirationDate = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('tokenExpiration='))
        .split('=')[1];
    } else {
      token = localStorage.getItem('jwtToken');
      expirationDate = localStorage.getItem('tokenExpiration');

      if (new Date() > expirationDate || !token) {
        return;
      }
    }
    commit('setToken', token);
  },
  logout({ commit }) {
    commit('clearToken');
    Cookie.remove('jwt');
    Cookie.remove('tokenExpiration');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('tokenExpiration');
  },
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
    const jwtToken = localStorage.getItem('jwtToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };

    if (this.$env.APP_ENV !== 'production' && payload.apiKey) {
      backendKey = this.$env.BACKEND_KEY;
      endpoint = `${endpoint}?apikey=${backendKey}`;
    }

    const values = JSON.stringify(payload.params);

    try {
      const response = await axios.post(`${url}${endpoint}`, values, config);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  async request_single_user({ state }, payload) {
    const config = state.config;
    const userType = payload.userType;
    const userID = payload.userID;

    const url = `${config.ADONIS_API}users/${userType}/${userID}`;
    try {
      const response = await axios.get(url);
      const userDetails = response.data;
      return userDetails;
    } catch (error) {
      return error.response;
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
  async request_payment_methods({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },

  // eslint-disable-next-line require-await
  async perform_user_action({ rootState, dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },
};
