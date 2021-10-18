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

  async fetchBatchedOrders({ rootState, dispatch, commit }, payload) {
    try {
      const url = rootState.config.FULFILMENT_SERVICE;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}missioncontrol/batches?direction=${payload.direction}`,
      );
      if (response.status === 200) {
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
  async fetchPickUpRequests({ rootState, dispatch, commit }, payload) {
    try {
      const url = rootState.config.FULFILMENT_SERVICE;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}missioncontrol/consignments`,
      );
      if (response.status === 200) {
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

  async fetchOrderActivites({ commit }, payload) {
    const promise = new Promise(resolve => {
      const response = {
        data: [
          {
            content: 'Order Received on',
            timestamp: '2018-04-12 20:46',
            size: 'large',
            color: '#EE7D00',
            icon: 'el-icon-circle-check',
          },
          {
            content: 'Order is being picked',
            timestamp: '2018-04-12 20:46',
            size: 'large',
            color: '#EE7D00',
            icon: 'el-icon-circle-check',
          },
          {
            content: 'Package is on the way',
            timestamp: '2018-04-03 20:46',
            size: 'large',
            color: '#7586C5',
          },
          {
            content: 'Default node',
            timestamp: '2018-04-03 20:46',
          },
        ],
      };
      resolve(response);
    });

    const results = await promise;
    setTimeout(() => {
      commit('setOrders', results);
    }, 1000);
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
};
