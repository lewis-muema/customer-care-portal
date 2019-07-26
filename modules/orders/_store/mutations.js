const setOrderDetails = (state, orderDetails) => {
  state.orderDetails = orderDetails;
};
const setOrders = (state, orders) => {
  state.orders = orders;
};
const getDefaultState = () => ({
  order_request_object,
});

export default {
  setOrderDetails,
  setOrders,

  setOrdersObject(state, val) {
    state.order_request_object = val;
  },
};
