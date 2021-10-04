import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = () => ({
  orders: [],
  orderActivity: [],
  tableProps: [
    {
      name: 'Order Number',
      tag: 'order_no',
      width: '130',
    },
    {
      name: 'Status',
      tag: 'status',
      width: '130',
    },
    {
      name: 'Seller',
      tag: 'seller_name',
      width: '',
    },
    {
      name: 'Recipient',
      tag: 'recipient_name',
      width: '',
    },
    {
      name: 'Time',
      tag: 'time_placed',
      width: '150',
    },
    {
      name: 'Destination',
      tag: 'destination_location',
      width: '120',
    },
    {
      name: 'Assigned Batch',
      tag: 'assigned_batch_no',
      width: '130',
    },
    {
      name: 'Rider',
      tag: 'rider_name',
      width: '',
    },
    {
      name: 'Region',
      tag: 'city_name',
      width: '',
    },
  ],
  searchedEntity: null,
  searchState: false,
  isSearching: false,
});

export { state, getters, mutations, actions };
