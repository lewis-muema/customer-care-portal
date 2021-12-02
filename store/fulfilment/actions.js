import FulfilmentData from '../../mixins/fulfilment_data';
import { axiosConfig } from '~/middleware/axios';

export default {
  setTableProps({ commit }, payload) {
    commit('setTableProps', payload);
  },
  setTableData({ commit }, payload) {
    commit('setTableData', payload);
  },
  async fetchDeliveryRequests(
    { rootState, commit, getters, dispatch },
    payload,
  ) {
    const url = rootState.config.FULFILMENT_SERVICE;
    if (payload != null && payload.nextPage) {
      const newTableData = {
        pagination: {
          total: 987,
          perPage: 50,
          page: payload.nextPage,
          lastPage: 20,
        },
        data: [
          {
            order_no: `ES97ZL615-F4U ${payload.nextPage}`,
            status: 'Received',
            seller_name: 'Jame Merchant',
            recipient_name: 'John Doe',
            rider_name: 'Sendy Rider',
            rider_id: 1,
            city_name: 'Nairobi',
            time_placed: '2021-09-28T09:32:46.000Z',
            pickup_location: 'The Chancery, Valley Rd ',
            destination_location: 'Tilisi Hub',
            distance: 20,
            order_amount: 244,
            currency: 'KSH',
            assigned_batch_no: 'BLF-O001',
            estimated_weight: 400,
            unit_per_order: 10,
            volume: 10,
            batch_no: '#13322',
          },
        ],
      };
      const promise = new Promise(resolve => {
        const tableData = [...getters.getTableData];
        const updatedTableData = tableData.concat(newTableData.data);
        setTimeout(() => {
          commit('setTableData', updatedTableData);
          commit('setPagination', newTableData.pagination);
          resolve(updatedTableData);
        }, 1000);
      });
      return promise;
    }
    try {
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(`${url}missioncontrol/deliveries`);
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'order_id') return;
        const deliveryOrders = response.data.data.orders;
        const pagination = {
          total: deliveryOrders.length,
          perPage: 50,
          page: 1,
          lastPage: 20,
        };
        commit('setTableData', deliveryOrders);
        commit('setPagination', pagination);
        commit('setProcessingStatus', false);
      }
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetchOutboundBatchedOrders(
    { rootState, dispatch, commit, getters },
    payload,
  ) {
    delete payload.direction;
    // eslint-disable-next-line prettier/prettier
    const filter =
      !payload || Object.keys(payload).length === 0
        ? ''
        : `&${Object.keys(payload)[0]}=${payload[Object.keys(payload)[0]]}`;

    try {
      const url = rootState.config.FULFILMENT_SERVICE;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}missioncontrol/batches?direction=OUTBOUND${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'batch_id') return;
        const batches = response.data.data.batches;

        const pagination = {
          total: batches.length,
          perPage: 50,
          page: 1,
          lastPage: 20,
        };
        commit('setTableData', batches);
        commit('setPagination', pagination);
        commit('setProcessingStatus', false);
      }
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async fetchInBoundBatchedOrders(
    { rootState, dispatch, commit, getters },
    payload,
  ) {
    delete payload.direction;
    // eslint-disable-next-line prettier/prettier
    const filter =
      !payload || Object.keys(payload).length === 0
        ? ''
        : `&${Object.keys(payload)[0]}=${payload[Object.keys(payload)[0]]}`;

    try {
      const url = rootState.config.FULFILMENT_SERVICE;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}missioncontrol/batches?direction=INBOUND${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'batch_id') return;

        const batches = response.data.data.batches;

        const pagination = {
          total: batches.length,
          perPage: 50,
          page: 1,
          lastPage: 20,
        };
        commit('setTableData', batches);
        commit('setPagination', pagination);
        commit('setProcessingStatus', false);
      }
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },

  async fetchMovableUnits({ commit }, payload) {
    commit('setProcessingStatus', true);
    const promise = new Promise(resolve => {
      const response = {
        pagination: {
          total: 987,
          perPage: 50,
          page: 1,
          lastPage: 20,
        },
        data: FulfilmentData.movable_units,
      };
      resolve(response);
    });

    const results = await promise;
    setTimeout(() => {
      commit('setTableData', results.data);
      commit('setPagination', results.pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },
  async fetchVehicles({ commit }, payload) {
    const promise = new Promise(resolve => {
      const response = {
        pagination: {
          total: 987,
          perPage: 50,
          page: 1,
          lastPage: 20,
        },
        data: FulfilmentData.vehicles,
      };
      resolve(response);
    });

    const results = await promise;
    setTimeout(() => {
      commit('setVehicles', results.data);
    }, 100);
  },
  async fetchPickUpRequests({ rootState, dispatch, commit, getters }, payload) {
    // eslint-disable-next-line prettier/prettier
    const filter = !payload
      ? ''
      : `?${Object.keys(payload)[0]}=${payload[Object.keys(payload)[0]]}`;

    try {
      const url = rootState.config.FULFILMENT_SERVICE;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}missioncontrol/consignments${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'order_id') return;
        const deliveryOrders = response.data.data.orders;
        const pagination = {
          total: deliveryOrders.length,
          perPage: 50,
          page: 1,
          lastPage: 20,
        };
        commit('setTableData', deliveryOrders);
        commit('setPagination', pagination);
        commit('setProcessingStatus', false);
      }
    } catch (error) {
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async fetchReturnOrders({ commit }, payload) {
    commit('setProcessingStatus', true);
    const promise = new Promise(resolve => {
      const response = {
        pagination: {
          total: 987,
          perPage: 50,
          page: 1,
          lastPage: 20,
        },
        data: FulfilmentData.return_orders,
      };
      resolve(response);
    });

    const results = await promise;
    setTimeout(() => {
      commit('setTableData', results.data);
      commit('setPagination', results.pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },

  async getHubList({ rootState, commit, dispatch }) {
    commit('setProcessingStatus', true);
    const config = rootState.config;
    const url = `${config.FULFILMENT_SERVICE}missioncontrol/hubs`;

    const results = await axiosConfig.get(url);
    setTimeout(() => {
      const res = results.data;
      commit('setTableData', res.data);
      commit('setHubs', res.data);
      // commit('setPagination', results.pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },
  async add_fulfilment_hub({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error.response.data.data;
    }
  },
  async fetch_table_details({ rootState, dispatch }, payload) {
    const config = rootState.config;
    const url = `${config[payload.app]}${payload.endpoint}/${
      payload.params.data_id
    }`;
    try {
      const response = await axiosConfig.get(url);
      return response;
    } catch (error) {
      return error.response.data.data;
    }
  },

  async fetchActivites({ rootState, commit, dispatch }, payload) {
    const url = rootState.config.FULFILMENT_SERVICE;

    try {
      const response = await axiosConfig.get(
        `${url}missioncontrol/${payload.type}/${payload.record_id}/tracking`,
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data.data;
    }
  },
  async fetchSingleOrder({ commit }) {
    const promise = new Promise(resolve => {
      const response = {
        data: [
          {
            order_no: 'ES97ZL615-F4U',
            status: 'In Transit',
            seller_name: 'Jame Merchant',
            recipient_name: 'Mike Doe',
            rider_name: 'Sendy Rider',
            rider_id: 1,
            city_name: 'Nairobi',
            time_placed: '2021-09-28T09:32:46.000Z',
            pickup_location: 'The Chancery, Valley Rd ',
            destination_location: 'Tilisi Hub',
            distance: 20,
            order_amount: 244,
            currency: 'KSH',
            assigned_batch_no: 'BLF-O001',
            estimated_weight: 400,
            unit_per_order: 10,
            volume: 10,
            batch_no: '#13322',
          },
        ],
        pagination: {},
      };
      resolve(response);
    });
    const results = await promise;
    setTimeout(() => {
      commit('setTableData', results.data);
      commit('setPagination', results.pagination);
    }, 10);
  },
  async fetchHubs({ rootState, commit, dispatch }) {
    commit('setProcessingStatus', true);
    const config = rootState.config;
    const url = `${config.FULFILMENT_SERVICE}missioncontrol/hubs`;

    const results = await axiosConfig.get(url);
    setTimeout(() => {
      const res = results.data;
      commit('setHubs', res.data);
      // commit('setPagination', results.pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },
  async fetchRegions({ commit }, payload) {
    const promise = new Promise(resolve => {
      const response = {
        data: {
          regions: [
            {
              region_id: '1',
              region: 'Nairobi',
            },
            {
              region_id: '2',
              region: 'Nakuru',
            },
            {
              region_id: '3',
              region: 'Kisumu',
            },
            {
              region_id: '4',
              region: 'Thika',
            },
          ],
        },
      };
      resolve(response);
    });

    const results = await promise;
    setTimeout(() => {
      commit('setRegions', results.data.regions);
    }, 1000);
  },
  async mapOrderStatus({ commit }, payload) {
    const promise = new Promise(resolve => {
      const response = {
        data: {
          status: [
            {
              value: 'ORDER_RECEIVED',
              label: 'Received',
              type: 'order',
              description: 'Order received',
              availableStatus: ['ORDER_CANCELED', 'ORDER_IN_PROCESSING'],
              events: {
                pickup: 'event.pickup.order.created',
                delivery: 'event.delivery.order.created',
              },
            },
            {
              value: 'ORDER_IN_PROCESSING',
              label: 'Pending',
              type: 'order',
              description: 'Order in processing',
              availableStatus: [
                'ORDER_RECEIVED',
                'ORDER_CANCELED',
                'ORDER_IN_TRANSIT',
              ],
              events: {
                pickup: 'event.pickup.waiting.for.partner',
                delivery: 'event.delivery.at.hub.waiting.for.partner',
              },
            },
            {
              value: 'ORDER_IN_TRANSIT',
              label: 'In Transit',
              type: 'order',
              description: 'Order in transit',
              availableStatus: ['ORDER_COMPLETED', 'ORDER_FAILED'],
              events: {
                pickup: 'event.pickup.partner.assigned',
                delivery: 'event.delivery.at.hub.partner.assigned',
              },
            },
            {
              value: 'ORDER_COMPLETED',
              label: 'Completed',
              type: 'order',
              description: 'Order completed',
              availableStatus: null,
              events: {
                pickup:
                  'event.pickup.partner.submitted.items.at.hub.confirmed.via.code',
                delivery:
                  'event.delivery.partner.submitted.items.to.buyer.confirmed.via.code',
              },
            },
            {
              value: 'ORDER_CANCELED',
              label: 'Cancelled',
              type: 'order',
              description: 'Order cancelled',
              availableStatus: ['ORDER_RECEIVED'],
              events: {
                pickup: 'event.pickup.order.canceled.by.sendy',
                delivery: 'event.delivery.order.canceled.by.sendy',
              },
            },
            {
              value: 'ORDER_FAILED',
              label: 'Failed',
              type: 'order',
              description: 'Order failed',
              availableStatus: ['ORDER_RECEIVED'],
              events: {
                pickup: 'event.pickup.failed',
                delivery: 'event.delivery.failed',
              },
            },

            {
              value: 'BATCH_IN_COMPOSITION',
              label: 'Composition',
              type: 'batch',
              description: 'Batch in composition',
              availableStatus: null,
              events: null,
            },
            {
              value: 'BATCH_IN_HUB_PREPARATION',
              label: 'Pending',
              type: 'batch',
              description: 'Batch in hub preparation',
              availableStatus: null,
              events: null,
            },
            {
              value: 'BATCH_PENDING_SHIPPING_ASSIGNMENT',
              label: 'Processing',
              type: 'batch',
              description: 'Batch pending assignment',
              availableStatus: null,
              events: null,
            },
            {
              value: 'BATCH_FAILED_SHIPPING_ASSIGNMENT',
              label: 'No Partner',
              type: 'batch',
              description: 'Batch failed assignment',
              availableStatus: null,
              events: null,
            },
            {
              value: 'BATCH_IN_TRANSIT',
              label: 'In Transit',
              type: 'batch',
              description: 'Batch in transit',
              availableStatus: null,
              events: null,
            },
            {
              value: 'BATCH_COMPLETED',
              label: 'Completed',
              type: 'batch',
              description: 'Batch completed',
              availableStatus: null,
              events: null,
            },
          ],
        },
      };
      resolve(response);
    });

    const results = await promise;
    commit('setStatusMapping', results.data.status);
  },
  async orders_summary({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error.response.data.data;
    }
  },
  async perform_post_actions({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      return res;
    } catch (error) {
      return error.response.data.data;
    }
  },
  async requestForTransport({ rootState, commit }, payload) {
    try {
      const config = rootState.config;
      const url = `${config.FULFILMENT_SERVICE}${payload.endpoint}`;
      const response = await axiosConfig.put(url, payload.params);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  async perform_patch_actions({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPatch', payload, { root: true });
      return res;
    } catch (error) {
      const err = await dispatch('handleErrors', error.response.status, {
        root: true,
      });
      return error.response;
    }
  },
  async remove_order_from_batch({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPatch', payload, { root: true });
      return res;
    } catch (error) {
      return error.response.data.data;
    }
  },

  async fetchHubCountries({ rootState }) {
    const url = rootState.config.FULFILMENT_SERVICE;

    try {
      const response = await axiosConfig.get(`${url}missioncontrol/countries`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data.data;
    }
  },
};
