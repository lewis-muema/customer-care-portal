import axios from 'axios';

export default {
  async request_single_order({ rootState }, orderNo) {
    const config = rootState.config;
    const url = `${config.ADONIS_API}orders/${orderNo}`;
    try {
      const response = await axios.get(url);
      const data = await response;
      const orderDetails = data.data;
      return orderDetails;
    } catch (error) {
      return error;
    }
  },
  async request_dispatch_list({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
  async request_partner_last_position({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error;
    }
  },
  async request_order_eta({ dispatch }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error;
    }
  },
  async perform_order_action({ rootState, dispatch, commit }, payload) {
    console.log('payload', payload);
    const userData = rootState.userData;
    const errorCodes = rootState.errorCodes;
    // eslint-disable-next-line no-underscore-dangle
    payload.params._user_email = userData.user_email;
    // eslint-disable-next-line no-underscore-dangle
    payload.params._user_id = userData.admin_id;
    payload.params.action_user = userData.user_name;
    payload.params.channel = 'customer_support';
    payload.params.data_set = 'cc_actions';

    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      if (typeof res.data === 'undefined') {
        const n = res.split(' ');
        const errorCode = Number(n[n.length - 1]);
        const notification = errorCodes[errorCode];
        commit('setNotification', notification, { root: true });
      } else {
        return res.data;
      }
    } catch (error) {
      return error;
    }
  },
  async cancel_order({ rootState, dispatch }, values) {
    const userData = rootState.userData;
    const params = {
      _user_email: userData.user_email,
      _user_id: userData.admin_id,
      action_id: 1,
      action_user: userData.user_name,
      cancel_reason_id: values.cancel_reason_id,
      channel: 'customer_support',
      data_set: 'cc_actions',
      order_no: values.order_no,
      reason_description: values.reason_description,
    };
    const payload = {
      app: 'ORDERS_APP',
      endpoint: 'cancel_order',
      apiKey: true,
      params,
    };
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },
  // eslint-disable-next-line require-await
  async dispatch_order({ rootState, dispatch }, values) {
    const userData = rootState.userData;
    const params = {
      _user_email: userData.user_email,
      _user_id: userData.admin_id,
      action_id: 6,
      action_user: userData.user_name,
      channel: 'customer_support',
      data_set: 'cc_actions',
      order_no: values.order_no,
      batch_no: values.order_no,
    };

    const payload = {
      app: 'ORDERS_APP',
      endpoint: 'dispatch_order_cc',
      apiKey: true,
      params,
    };
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res.data;
    } catch (error) {
      return error;
    }
  },
};
