const requestInitialData = vuexContext => {
  const payload = {
    channel: 'customer_support',
    data_set: 'delivery',
    delivery_default: true,
    delivery_status: 1,
    delivery_Orderstatus: 1,
    between_dates: '',
    delivery_rider: '',
    delivery_copid: '',
    delivery_userid: '',
    request_id: 11,
    country_code: ['KE'],
  };
  vuexContext.commit('setOrders', 'payload');
};

export default {
  requestInitialData,
};
