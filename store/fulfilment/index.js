import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  orderActivity: [],
  tableProps: [],
  fulfilmentType: '',
  pagination: {},
});

export { state, getters, mutations, actions };
