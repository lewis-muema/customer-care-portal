export default {
  requestInitialData({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        response => {
          if (response.data.status) {
            commit('setOrders', response.data.result);
            resolve(response.data);
          } else {
            reject(response.data);
          }
          resolve(response.data);
        },
        error => {
          reject(error);
        },
      );
    });
  },
};
