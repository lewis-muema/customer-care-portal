import { url } from 'inspector';

// eslint-disable-next-line import/prefer-default-export
export const customConfig = {
  development: {
    BASE_URL: 'http://localhost:3030/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    // POSITIONS: 'https://auth.sendyit.com/positions/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    GOOGL_API_KEY: 'AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',

    BACKEND_KEY: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
  },
  testing: {
    BASE_URL: 'https://caretest.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    GOOGL_API_KEY: 'AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    BACKEND_KEY: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
  },
  beta: {
    BASE_URL: 'https://beta-care.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
    GOOGL_API_KEY: 'AIzaSyChEOAbj_2URQWRkL8N0p07vk6foBfHXGI',
    ADONIS_API: 'https://adonistest.sendyit.com/',
  },
  production: {
    BASE_URL: 'https://care.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
    GOOGL_API_KEY: 'AIzaSyChEOAbj_2URQWRkL8N0p07vk6foBfHXGI',
    ADONIS_API: 'https://adonistest.sendyit.com/',
  },
  rabbitMQ: {
    base_url: 'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=',
    username: 'staging',
    password: '0FAHmQQmjfsIXdro',
  },
  // general: {
  BACKEND_KEY: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
  broker_user: 'staging',
  broker_pass: '0FAHmQQmjfsIXdro',
  search_append: '-SEARCH-GFSJHGSDYRE68636B347',

  get_chats_api: 'https://chatmetrics.sendyit.com/comments/',
  // },
};
// module.exports = customConfig;
