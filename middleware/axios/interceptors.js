// import store from '@/store';

/**
 * Add request interceptor to axios
 * @method addRequestInterceptor
 * @param  {Object} api axios base configs
 */
const addRequestInterceptor = api => {
  return api.interceptors.request.use(
    config => {
      const authToken =
        typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
      // const tokenObj = JSON.parse(authToken);
      if (authToken) {
        config.headers = {
          Authorization: authToken,
        };
      }
      return config;
    },
    error => Promise.reject(error),
  );
};

/**
 * Add response interceptor to axios
 * @method addResponseInterceptor
 * @param  {Object} api axios base configs
 */
const addResponseInterceptor = api => {
  const authToken =
    typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
  // const tokenObj = JSON.parse(authToken);
  return api.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (
        authToken &&
        error.response &&
        (error.response.status === 401 || error.response.status === 400)
      ) {
        // store.dispatch('auth/removeToken');
        // TODO redirect user to login page
        window.location.reload();
      }
      return Promise.reject(error);
    },
  );
};

export { addRequestInterceptor, addResponseInterceptor };
