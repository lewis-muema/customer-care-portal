import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  tableData: [],
  orderActivity: [],
  tableProps: [],
  fulfilmentType: '',
  pagination: {},
  searchedEntity: null,
  searchState: false,
  isSearching: false,
  hubs: null,
  selectedHubs: null,
  processing: false,
  regions: null,
  selectedRegions: null,
  checkedOrders: [],
  selectedStatus: null,
  selectedCountry: null,
  hubDialog: false,
  tableDetails: [],
  tableDetailKeyMetrics: {
    endpoint: 'missioncontrol/orders',
    id: 'order_id',
  },
  statusMapping: null,
  vehicles: [],
  vehicles_type: '',
  batchChildOrderData: {},
  remove_order_state: false,
  statusChanged: false,
  supported_countries: null,
  batch_details_dialog_state: null,
  seller_active_page: 'seller-dash',
  single_seller_page: 'deliveryHistory',
  seller_info: {},
});

export { state, getters, mutations, actions };
