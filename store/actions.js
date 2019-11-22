/* eslint-disable no-underscore-dangle */
// global functions (es6)
import axios from 'axios';
import moment from 'moment';
import Cookie from 'js-cookie';

export default {
  initAuth({ state, commit }, req) {
    let token = null;
    let refreshToken = null;
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
      refreshToken = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('refreshToken='))
        .split('=')[1];
    } else {
      token = localStorage.getItem('jwtToken');
      refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken || !token) {
        return;
      }
    }
    commit('setToken', token);
    commit('setRefreshToken', refreshToken);
  },
  async logout({ commit, state, dispatch }) {
    const customConfig = state.config;
    const url = customConfig.AUTH;
    const endpoint = 'logout';
    const refreshToken = localStorage.getItem('refreshToken');
    const params = { refresh_token: refreshToken };
    const payload = JSON.stringify(params);

    try {
      const response = await axios.post(`${url}${endpoint}`, payload);
      commit('clearToken');
      Cookie.remove('jwt');
      Cookie.remove('refreshToken');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('reloaded');

      return response;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
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
  async requestAxiosPost({ state, commit, dispatch }, payload) {
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
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });

      return error.response;
    }
  },
  // eslint-disable-next-line require-await
  async handleErrors({ state, commit }, error) {
    switch (error) {
      case 403:
        commit('setTokenExpiryStatus', true);
        break;
      default:
    }
  },
  async requestBusinessUnits({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}business-units`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_single_user({ state, dispatch }, payload) {
    const config = state.config;
    const userType = payload.userType;
    const userID = payload.userID;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}users/${userType}/${userID}`;
    try {
      const response = await axios.get(url, param);
      const userDetails = response.data;
      return userDetails;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_single_rider({ state }, payload) {
    const config = state.config;
    const riderID = payload.riderID;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}riders/${riderID}`;
    try {
      const response = await axios.get(url, param);
      const rider_details = response.data;
      return rider_details;
    } catch (error) {
      return error.response;
    }
  },
  async request_single_order({ state, dispatch }, orderNo) {
    const config = state.config;
    const url = `${config.ADONIS_API}orders/${orderNo}`;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    try {
      const response = await axios.get(url, param);
      const data = await response;
      const orderDetails = data.data;
      return orderDetails;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
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
    const userData = rootState.userData;
    payload.params._user_email = userData.payload.data.email;
    payload.params._user_id = userData.payload.data.admin_id;

    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },
  async request_nextTransfer({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
  async request_vendor_types({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async submit_custom_pricing({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async request_pending_distance_pricing_data({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      const pendingDistancePricing = [];
      if (res.data.status) {
        const pendingPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < pendingPricingDetails.length; i++) {
          pendingDistancePricing.push(
            pendingPricingDetails[i].distance_pricing,
          );
        }
        commit('updatePendingDistancePricing', pendingDistancePricing);
      }
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async request_pricing_data({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      const distancePricing = [];
      if (res.data.status) {
        const customPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < customPricingDetails.length; i++) {
          distancePricing.push(customPricingDetails[i].distance_pricing);
        }
        commit('updateDistancePricing', distancePricing);
      }
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async approve_distance_pricing_configs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async deactivate_distance_pricing_configs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async reject_distance_pricing_configs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async send_mail_to_admin({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
};
