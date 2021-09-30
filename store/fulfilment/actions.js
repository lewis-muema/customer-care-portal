export default {
  async fetchOrders({ commit }) {
    const promise = new Promise(resolve => {
      const response = {
        pagination: {
          total: 987,
          perPage: 50,
          page: 1,
          lastPage: 20,
        },
        data: [
          {
            order_no: 'ES97ZL615-F4U',
            status: 'received',
            customer_name: 'John Doe',
            rider_name: 'Sendy Rider',
            rider_id: 1,
            city_name: 'Nairobi',
            time_placed: '2021-09-28T09:32:46.000Z',
            pickup_location: 'The Chancery, Valley Rd ',
            delivery_location: 'Tilisi Hub',
            distance: 20,
            order_amount: 244,
            currency: 'KSH',
            assigned_batch_no: 'BLF-O001',
            estimated_weight: 400,
            unit_per_order: 10,
            volume: 10,
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
};
