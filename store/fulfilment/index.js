import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  orderActivity: [],
  tableProps: [],
  fulfilmentType: '',
});

export { state, getters, mutations, actions };
