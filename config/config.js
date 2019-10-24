const config = {
  development: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clients/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clients/',
    PAYMENT_SERVICE: 'https://authtest.sendyit.com/localisation/',
    RABBITMQ_URL:
      'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
    BROKER_USER: 'staging',
    BROKER_PASS: '0FAHmQQmjfsIXdro',
  },
  staging: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    ADONIS_API: 'https://adonistest.sendyit.com/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clients/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clients/',
    PAYMENT_SERVICE: 'https://authtest.sendyit.com/localisation/',
    RABBITMQ_URL:
      'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
    BROKER_USER: 'staging',
    BROKER_PASS: '0FAHmQQmjfsIXdro',
  },
  beta: {},
  production: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://auth.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
    ADONIS_API: 'https://auth.sendyit.com/adonis/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://auth.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://auth.sendyit.com/v1/',
    ORDERS_APP: 'https://auth.sendyit.com/orders/',
    LOGIN_URL: 'https://auth.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/orders/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/riders/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clients/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clients/',
    PAYMENT_SERVICE: 'https://auth.sendyit.com/localisation/',
    RABBITMQ_URL: 'wss://prod-stomp.sendyit.com:15675/ws',
    BROKER_USER: 'production',
    BROKER_PASS: 'Z_EQ-T5rO-oQVx-OqL2',
  },
};
export default config;
