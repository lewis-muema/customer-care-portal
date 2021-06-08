/* eslint-disable no-underscore-dangle */
// global functions (es6)
import axios from 'axios';
import moment from 'moment';
import Cookie from 'js-cookie';
import qs from 'qs';

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
  clearCache({ commit }) {
    commit('clearToken');
    Cookie.remove('jwt');
    Cookie.remove('refreshToken');
    localStorage.clear();
    commit('setHelpScoutToken', null);
  },
  async logout({ state, dispatch }) {
    const customConfig = state.config;
    const url = customConfig.AUTH;
    const endpoint = 'logout';
    const refreshToken = localStorage.getItem('refreshToken');
    const params = { refresh_token: refreshToken };
    const payload = JSON.stringify(params);

    try {
      const response = await axios.post(`${url}${endpoint}`, payload);
      await dispatch('clearCache');
      return response;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      await dispatch('clearCache');
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
      return error.response;
    }
  },
  async request_helpscoute_patch({ state, commit, dispatch }, payload) {
    const customConfig = state.config;
    const url = customConfig[payload.url];

    await dispatch('request_helpscout_token');
    const token = localStorage.getItem('helpscoutAccessToken');

    const customHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    customHeaders.Authorization = `Bearer ${token}`;
    const config = {
      headers: customHeaders,
    };

    const values = JSON.stringify(payload.params);

    try {
      return await axios.patch(
        `${url}/${payload.conversationID}`,
        values,
        config,
      );
    } catch (error) {
      payload.params.error = error.response.status;
      return error.response;
    }
  },
  // eslint-disable-next-line require-await
  async request_helpscoute_get({ state, commit, dispatch }, payload) {
    const customConfig = state.config;
    const url = customConfig[payload.url];
    const authorization = await dispatch('request_helpscout_token');
    const token = localStorage.getItem('helpscoutAccessToken');

    const customHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (authorization) {
      customHeaders.Authorization = `Bearer ${token}`;
      delete payload.params.token;
    }
    delete payload.params.authorization;

    try {
      return await axios.get(`${url}?email=${payload.params.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      payload.params.error = error.response.status;
      return error.response;
    }
  },

  // eslint-disable-next-line require-await
  async log_cc_action({ rootState, dispatch, commit, state }, payload) {
    const customConfig = state.config;
    const userData = state.userData;

    const url = `${customConfig.ORDERS_APP}log_cc_action`;
    const jwtToken = localStorage.getItem('jwtToken');
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    payload.channel = 'customer_support_peer_biz';
    payload.data_set = 'cc_actions';
    payload.action_id = 23;
    payload._user_email = userData.payload.data.email;
    payload._user_id = userData.payload.data.admin_id;
    payload.action_user = userData.payload.data.name;

    const values = JSON.stringify(payload);

    try {
      return await axios.post(`${url}`, values, params);
    } catch (error) {
      payload.params.error = error.response.status;
      return error.response;
    }
  },
  // eslint-disable-next-line require-await
  async request_helpscout_token({ rootState, dispatch, commit }) {
    const url = 'HELPSCOUT_TOKEN';
    const apiKey = this.$env.HELP_SCOUT_API_KEY;
    const clientSecret = this.$env.HELP_SCOUT_SECRET_KEY;
    const grantType = 'client_credentials';
    const clientID = this.$env.HELP_SCOUT_CLIENT_ID;
    const payload = {
      url,
      params: {
        client_secret: clientSecret,
        client_id: clientID,
        grant_type: grantType,
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
      return token;
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
        token.expiryDatetime = moment()
          .add(expiresIn, 'seconds')
          .format('LLLL');
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
      await dispatch('handleHelpScoutErrors', payload, {
        root: true,
      });
      return res;
    } catch (error) {
      return error;
    }
  },
  // eslint-disable-next-line require-await
  async retrieveHelpscoutToken({ state, dispatch, commit }) {
    let accessToken = localStorage.getItem('helpscoutAccessToken');
    const expiryDateTime = localStorage.getItem('helpscoutExpiryTime');
    const currentDate = moment().format('LLLL');
    if (expiryDateTime < currentDate) {
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
    try {
      return await dispatch('ticket_action', payload);
    } catch (error) {
      return error;
    }
  },
  async createTicket({ rootState, dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },

  async requestAxiosPost({ state, commit, dispatch }, payload) {
    let endpoint = payload.endpoint;
    const app = payload.app;

    // Capture custom HTTP request actions via managed transactions.
    this._vm.$apm
      .startTransaction(`${endpoint}`, 'custom', { managed: true })
      .addLabels({ app });

    const customConfig = state.config;
    const url = customConfig[app];

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
      return await axios.post(`${url}${endpoint}`, values, config);
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });

      return error.response;
    }
  },
  async requestAxiosPatch({ state, commit, dispatch }, payload) {
    let endpoint = payload.endpoint;
    const app = payload.app;

    // Capture custom HTTP request actions via managed transactions.
    this._vm.$apm
      .startTransaction(`${endpoint}`, 'custom', { managed: true })
      .addLabels({ app });

    const customConfig = state.config;
    const url = customConfig[app];

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
      return await axios.patch(`${url}${endpoint}`, values, config);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
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
        commit('setActionClass', 'danger');
        break;
      case 401:
        try {
          // eslint-disable-next-line no-case-declarations
          const token = await dispatch('request_helpscout_token');
          commit('setHelpScoutToken', token);

          await localStorage.setItem(
            'helpscoutAccessToken',
            token.access_token,
          );
          await localStorage.setItem(
            'helpscoutExpiryTime',
            token.expiryDatetime,
          );
          await dispatch('create_ticket', payload);
        } catch (e) {
          return e;
        }

        break;
      case 403:
        try {
          // eslint-disable-next-line no-case-declarations
          const token = await dispatch('request_helpscout_token');
          commit('setHelpScoutToken', token);

          await localStorage.setItem(
            'helpscoutAccessToken',
            token.access_token,
          );
          await localStorage.setItem(
            'helpscoutExpiryTime',
            token.expiryDatetime,
          );
          await dispatch('getHelpscoutUser', payload);
        } catch (e) {
          return e;
        }
        break;

      default:
    }
  },
  async requestBusinessUnits({ state, commit, dispatch }) {
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
      commit('setBusinessUnits', response.data);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async setOrders({ state, commit, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}orders`;
    try {
      const response = await axios.get(url, param);
      commit('setOrders', response.data);
      console.log('setOrders>>>', response.data);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async requestOrdersMetaData({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}/orders/meta`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async requestRewards({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}rewards`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async requestPenalties({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}penalties`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async requestWarningMessages({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}warning_messages`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async explorer({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}explorer?phone=${payload}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
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
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_owner_statement({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async request_single_rider({ state, dispatch }, payload) {
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
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_single_vehicle({ state, dispatch }, payload) {
    const config = state.config;
    const vehicleID = payload.vehicleID;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}vehicles/${vehicleID}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_single_owner({ state, dispatch }, payload) {
    const config = state.config;
    const ownerID = payload.ownerID;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}owners/${ownerID}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
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
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.message;
    }
  },
  async custom_deliver({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async log_action({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async submit_fuel_advance({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async fuel_history_order({ state, dispatch }, payload) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}fuel_history/order/${payload.order_no}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async fuel_types({ state, dispatch }) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}aux/fuel/fuel-types`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async fuel_stations({ state, dispatch }) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}aux/fuel/fuel-stations`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async action_owner_request({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async edit_owner_request({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async fuel_advances({ state }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}aux/fuel/fuel-advances${payload.param}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async fuel_stats({ state }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}aux/fuel/dashboard${payload.param}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async max_advance({ state }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}aux/fuel/max-advance/${payload.order_no}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async fuel_history_cop({ state, dispatch }, payload) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}fuel_history/cop/${payload.cop_id}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async back_date_order_confirm({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
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
  async add_owner_vehicle({ state, dispatch }, payload) {
    const config = state.config;
    const url = `${config.AUTH}${payload.app}`;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    try {
      const response = await axios.post(url, payload.payload, param);
      const data = await response;
      return data.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.message;
    }
  },
  async allocate_rider_vehicle({ dispatch }, payload) {
    try {
      return await dispatch('requestAxiosPost', payload, { root: true });
    } catch (error) {
      return error;
    }
  },
  async allocate_order({ dispatch }, payload) {
    try {
      return await dispatch('requestAxiosPost', payload, { root: true });
    } catch (error) {
      return error;
    }
  },
  async change_order_status({ state, dispatch }, payload) {
    try {
      return await dispatch('requestAxiosPost', payload, { root: true });
    } catch (error) {
      return error;
    }
  },
  // eslint-disable-next-line require-await
  async perform_user_action({ rootState, dispatch, commit }, payload) {
    const userData = rootState.userData;
    payload.params.action_data._user_email = userData.payload.data.email;
    payload.params.action_data._user_id = userData.payload.data.admin_id;
    payload.params.action_data.action_user = userData.payload.data.name;

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
  async request_loan_types({ dispatch }, payload) {
    try {
      return await dispatch('requestAxiosPost', payload, { root: true });
    } catch (error) {
      return error;
    }
  },
  async requestAppVersion({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}version`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_vendor_types({ dispatch }, payload) {
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    try {
      const res = await dispatch('requestAxiosPost', payload, param, {
        root: true,
      });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async get_all_countries({ state, dispatch, commit }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}countries`;
    try {
      const response = await axios.get(url, headers);
      const activeCountries = response.data.filter(
        country => country.status === 1,
      );
      commit('setActiveCountries', activeCountries);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async getCity({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}cities/${payload}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async setCities({ state, commit, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}cities`;
    try {
      const response = await axios.get(url, param);
      commit('setCities', response.data);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
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
      let pendingDistancePricing = [];
      let pendingLocationPricing = [];
      let pendingContainerPricing = [];
      const pricingTableData = [];
      if (res.data.status) {
        const pendingPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < pendingPricingDetails.length; i += 1) {
          if (
            Object.prototype.hasOwnProperty.call(
              pendingPricingDetails[i],
              'location_pricing',
            )
          ) {
            pendingLocationPricing = pendingPricingDetails[i].location_pricing;
          }
          if (
            Object.prototype.hasOwnProperty.call(
              pendingPricingDetails[i],
              'container_pricing',
            )
          ) {
            pendingContainerPricing =
              pendingPricingDetails[i].container_pricing;
          }
          if (
            Object.prototype.hasOwnProperty.call(
              pendingPricingDetails[i],
              'distance_pricing',
            )
          ) {
            pendingPricingDetails[
              i
            ].distance_pricing.waiting_time_cost_per_min = (
              pendingPricingDetails[i].distance_pricing
                .waiting_time_cost_per_min * 60
            ).toFixed(0);
            pricingTableData.push(pendingPricingDetails[i].distance_pricing);
            pendingDistancePricing = pricingTableData;
          }
        }
        commit('setCustomPricingDetails', pendingPricingDetails);
        commit('updatePendingDistancePricing', pendingDistancePricing);
        commit('updatePendingLocationPricing', pendingLocationPricing);
        commit('updatePendingContainerPricing', pendingContainerPricing);
      } else {
        commit('updatePendingDistancePricing', pendingDistancePricing);
        commit('updatePendingLocationPricing', pendingLocationPricing);
        commit('updatePendingContainerPricing', pendingContainerPricing);
      }
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async request_pricing_data({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      let approverId = 0;
      let distancePricing = [];
      let locationPricing = [];
      const pricingTableData = [];
      if (res.data.status) {
        const customPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < customPricingDetails.length; i += 1) {
          if (
            Object.prototype.hasOwnProperty.call(
              customPricingDetails[i],
              'location_pricing',
            )
          ) {
            approverId = customPricingDetails[i].location_pricing[0].admin_id;
            locationPricing = customPricingDetails[i].location_pricing;
          }
          if (
            Object.prototype.hasOwnProperty.call(
              customPricingDetails[i],
              'container_pricing',
            )
          ) {
            approverId = customPricingDetails[i].container_pricing[0].admin_id;
            if (locationPricing.length > 0) {
              locationPricing = locationPricing.concat(
                customPricingDetails[i].container_pricing,
              );
            } else {
              locationPricing = customPricingDetails[i].container_pricing;
            }
          }
          if (
            Object.prototype.hasOwnProperty.call(
              customPricingDetails[i],
              'distance_pricing',
            )
          ) {
            approverId = customPricingDetails[i].admin_id;
            customPricingDetails[
              i
            ].distance_pricing.waiting_time_cost_per_min = (
              customPricingDetails[i].distance_pricing
                .waiting_time_cost_per_min * 60
            ).toFixed(0);
            pricingTableData.push(customPricingDetails[i].distance_pricing);
            distancePricing = pricingTableData;
          }
        }
        commit('updateLocationPricing', locationPricing);
        commit('updateDistancePricing', distancePricing);
        commit('setCustomPricingDetails', customPricingDetails);
        commit('updateApproverId', approverId);
      } else {
        commit('updateLocationPricing', locationPricing);
        commit('updateDistancePricing', distancePricing);
        commit('setCustomPricingDetails', []);
        commit('updateApproverId', approverId);
      }
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async pending_dedicated_pricing_data({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      const arrayData = [];
      if (res.data.status) {
        res.data.data.forEach(row => {
          if (row.status === 'Pending' || row.status === 'Active') {
            arrayData.push(row);
          }
        });
      }
      commit('updateDedicatedPricing', arrayData);
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
  async approve_location_pricing_configs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async approve_container_pricing_configs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async approve_pricing_configs({ dispatch, commit }, payload) {
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
  async deactivate_location_pricing({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async deactivate_container_pricing({ dispatch, commit }, payload) {
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
  async update_vat_config({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async create_reward({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async update_reward({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPatch', payload, { root: true });
      return res.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async add_reallocation_reason({ dispatch, commit }, payload) {
    try {
      return await dispatch('requestAxiosPost', payload, { root: true });
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async update_status_state({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const { id, status } = payload;
    const param = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}vendor-type-reallocation-reasons/${id}`;
    try {
      const response = await axios.put(url, { status }, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetch_set_reallocation_reason({ state, dispatch, commit }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const vendor_type = state.selectedVendorType;
    const country = state.selectedCountryCode;

    const url =
      country === null
        ? `${config.ADONIS_API}vendor-type-reallocation-reasons`
        : `${config.ADONIS_API}vendor-type-reallocation-reasons?vendor_type=${vendor_type}&country=${country}`;
    try {
      const response = await axios.get(url, headers);
      commit('setReallocationReasons', response.data.data);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetch_all_reallocation_reason({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}vendor-type-reallocation-reasons`;
    try {
      const response = await axios.get(url, headers);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetch_non_penalizing_data({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}order-reallocation-actions`;
    try {
      const response = await axios.get(url, headers);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async add_cancellation_reason({ dispatch, commit }, payload) {
    try {
      const response = await dispatch('requestAxiosPost', payload, {
        root: true,
      });
      dispatch('fetch_set_cancellation_reasons', payload.country_filter);
      return response;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async fetch_set_cancellation_reasons({ state, dispatch, commit }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const countryArray = [];
    payload.forEach(country => {
      countryArray.push(`&country=${country}`);
    });
    const countryQuery = countryArray.join('');
    const activatedUrl = `${config.ADONIS_API}cancellation-reasons/?status=1${countryQuery}`;
    const deactivatedUrl = `${config.ADONIS_API}cancellation-reasons/?status=2${countryQuery}`;

    try {
      const response = await axios.get(activatedUrl, headers);
      commit('setActiveCancellationReasons', response.data.data);

      const results = await axios.get(deactivatedUrl, headers);
      commit('setDeactivatedCancellationReasons', results.data.data);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async update_cancellation_reason({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const { cancellation_reason_id, country_filter } = payload;
    const param = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}cancellation-reasons/${cancellation_reason_id}`;
    try {
      const response = await axios.patch(url, payload, param);
      dispatch('fetch_set_cancellation_reasons', country_filter);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetch_cancellation_actions({ state, dispatch, commit }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}cancellation-actions`;

    try {
      const response = await axios.get(url, headers);
      commit('setCancellationActions', response.data.data);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async add_cancellation_consequences({ dispatch, commit }, payload) {
    try {
      const response = await dispatch('requestAxiosPost', payload, {
        root: true,
      });
      dispatch('fetch_set_cancellation_consequences', payload.country_filter);
      return response;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async fetch_set_cancellation_consequences(
    { state, dispatch, commit },
    payload,
  ) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const headers = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const countryArray = [];
    payload.forEach(country => {
      countryArray.push(`&country=${country}`);
    });
    const countryQuery = countryArray.join('');
    const activatedUrl = `${config.ADONIS_API}cancellation-consequences?status=1${countryQuery}`;
    const deactivatedUrl = `${config.ADONIS_API}cancellation-consequences/?status=0${countryQuery}`;

    try {
      const response = await axios.get(activatedUrl, headers);
      commit('setActiveCancellationConsequences', response.data.data);

      const results = await axios.get(deactivatedUrl, headers);
      commit('setDeactivatedCancellationConsequences', results.data.data);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async update_cancellation_consequences({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const { id, country_filter } = payload;
    const param = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}cancellation-consequences/${id}`;
    try {
      await axios.patch(url, payload, param);
      dispatch('fetch_set_cancellation_consequences', country_filter);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async request_tax_rates({ state, dispatch }) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}vat-rates`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async request_invoice_logs({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res;
  },

  async request_invoice_data({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res;
  },

  async create_offline_order({ dispatch, commit }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },

  async confirm_offline_order({ dispatch, commit }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },

  async pair_offline_order({ dispatch, commit }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },

  async pick_offline_order({ dispatch, commit }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },

  async complete_offline_order({ dispatch, commit }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
  async update_nps_tags({ state, dispatch }, payload) {
    const endpoint = payload.endpoint;
    const app = payload.app;
    const customConfig = state.config;
    const url = customConfig[app];
    const jwtToken = localStorage.getItem('jwtToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwtToken,
      },
    };

    const values = JSON.stringify(payload.params);
    try {
      return await axios.patch(`${url}${endpoint}`, values, config);
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_cancellation_options({ state, dispatch }) {
    const config = state.config;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    const url = `${config.ADONIS_API}cancel-reasons?platform=cc`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_refund_data({ dispatch }, payload) {
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    try {
      const res = await dispatch('requestAxiosPost', payload, param, {
        root: true,
      });
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  // eslint-disable-next-line require-await
  async unblock_rider({ rootState, dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },
  async requestTransactions({ rootState, dispatch }, payload) {
    const config = rootState.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const endpoint =
      payload.category === 'invoice-reversal' ? 'invoice' : 'txn';
    const searchkey =
      payload.category === 'invoice-reversal' ? 'invoice_no' : 'txn';

    const param = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.CUSTOMERS_APP}${endpoint}/?${searchkey}=${payload.referenceNumber}`;
    try {
      const response = await axios.get(url, param);
      return await response;
    } catch (error) {
      let err;
      switch (error.response.status) {
        case 403:
          // eslint-disable-next-line no-case-declarations
          await dispatch('handleErrors', error.response.status, {
            root: true,
          });
          break;
        case 400:
          err = {
            status: false,
            code: 400,
            message: `No such transaction: ${payload.referenceNumber}`,
          };
          break;
        default:
          break;
      }

      return err;
    }
  },
  async request_intercounty_destination_configs({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/destinations`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_intercounty_pickup_configs({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/pickups`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_pickup_cities({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/cities`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async create_pickup_config({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response.data;
    }
  },
  async request_route_data({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/routes`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async remove_intercounty_record({ state, dispatch }, payload) {
    const config = state.config;
    const userData = state.userData;

    const jwtToken = localStorage.getItem('jwtToken');

    const values = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
      data: {
        _user_email: userData.payload.data.email,
        _user_id: parseInt(userData.payload.data.admin_id, 10),
        action_user: userData.payload.data.name,
      },
    };

    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/${payload.route}/${payload.id}`;
    try {
      return await axios.delete(url, values);
    } catch (error) {
      return error.response.data;
    }
  },
  async update_intercounty_record({ state, dispatch }, payload) {
    const config = state.config;
    const userData = state.userData;

    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };

    payload.params._user_email = userData.payload.data.email;
    payload.params._user_id = parseInt(userData.payload.data.admin_id, 10);
    payload.params.action_user = userData.payload.data.name;

    const values = JSON.stringify(payload.params);

    const url = `${config.PRICING_SERVICE}pricing/inter_county_config/${payload.route}/${payload.id}`;
    try {
      return await axios.put(url, values, param);
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async update_intercounty_delivery_state({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const values = JSON.stringify(payload.params);

    const url = `${config.ORDERS_APP}v1/inter_county/${payload.route}`;
    try {
      const response = await axios.post(url, values, param);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async request_pending_social__media_business({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}social-media-businesses?verified=0`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_approved_social__media_business({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}social-media-businesses?verified=1`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_rejected_social__media_business({ state, dispatch }) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}social-media-businesses?verified=2`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async social_media_biz_approval({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPatch', payload, { root: true });
      return res.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async update_freight_status({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_coupons({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.CUSTOMERS_APP}get_all_coupons?country=${payload.country}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_single_coupons({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.CUSTOMERS_APP}get_coupon?id=${payload.id}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_user_freight_status({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}freight-status?${payload.val}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_operational_alerts({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const values = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
      params: payload,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };
    const url = `${config.STAFF_API}live-ops/orders`;

    try {
      const response = await axios.get(url, values);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async assignAlert({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPatch', payload, { root: true });
      return res.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async getHelpscoutUser({ state, dispatch, commit }, payload) {
    const url = 'HELPSCOUT_USERS';
    payload.authorization = true;

    const values = {
      url,
      params: payload,
    };
    try {
      const res = await dispatch('request_helpscoute_get', values);
      payload.error = res.status;
      await dispatch('handleHelpScoutErrors', payload, {
        root: true,
      });
      return res;
    } catch (error) {
      return error;
    }
  },
  async reAssignTicket({ state, dispatch, commit }, payload) {
    const url = 'HELPSCOUT_CONVERSATIONS';
    const values = {
      url,
      params: {
        op: payload.op,
        path: payload.path,
        value: payload.value,
      },
      conversationID: payload.conversationID,
    };
    try {
      const res = await dispatch('request_helpscoute_patch', values);
      payload.error = res.status;
      // eslint-disable-next-line prettier/prettier
      await dispatch('handleHelpScoutErrors', payload, {
        root: true,
      });
      return res;
    } catch (error) {
      return error;
    }
  },
  async request_alert_types({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const values = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
      params: payload,
    };
    const url = `${config.STAFF_API}live-ops/alerts/`;
    try {
      const response = await axios.get(url, values);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_live_ops_criteria({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const values = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
      params: payload,
    };
    const url = `${config.STAFF_API}live-ops/criteria/`;
    try {
      const response = await axios.get(url, values);
      return response.data;
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async request_order_alerts({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const values = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.STAFF_API}live-ops/orders/${payload.orderNo}`;
    try {
      return await axios.get(url, values);
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error;
    }
  },
  async request_user_freight_status({ state, dispatch }, payload) {
    const config = state.config;
    const jwtToken = localStorage.getItem('jwtToken');
    const param = {
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        Authorization: jwtToken,
      },
    };
    const url = `${config.ADONIS_API}freight-status?${payload.val}`;
    try {
      const response = await axios.get(url, param);
      return response.data;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
};
