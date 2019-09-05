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
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
};
