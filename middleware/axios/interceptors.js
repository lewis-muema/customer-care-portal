/**
 * Add request interceptor to axios
 * @method addRequestInterceptor
 * @param  {Object} axiosConfig axios base configs
 */
const addRequestInterceptor = axiosConfig => {
  return axiosConfig.interceptors.request.use(
    config => {
      const authToken =
        process.client && typeof window !== 'undefined'
          ? localStorage.getItem('jwtToken')
          : null;
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
 * @param  {Object} axiosConfig axios base configs
 */
const addResponseInterceptor = axiosConfig => {
  const authToken =
    process.client && typeof window !== 'undefined'
      ? localStorage.getItem('jwtToken')
      : null;
  return axiosConfig.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (
        authToken &&
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 400 ||
          error.response.status === 403)
      ) {
        if (process.client && typeof window !== 'undefined') {
          localStorage.clear();
          window.location.reload();
        }
      }
      return Promise.reject(error);
    },
  );
};

export { addRequestInterceptor, addResponseInterceptor };
