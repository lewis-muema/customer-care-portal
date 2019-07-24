const setOrderDetails = (state, orderDetails) => {
  state.orderDetails = orderDetails;
};
const setOrders = (state, orders) => {
  state.orders = orders;
};

export default {
  setOrderDetails,
  setOrders,
};
