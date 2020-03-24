import Apix from '@agog/apix';
import custom_actions from './actions';
import custom_getters from './getters';
import custom_mutations from './mutations';
import configurations from '~/config/configs';
import auth from '~/config/auth-token';

const apix = new Apix({
  prefix: configurations.CONFIG.ADONIS_API,
  params: {
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'application/json',
      Authorization: auth.jwtToken,
    },
  },

  resources: [
    { name: 'orders', url: 'orders' },
    { name: 'exchangeRates', url: `exchange-rates` },
    { name: 'businessUnits', url: `business-units` },
    { name: 'cities', url: `cities` },
    { name: 'copTypes', url: `cop-types` },
    { name: 'admins', url: `admins` },
    { name: 'surveys', url: `nps/surveys` },
    { name: 'countries', url: `countries` },
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
      helpScoutToken: null,
      refreshToken: null,
      session: {},
      searchState: false,
      searchedOrder: null,
      searchedBizUser: null,
      searchedPeerUser: null,
      searchedRider: null,
      selectedBusinessUnits: null,
      selectedCities: null,
      dbUpdated: false,
      actionSuccess: false,
      reorganizeStatus: false,
      orderCount: 0,
      orderAmount: 0,
      pickup: '',
      dropoff: '',
      offlineOrderCurrency: '',
      pricingId: '',
      vatAmount: 0,
      orderNumber: '',
      partnerPhone: '',
      snNumber: '',
      searchedUser: '',
      userData: {},
      baseUrl,
      breadcrumbs: [],
      notification: {},
      errors: [],
      loginErrors: null,
      tokenExpired: false,
      helpScoutTokenExpired: false,
      actionErrors: [],
      actionClass: [],
      selectedStatus: [],
      viewSummary: true,
      addPricing: false,
      viewDetails: false,
      editStatus: 0,
      firstPricing: false,
      approveStatus: true,
      section: 0,
      distancePricingData: [],
      pendingPricingData: [],
      pendingLocationData: [],
      locationPricingData: [],
      tableData: [],
      customPricingDetails: [],
      approverId: 0,
      npsRequest: false,
      activeGroup: null,
      commentStatus: null,
      activeCountries: null,
      activeAccountTypes: null,
      activeBusinessUnits: null,
      currentNPSPage: null,
      lastNPSPage: null,
      npsStartDate: null,
      npsEndDate: null,
      npsDateRange: null,
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
