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

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: commonHeaders,
});

interceptor.addRequestInterceptor(api);
interceptor.addResponseInterceptor(api);

// eslint-disable-next-line import/prefer-default-export
export { api };
