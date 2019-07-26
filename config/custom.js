// eslint-disable-next-line import/prefer-default-export
export const customConfig = {
  development: {
    base_url: 'http://localhost:3030/',
    private_api: 'https://auth.sendyit.com/parcel/',
    positions: 'https://auth.sendyit.com/positions/',
    backend_customer_app: 'https://authtest.sendyit.com/customers/',
  },
  testing: {
    base_url: 'https://caretest.sendyit.com/customer/',
    backend_customer_app: 'https://authtest.sendyit.com/customers/',
  },
  beta: {
    base_url: 'https://beta-care.sendyit.com/customer/',
    backend_customer_app: 'https://auth.sendyit.com/customers/',
  },
  production: {
    base_url: 'https://care.sendyit.com/customer/',
    backend_customer_app: 'https://auth.sendyit.com/customers/',
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
