import axios from 'axios';

export default {
  async request_single_order({ state }, orderNo) {
    const customConfig = state.customConfig;
    const url = `${customConfig.ADONIS_API}orders/${orderNo}`;
    try {
      const response = await axios.get(url);
      const data = await response;
      const orderDetails = data.data;
      return orderDetails;
    } catch (error) {
      console.log('error', error);
    }
  },
  // eslint-disable-next-line require-await
  async request_dispatch_list({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
  async request_partner_last_position({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });
    return res.data;
  },
  // eslint-disable-next-line require-await
  async request_order_eta({ dispatch }, payload) {
    const res = await dispatch('requestAxiosPost', payload, { root: true });

    console.log('request_order_eta', res);
  },
};
