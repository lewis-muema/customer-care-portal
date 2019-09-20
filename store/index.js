import Apix from '@agog/apix';
import custom_actions from './actions';
import custom_getters from './getters';
import custom_mutations from './mutations';
import configurations from '~/config/configs';

const apix = new Apix({
  prefix: configurations.CONFIG.ADONIS_API,
  params: {
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'application/json',
      // Authorization: jwtToken1,
    },
  },
  resources: [
    { name: 'orders', url: 'orders' },
    { name: 'exchangeRates', url: `exchange-rates` },
  ],
});
const baseUrl = process.env.baseUrl;
export const custom_state = () => ({});
export default {
  namespaced: true,
  state: () => {
    return {
      ...apix.getState(),
      token: null,
      config: configurations.CONFIG,
      jwtToken: null,
      token: null,
      session: {},

      search_state: false,
      searchedOrder: null,
      userData: {},
      baseUrl,
      breadcrumbs: [],
      notification: {},
      errors: [],
      actionErrors: [],
      actionClass: [],
      selectedStatus: [],
      errorCodes: {
        403: 'Your access token has expired. Please logout and login again',
        500: 'Page not found',
        400: 'Cannot unmarshal JSON as Request',
      },
      orderColumns: ['dfcsdfs'],
      delayLabels: {
        pending: 'corfirmation',
        confirmed: ' pickup',
        picked: 'delivery',
      },
      cityAbbrev: {
        Nairobi: 'nbi',
        Kisumu: 'ksm',
        Mombasa: 'msa',
        Other: 'other',
      },
      vendorLabels: {
        6: '3T',
        10: '5T',
        13: '7T',
        14: '10T',
        17: '14T',
        18: '20T',
        19: '24T',
        20: '28T',
        25: 'F',
      },
    };
  },

  getters: {
    ...apix.getGetters(),
    ...custom_getters,
  },
  mutations: {
    ...apix.getMutations(),
    ...custom_mutations,
  },
  actions: {
    ...apix.getActions(),
    ...custom_actions,
  },
};
