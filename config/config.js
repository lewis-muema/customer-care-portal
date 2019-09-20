const config = {
  development: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/orders/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
  },
  staging: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    BACKEND_CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/orders/',
  },
  beta: {},
  production: {},
};
module.exports = config;
