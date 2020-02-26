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
  clearCache({ commit }) {
    commit('clearToken');
    Cookie.remove('jwt');
    Cookie.remove('refreshToken');
    localStorage.clear();
    commit('setHelpScoutToken', null);
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
      await dispatch('clearCache');
      return response;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
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
      await dispatch('ticket_action', payload);
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
  async explorer({ state }, payload) {
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
      const err = await dispatch('handleErrors', error.response.status, {
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
      const userDetails = response.data;
      return userDetails;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
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
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_single_vehicle({ state }, payload) {
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
      const vehicle_details = response.data;
      return vehicle_details;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async request_single_owner({ state }, payload) {
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
      const owner_details = response.data;
      return owner_details;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
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
      const orderDetails = data.data;
      return orderDetails;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.message;
    }
  },
  async allocate_rider_vehicle({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error;
    }
  },
  async allocate_order({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error;
    }
  },
  async change_order_status({ state, dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
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
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
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
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error.response;
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
      const err = await dispatch('handleErrors', error.response.status, {
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
      if (res.data.status) {
        const pendingPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < pendingPricingDetails.length; i += 1) {
          if (pendingPricingDetails[i].location_pricing) {
            pendingLocationPricing = pendingPricingDetails[i].location_pricing;
          } else {
            const pricingTableData = [];
            pricingTableData.push(pendingPricingDetails[i].distance_pricing);
            for (let j = 0; j < pricingTableData.length; j += 1) {
              const perMinuteFee =
                pricingTableData[i].waiting_time_cost_per_min;
              const perHourFee = perMinuteFee * 60;
              pricingTableData[
                i
              ].waiting_time_cost_per_min = perHourFee.toFixed(0);
            }
            pendingDistancePricing = pricingTableData;
          }
        }
        commit('updatePendingDistancePricing', pendingDistancePricing);
        commit('updatePendingLocationPricing', pendingLocationPricing);
      } else {
        commit('updatePendingDistancePricing', pendingDistancePricing);
        commit('updatePendingLocationPricing', pendingLocationPricing);
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
      if (res.data.status) {
        const customPricingDetails = res.data.custom_pricing_details;
        for (let i = 0; i < customPricingDetails.length; i += 1) {
          if (customPricingDetails[i].location_pricing) {
            approverId = customPricingDetails[i].location_pricing[0].admin_id;
            locationPricing = customPricingDetails[i].location_pricing;
          } else {
            approverId = customPricingDetails[i].admin_id;
            const pricingTableData = [];
            pricingTableData.push(customPricingDetails[i].distance_pricing);
            for (let j = 0; j < pricingTableData.length; j += 1) {
              const perMinuteFee =
                pricingTableData[i].waiting_time_cost_per_min;
              const perHourFee = perMinuteFee * 60;
              pricingTableData[
                i
              ].waiting_time_cost_per_min = perHourFee.toFixed(0);
            }
            distancePricing = pricingTableData;
          }
        }
        commit('updateLocationPricing', locationPricing);
        commit('updateDistancePricing', distancePricing);
        commit('updateApproverId', approverId);
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
  async approve_location_pricing_configs({ dispatch, commit }, payload) {
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
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },

  async request_tax_rates({ state }) {
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
      const err = await dispatch('handleErrors', error.response.status, {
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
};
