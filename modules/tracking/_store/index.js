import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export const state = () => ({
  tracked_order: '',
  tracking_data: {},
  isMQTTConnected: false,
  map: {
    markers: [],
    polyline: {
      path: '',
      options: {
        strokeColor: '#1782c5',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      },
    },
    vendors: {},
  },
});

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
