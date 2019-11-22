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
      localStorage.removeItem('helpscoutExpiryTime');
      localStorage.removeItem('helpscoutTokenRequested');
      localStorage.removeItem('helpscoutAccessToken');

      commit('setHelpScoutToken', null);

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
  // eslint-disable-next-line require-await
  async request_helpscoute_post({ state, commit, dispatch }, payload) {
    const customConfig = state.config;
    const url = customConfig[payload.url];
    const authorization = payload.params.authorization;
    const customHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (authorization) {
      customHeaders.Authorization = `Bearer ${payload.params.token}`;
      delete payload.params.token;
    }
    delete payload.params.authorization;

    const config = {
      headers: customHeaders,
    };

    const values = JSON.stringify(payload.params);

    try {
      const response = await axios.post(`${url}`, values, config);
      return response;
    } catch (error) {
      payload.params.error = error.response.status;
      const err = await dispatch('handleHelpScoutErrors', payload.params, {
        root: true,
      });
      return error.response;
    }
  },
  // eslint-disable-next-line require-await
  async request_helpscout_token({ rootState, dispatch, commit }) {
    const url = 'HELPSCOUT_TOKEN';
    const apiKey = this.$env.HELP_SCOUT_API_KEY;
    const client_secret = this.$env.HELP_SCOUT_SECRET_KEY;
    const grant_type = 'client_credentials';
    const client_id = this.$env.HELP_SCOUT_CLIENT_ID;
    const payload = {
      url,
      params: {
        client_secret,
        client_id,
        grant_type,
        authorization: false,
      },
    };

    try {
      const res = await dispatch('request_helpscoute_post', payload);
      const token = res.data;

      const expiresIn = token.expires_in;
      const expiryDatetime = moment()
        .add(expiresIn, 'seconds')
        .format('LLLL');
      token.expiryDatetime = expiryDatetime;
      commit('setHelpScoutToken', token);

      localStorage.setItem('helpscoutTokenRequested', 1);
      localStorage.setItem('helpscoutAccessToken', token.access_token);
      localStorage.setItem('helpscoutExpiryTime', expiryDatetime);
      return res.data;
    } catch (error) {
      return error;
    }
  },
  // eslint-disable-next-line require-await
  async refresh_helpscout_token({ state, dispatch, commit }, payload) {
    const customConfig = state.config;
    const refresh_token = payload.refreshToken;

    const url = 'HELPSCOUT_REFRESH';
    const grant_type = 'refresh_token';
    const client_id = this.$env.HELP_SCOUT_CLIENT_ID;
    const client_secret = this.$env.HELP_SCOUT_SECRET_KEY;

    const values = {
      url,
      params: {
        refresh_token,
        client_id,
        client_secret,
        grant_type,
        authorization: true,
      },
    };

    try {
      const res = await dispatch('request_helpscoute_post', values);
      if (res.status === 200) {
        localStorage.removeItem('helpscoutrefreshToken');

        const token = res.data;
        const expiresIn = token.expires_in;
        const expiryDatetime = moment()
          .add(expiresIn, 'seconds')
          .format('LLLL');
        token.expiryDatetime = expiryDatetime;
        commit('setHelpScoutToken', token);
        localStorage.setItem('helpscoutAccessToken', token.access_token);
        localStorage.setItem('helpscoutrefreshToken', token.refresh_token);
        localStorage.setItem('helpscoutExpiryTime', token.expiryDatetime);

        return token.access_token;
      }
    } catch (error) {
      return error;
    }
  },

  // eslint-disable-next-line require-await
  async ticket_action({ state, dispatch, commit }, payload) {
    const url = 'HELPSCOUT_CONVERSATIONS';
    payload.authorization = true;

    const values = {
      url,
      params: payload,
    };
    try {
      const res = await dispatch('request_helpscoute_post', values);
      payload.error = res.status;
      const err = await dispatch('handleHelpScoutErrors', payload, {
        root: true,
      });
    } catch (error) {
      payload.error = error.response.status;

      const err = await dispatch('handleHelpScoutErrors', payload, {
        root: true,
      });
      return error;
    }
  },
  // eslint-disable-next-line require-await
  async retrieveHelpscoutToken({ state, dispatch, commit }) {
    let accessToken = localStorage.getItem('helpscoutAccessToken');
    const expiryDateTime = localStorage.getItem('helpscoutExpiryTime');
    const currentDate = moment().format('LLLL');
    if (expiryDateTime === currentDate) {
      localStorage.removeItem('helpscoutAccessToken');
      localStorage.removeItem('helpscoutExpiryTime');
      commit('setHelpScoutToken', null);
      const token = await dispatch('request_helpscout_token');
      accessToken = token.access_token;
    }
    return accessToken;
  },
  // eslint-disable-next-line require-await
  async create_ticket({ state, dispatch, commit }, payload) {
    const token = await dispatch('retrieveHelpscoutToken');
    payload.authorization = true;
    payload.token = token;
    await dispatch('ticket_action', payload);
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
  // eslint-disable-next-line require-await
  async handleHelpScoutErrors({ state, commit, dispatch }, payload) {
    const error = payload.error;
    switch (error) {
      case 201:
        // eslint-disable-next-line no-case-declarations
        const arr = ['Ticket created successfully'];
        commit('setActionErrors', arr);
        commit('setActionClass', 'success');
        break;
      case 400:
        // eslint-disable-next-line no-case-declarations
        const arr1 = [
          'Failed to create Ticket. Try again. If persist, contact Tech support',
        ];
        commit('setActionErrors', arr1);
        commit('setActionClass', 'success');
        break;
      case 401:
        // eslint-disable-next-line no-case-declarations
        const refreshToken = localStorage.getItem('helpscoutrefreshToken');
        await dispatch('refresh_helpscout_token', { refreshToken });

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
};
