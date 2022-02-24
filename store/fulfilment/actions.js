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
    const url = rootState.config.MISSION_CONTROL_BFF;
    // eslint-disable-next-line prettier/prettier
    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = Object.keys(payload)[0] === key ? '?' : '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }

    try {
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}orders/deliveries${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'order_id') return;
        const res = response.data;
        const deliveryOrders = res.data.data.orders;
        const pageInfo = res.data.data.pagination;
        const pagination = {
          total: deliveryOrders.length,
          perPage: pageInfo.max,
          page: pageInfo.current_page,
        };

        payload && payload.offset
          ? commit('setTableDataAppend', deliveryOrders)
          : commit('setTableData', deliveryOrders);
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
    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }

    try {
      const url = rootState.config.MISSION_CONTROL_BFF;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}batches?direction=OUTBOUND${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'batch_id') return;
        const res = response.data;
        const batches = res.data.data.batches;
        const pageInfo = res.data.data.pagination;
        const pagination = {
          total: batches.length,
          perPage: pageInfo.max,
          page: pageInfo.current_page,
        };

        payload && payload.offset
          ? commit('setTableDataAppend', batches)
          : commit('setTableData', batches);
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
    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }

    try {
      const url = rootState.config.MISSION_CONTROL_BFF;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}batches?direction=INBOUND${filter}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'batch_id') return;

        const res = response.data;
        const batches = res.data.data.batches;
        const pageInfo = res.data.data.pagination;
        const pagination = {
          total: batches.length,
          perPage: pageInfo.max,
          page: pageInfo.current_page,
        };
        payload && payload.offset
          ? commit('setTableDataAppend', batches)
          : commit('setTableData', batches);
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
  async fetchVehicles({ commit, rootState }, payload) {
    const url = rootState.config.AUTH;
    const vehiclesVendors = await axiosConfig.get(
      `${url}mission-control-bff/supported_vendors`,
    );
    const promise = new Promise(resolve => {
      const response = {
        pagination: {
          total: 987,
          perPage: 50,
          page: 1,
          lastPage: 20,
        },
        data: vehiclesVendors.data.data,
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
    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = Object.keys(payload)[0] === key ? '?' : '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }

    try {
      const url = rootState.config.MISSION_CONTROL_BFF;
      commit('setProcessingStatus', true);
      const response = await axiosConfig.get(
        `${url}orders/consignments${filter.replace(/ /g, '')}`,
      );
      if (response.status === 200) {
        if (getters.getTableDetailKeyMetric.id !== 'order_id') return;
        const res = response.data;
        const deliveryOrders = res.data.data.orders;
        const pageInfo = res.data.data.pagination;
        const pagination = {
          total: deliveryOrders.length,
          perPage: pageInfo.max,
          page: pageInfo.current_page,
        };
        payload && payload.offset
          ? commit('setTableDataAppend', deliveryOrders)
          : commit('setTableData', deliveryOrders);
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
    const pagination = {
      total: results.data.length,
      perPage: results.data.length - 1,
      page: 0,
    };
    setTimeout(() => {
      commit('setTableData', results.data);
      commit('setPagination', pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },

  async getHubList({ rootState, commit, dispatch }) {
    commit('setProcessingStatus', true);
    const config = rootState.config;
    const url = `${config.FULFILMENT_SERVICE}missioncontrol/hubs`;

    const results = await axiosConfig.get(url);
    const pagination = {
      total: results.data.length,
      perPage: results.data.length - 1,
      page: 0,
    };
    setTimeout(() => {
      const res = results.data;
      commit('setTableData', res.data.hubs);
      commit('setHubs', res.data.hubs);
      commit('setPagination', pagination);
      commit('setProcessingStatus', false);
    }, 1000);
  },
  async getSellerList({ rootState, commit, dispatch }) {
    try {
      commit('setProcessingStatus', true);
      const config = rootState.config;
      const url = `${config.AUTH}mission-control-bff/sellers`;

      const results = await axiosConfig.get(url);

      const pagination = {
        total: results.data.length,
        perPage: results.data.length - 1,
        page: 0,
      };
      setTimeout(() => {
        const res = results.data;
        commit('setTableData', res.data.seller_bio_data);
        commit('setPagination', pagination);
        commit('setProcessingStatus', false);
      }, 1000);
    } catch (error) {
      commit('setTableData', []);
      commit('setProcessingStatus', false);
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async getDeliveryHistory({ rootState, commit, dispatch, getters }, payload) {
    try {
      let filter = '';

      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          const param_const = Object.keys(payload)[0] === key ? '?' : '&';
          filter = `${filter}${param_const}${key}=${payload[key]}`;
        }
      }
      commit('setProcessingStatus', true);
      const config = rootState.config;
      const url = `${config.AUTH}mission-control-bff/orders/seller/${
        getters.getSellerInfo.business_id
      }${filter.replace(/ /g, '')}`;
      const results = await axiosConfig.get(url);
      if (results.status === 200) {
        const pagination = {
          total: results.data.length,
          perPage: results.data.length - 1,
          page: 0,
        };
        setTimeout(() => {
          const res = results.data;

          commit('setTableData', res.data.data.orders);
          commit('setPagination', pagination);
          commit('setProcessingStatus', false);
        }, 1000);
      }
    } catch (error) {
      commit('setTableData', []);
      commit('setProcessingStatus', false);
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
  },
  async getInvoiceList({ rootState, commit, dispatch, getters }, payload) {
    try {
      let filter = '';

      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          const param_const = Object.keys(payload)[0] === key ? '?' : '&';
          filter = `${filter}${param_const}${key}=${payload[key]}`;
        }
      }

      commit('setProcessingStatus', true);
      const config = rootState.config;
      const url = `${config.AUTH}mission-control-bff/sellers/invoices/${
        getters.getSellerInfo.business_id
      }${filter.replace(/ /g, '')}`;
      const results = await axiosConfig.get(url);
      if (results.status === 200) {
        const pagination = {
          total: results.data.length,
          perPage: results.data.length - 1,
          page: 0,
        };
        setTimeout(() => {
          const res = results.data;

          commit('setTableData', res.data.data.invoices);
          commit('setPagination', pagination);
          commit('setProcessingStatus', false);
        }, 1000);
      }
    } catch (error) {
      commit('setTableData', []);
      commit('setProcessingStatus', false);
      await dispatch('handleErrors', error.response.status, {
        root: true,
      });
    }
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
  async fetchHubs({ rootState, commit, getters, dispatch }) {
    commit('setProcessingStatus', true);
    const config = rootState.config;
    const country = getters.getSelectedCountry;
    const url =
      country !== null && country !== 'All Countries'
        ? `${config.FULFILMENT_SERVICE}missioncontrol/hubs?country=${country}`
        : `${config.FULFILMENT_SERVICE}missioncontrol/hubs`;

    const results = await axiosConfig.get(url);
    setTimeout(() => {
      const res = results.data;
      commit('setHubs', res.data.hubs);
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
            {
              value: 'PAYMENT_SUCCESS',
              label: 'Paid',
              type: 'payment',
              description: 'Paid',
              availableStatus: null,
              events: null,
            },
            {
              value: 'PAYMENT_FAIL',
              label: 'Failed payment',
              type: 'payment',
              description: 'Failed payment',
              availableStatus: null,
              events: null,
            },
            {
              value: 'PAYMENT_PENDING_CHARGE_CONFIRMATION',
              label: 'Pending payment',
              type: 'payment',
              description: 'Pending charge confirmation',
              availableStatus: null,
              events: null,
            },
            {
              value: 'PAYMENT_FAILED_CHARGE_ATTEMPT',
              label: 'Failed payment',
              type: 'payment',
              description: 'Failed charge attempt',
              availableStatus: null,
              events: null,
            },
            {
              value: 'PAYMENT_PENDING_CHARGE_ATTEMPT',
              label: 'Pending payment',
              type: 'payment',
              description: 'Pending charge attempt',
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
  async fetchRouteDistance({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      commit('setRouteDistance', res.data.data);
      return res;
    } catch (error) {
      return error.response.data.data;
    }
  },
  async finalRouteDistance({ dispatch, commit }, payload) {
    try {
      const res = await dispatch('requestAxiosPost', payload, { root: true });
      commit('setRouteDistance', res.data.data);
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

  async fetchHubCountries({ rootState, commit }) {
    const url = rootState.config.FULFILMENT_SERVICE;

    try {
      const response = await axiosConfig.get(`${url}missioncontrol/countries`);
      if (response.status === 200) {
        commit('setSupportedCountries', response.data.data.countries);
        return response.data;
      }
    } catch (error) {
      return error.response.data.data;
    }
  },
  async fetchFailedAttempts({ rootState, commit }, payload) {
    const url = rootState.config.AUTH;

    try {
      const response = await axiosConfig.get(
        `${url}mission-control-bff/orders/failed-attempts/${payload.order_id}`,
      );
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      return error.response.data.data;
    }
  },
  async fetchInvoiceDetails({ rootState, commit, dispatch }, payload) {
    const url = rootState.config.AUTH;

    try {
      const response = await axiosConfig.get(
        `${url}mission-control-bff/orders/v2/${payload.order_no}`,
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error.response.data;
    }
  },
  async getSellerStats({ rootState, commit }, payload) {
    const url = rootState.config.AUTH;
    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = Object.keys(payload)[0] === key ? '?' : '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }
    try {
      const response = await axiosConfig.get(
        `${url}mission-control-bff/sellers/summary${filter.replace(/ /g, '')}`,
      );
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      return error.response.data.data;
    }
  },
  async fetch_delivery_details({ rootState, dispatch, getters }, payload) {
    const app = rootState.config.AUTH;

    let filter = '';

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const param_const = Object.keys(payload)[0] === key ? '?' : '&';
        filter = `${filter}${param_const}${key}=${payload[key]}`;
      }
    }
    const url = `${app}mission-control-bff/orders/seller/${
      getters.getSellerInfo.business_id
    }${filter.replace(/ /g, '')}`;
    try {
      const response = await axiosConfig.get(url);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
