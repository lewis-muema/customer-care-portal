import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export const state = () => ({
  tracked_order: '',
  tracking_data: {},
  isMQTTConnected: false,
});

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
