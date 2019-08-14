import { url } from 'inspector';

// eslint-disable-next-line import/prefer-default-export
export const customConfig = {
  development: {
    BASE_URL: 'http://localhost:3030/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://auth.sendyit.com/positions/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
  },
  testing: {
    BASE_URL: 'https://caretest.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
  },
  beta: {
    BASE_URL: 'https://beta-care.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
  },
  production: {
    BASE_URL: 'https://care.sendyit.com/customer/',
    BACKEND_CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
  },
  rabbitMQ: {
    base_url: 'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=',
    username: 'staging',
    password: '0FAHmQQmjfsIXdro',
  },
  // general: {
  backend_key: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
  broker_user: 'staging',
  broker_pass: '0FAHmQQmjfsIXdro',
  search_append: '-SEARCH-GFSJHGSDYRE68636B347',

  get_chats_api: 'https://chatmetrics.sendyit.com/comments/',
  // },
};
// module.exports = customConfig;
