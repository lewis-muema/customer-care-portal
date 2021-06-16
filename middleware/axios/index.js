import axios from 'axios';
import * as interceptor from './interceptors';

/**
 * headers configs for requests
 * @type Object
 */
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const axiosConfig = axios.create({
  headers: commonHeaders,
});

interceptor.addRequestInterceptor(axiosConfig);
interceptor.addResponseInterceptor(axiosConfig);

// eslint-disable-next-line import/prefer-default-export
export { axiosConfig };
