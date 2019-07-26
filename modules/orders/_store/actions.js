export default {
  requestInitialData({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true });
      // .then(
      //   (response) => {
      //     resolve(response.data);
      //   },
      //   (error) => {
      //     reject(error);
      //   },
      // );
    });
  },
};
