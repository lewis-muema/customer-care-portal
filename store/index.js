import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import configurations from '~/config/configs';

const baseUrl = process.env.baseUrl;
const state = () => ({
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
  businessUnits: null,
  ticketFields: null,
  selectedBusinessUnits: null,
  selectedCopNames: null,
  selectedCities: null,
  cities: null,
  exchangeRates: null,
  copTypes: null,
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
  viewSummary: true,
  addPricing: false,
  viewDetails: false,
  editStatus: 0,
  firstPricing: false,
  approveStatus: true,
  section: 1,
  distancePricingData: [],
  pendingPricingData: [],
  pendingLocationData: [],
  pendingContainerData: [],
  locationPricingData: [],
  dedicatedPricingData: [],
  tableData: [],
  customPricingDetails: [],
  approverId: 0,
  npsRequest: false,
  activeGroup: [],
  commentStatus: null,
  countries: null,
  activeCountries: null,
  activeAccountTypes: null,
  activeBusinessUnits: null,
  currentNPSPage: null,
  lastNPSPage: null,
  npsDateRange: null,
  npsMetaData: null,
  npsFilters: null,
  coupons: null,
  couponCountry: 'ALL',
  searchedCoupon: null,
  searchedAdmin: null,
  problematicOrderSearched: false,
  typingState: false,
  alertStatus: null,
  adminID: null,
  admins: null,
  activeLiveOpsVendor: null,
  liveOpsRefresh: false,
  alertType: null,
  surveys: null,
  selectedVendors: null,
  selectedAdmins: null,
  selectedAlerts: null,
  selectedOrder: null,
  searchedOrderStatus: false,
  currentPage: 1,
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
  vendorType: {
    1: 'Bike',
    2: 'Pick Up',
    3: 'Van',
    4: 'Laundry Bike',
    5: 'Cooler van',
    6: '3T Truck',
    7: 'Donation Bike',
    8: 'Intercity Driver',
    9: 'Cab',
    10: '5T Truck',
    11: 'boda boda',
    12: 'tuk tuk',
    13: '7T Truck',
    14: '10T Truck',
    15: 'promotion',
    16: 'donation',
    17: '14T Truck',
    18: '20T Truck',
    19: '24T Truck',
    20: '28T Truck',
    21: 'Runner',
    22: 'Economy Runner',
    23: 'Economy Bike',
    24: 'Standard Bike',
    25: 'Freight',
  },
  selectedVendorType: null,
  selectedCountryCode: null,
  reallocationReasons: [],
  activeCancellationReasons: [],
  deactivatedCancellationReasons: [],
  activeCancellationConsequences: [],
  deactivatedCancellationConsequences: [],
  cancellationActions: [],
  vendorTypes: null,
  environmentVariables: null,
});
export { state, getters, mutations, actions };
