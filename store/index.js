import Apix from '@agog/apix';
import custom_actions from './actions';
import custom_getters from './getters';
import custom_mutations from './mutations';
import config from '~/config/configs';

const jwtToken = config.JWT_Token;

const apix = new Apix({
  prefix: 'https://adonistest.sendyit.com',
  params: {
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'application/json',
      Authorization: jwtToken,
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
      config,
      jwtToken,
      search_state: false,
      searchedOrder: null,
      userData: {
        user_name: 'Joyce Kemboi',
        user_email: 'joyce@sendyit.com',
        phone: '254719169124',
        admin_id: 110,
        post: 'Frontend Engineer',
        pic: 'eggy.png',
        send_dept_id: 2,
        dev: 1,
        role: 2,
        privilege: {
          view_new_feature: true,
          record_mpesa: true,
          chat: true,
          approve_partners: true,
          approve_postpay: true,
          record_notification: true,
          record_cheques: true,
          record_partner_withdrawal: true,
          record_promo_code: true,
          record_user: true,
          record_pass_change: true,
          approve_prepay_billing: true,
          approve_postpay_billing: true,
          change_account_manager: true,
          location_proximity: true,
          reassign_orders: true,
          update_delivery_status: true,
        },
        cop_id: '',
        external_status: 0,
        allowed_orders: '',
        ecommerce_only: 0,
        admin_type: 0,
        agent_extension: 0,
        country_codes: ['KE'],
        managed_list: [],
        logged_in: 23,
      },
      baseUrl,
      breadcrumbs: [],
      notification: {},
      errors: [],
      actionErrors: [],
      actionClass: [],
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
