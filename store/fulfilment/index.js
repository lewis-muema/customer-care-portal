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
  hubDialog: false,
  tableDetails: [],
  tableDetailKeyMetrics: {
    endpoint: 'missioncontrol/orders',
    id: 'order_id',
  },
  statusMapping: null,
  vehicles: [],
});

export { state, getters, mutations, actions };
