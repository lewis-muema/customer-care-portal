const orderDetails = state => state.orderDetails;
const orders = state => state.orders;

export default {
  orderDetails,
  orders,

  getOrders(state) {
    return state.order_request_object;
  },
};
