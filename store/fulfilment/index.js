import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  orderActivity: [],
});

export { state, getters, mutations, actions };
