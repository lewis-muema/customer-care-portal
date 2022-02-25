const packageJson = require('../package.json');

const config = {
  development: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://authtest.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    PARTNERS_APP: 'https://authtest.sendyit.com/partners/',
    ADONIS_API: 'https://authtest.sendyit.com/adonis/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    NODE_PARTNER_API: 'https://authtest.sendyit.com/partner/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clientsstaging/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clientsstaging/',
    VEHICLE_SEARCH: 'https://gate.sendyit.com/solr/vehiclestaging/',
    OWNER_SEARCH: 'https://gate.sendyit.com/solr/ownerstaging/',
    COUPON_SEARCH: 'https://gate.sendyit.com/solr/coupon_staging/',
    STAFF_SEARCH: 'https://gate.sendyit.com/solr/staff_staging/',
    STAFF_API: 'https://authtest.sendyit.com/staffapi/',
    FULFILMENT_ORDERS: 'https://gate.sendyit.com/solr/delivery_staging/',
    FULFILMENT_BATCHES: 'https://gate.sendyit.com/solr/batch_staging/',
    FULFILMENT_INVOICE: 'https://gate.sendyit.com/solr/invoices_staging/',
    FULFILMENT_SELLERS: 'https://gate.sendyit.com/solr/sellers_staging/',
    FULFILMENT_DELIVERY:
      'https://gate.sendyit.com/solr/seller_deliveries_staging/',
    PAYMENT_SERVICE: 'https://authtest.sendyit.com/localisation/',
    PRICING_SERVICE: 'https://authtest.sendyit.com/',
    VENDORS: 'https://authtest.sendyit.com/vendors/',
    OFFLINE_ORDERS:
      'https://cors-anywhere.herokuapp.com/https://orderstest.sendyit.com/orders/',
    OFFLINE_PRICING:
      'https://cors-anywhere.herokuapp.com/https://pricingtest.sendyit.com/pricing/',
    AUTH: 'https://authtest.sendyit.com/',
    PARTNER_API: 'https://authtest.sendyit.com/rider/admin_partner_api/v5/',
    HELPSCOUT_TOKEN: 'https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_CONVERSATIONS: 'https://api.helpscout.net/v2/conversations',
    HELPSCOUT_REFRESH: ' https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_USERS: ' https://api.helpscout.net/v2/users',

    RABBITMQ_URL: 'wss://stomptest.sendyit.com/ws',
    BROKER_USER: 'staging',

    ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: 'https://authtest.sendyit.com',
    ELASTIC_APM_SERVER_URL: 'https://staging-elk.sendyit.com:8200',
    ELASTIC_APM_ENVIRONMENT: 'development',
    ELASTIC_APM_SERVICE_VERSION: packageJson.version,
    ELASTIC_APM_VERIFY_SERVER_CERT: 'false',
    FULFILMENT_SERVICE: 'https://authtest.sendyit.com/fulfilment/v1/',
    MISSION_CONTROL_BFF: 'https://authtest.sendyit.com/mission-control-bff/',
  },
  dev: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://authtest.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://authtest.sendyit.com/customers/',
    PARTNERS_APP: 'https://authtest.sendyit.com/partners/',
    ADONIS_API: 'https://authtest.sendyit.com/adonis/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://authtest.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://authtest.sendyit.com/v1/',
    NODE_PARTNER_API: 'https://authtest.sendyit.com/partner/v1/',
    ORDERS_APP: 'https://authtest.sendyit.com/orders/',
    LOGIN_URL: 'https://authtest.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
    VENDORS: 'https://authtest.sendyit.com/vendors/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clientsstaging/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clientsstaging/',
    VEHICLE_SEARCH: 'https://gate.sendyit.com/solr/vehiclestaging/',
    OWNER_SEARCH: 'https://gate.sendyit.com/solr/ownerstaging/',
    COUPON_SEARCH: 'https://gate.sendyit.com/solr/coupon_staging/',
    STAFF_SEARCH: 'https://gate.sendyit.com/solr/staff_staging/',
    STAFF_API: 'https://authtest.sendyit.com/staffapi/',
    FULFILMENT_ORDERS: 'https://gate.sendyit.com/solr/delivery_staging/',
    FULFILMENT_BATCHES: 'https://gate.sendyit.com/solr/batch_staging/',
    FULFILMENT_INVOICE: 'https://gate.sendyit.com/solr/invoices_staging/',
    FULFILMENT_SELLERS: 'https://gate.sendyit.com/solr/sellers_staging/',
    FULFILMENT_DELIVERY:
      'https://gate.sendyit.com/solr/seller_deliveries_staging/',
    PAYMENT_SERVICE: 'https://authtest.sendyit.com/localisation/',
    PRICING_SERVICE: 'https://authtest.sendyit.com/',
    AUTH: 'https://authtest.sendyit.com/',
    PARTNER_API:
      'https://autht.staging.sendyit.com/rider/admin_partner_api/v5/',
    HELPSCOUT_TOKEN: 'https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_CONVERSATIONS: 'https://api.helpscout.net/v2/conversations',
    HELPSCOUT_REFRESH: ' https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_USERS: ' https://api.helpscout.net/v2/users',

    RABBITMQ_URL: 'wss://stomptest.sendyit.com/ws',
    BROKER_USER: 'staging',

    ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: 'https://authtest.sendyit.com',
    ELASTIC_APM_SERVER_URL: 'https://staging-elk.sendyit.com:8200',
    ELASTIC_APM_ENVIRONMENT: 'staging',
    ELASTIC_APM_SERVICE_VERSION: packageJson.version,
    ELASTIC_APM_VERIFY_SERVER_CERT: 'false',
    FULFILMENT_SERVICE: 'https://authtest.sendyit.com/fulfilment/v1/',
    MISSION_CONTROL_BFF: 'https://authtest.sendyit.com/mission-control-bff/',
  },
  staging: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.staging.sendyit.com/parcel',
    POSITIONS: 'https://auth.staging.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://auth.staging.sendyit.com/customers/',
    PARTNERS_APP: 'https://auth.staging.sendyit.com/partners/',
    ADONIS_API: 'https://auth.staging.sendyit.com/adonis/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://auth.staging.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://auth.staging.sendyit.com/v1/',
    NODE_PARTNER_API: 'https://auth.staging.sendyit.com/partner/v1/',
    ORDERS_APP: 'https://auth.staging.sendyit.com/orders/',
    LOGIN_URL: 'https://auth.staging.sendyit.com/parcel/admin_glogin',
    VENDORS: 'https://auth.sendyit.com/vendors/',
    SOLR_BASE: 'https://gate.sendyit.com/solr/ordersstaging/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/ridersstaging/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clientsstaging/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clientsstaging/',
    COUPON_SEARCH: 'https://gate.sendyit.com/solr/coupon_staging/',
    STAFF_SEARCH: 'https://gate.sendyit.com/solr/staff_staging/',
    STAFF_API: 'https://authtest.sendyit.com/staffapi/',
    FULFILMENT_ORDERS: 'https://gate.sendyit.com/solr/delivery_staging/',
    FULFILMENT_BATCHES: 'https://gate.sendyit.com/solr/batch_staging/',
    FULFILMENT_INVOICE: 'https://gate.sendyit.com/solr/invoices_staging/',
    FULFILMENT_SELLERS: 'https://gate.sendyit.com/solr/sellers_staging/',
    FULFILMENT_DELIVERY:
      'https://gate.sendyit.com/solr/seller_deliveries_staging/',
    PAYMENT_SERVICE: 'https://auth.staging.sendyit.com/localisation/',
    OFFLINE_ORDERS:
      'https://cors-anywhere.herokuapp.com/https://orders.sendyit.com/orders/',
    OFFLINE_PRICING:
      'https://cors-anywhere.herokuapp.com/https://pricing.sendyit.com/pricing/',
    AUTH: 'https://auth.staging.sendyit.com/',
    HELPSCOUT_TOKEN: 'https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_CONVERSATIONS: 'https://api.helpscout.net/v2/conversations',
    HELPSCOUT_REFRESH: ' https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_USERS: ' https://api.helpscout.net/v2/users',

    RABBITMQ_URL: 'wss://stomptest.sendyit.com/ws',
    BROKER_USER: 'staging',

    ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: 'https://authtest.sendyit.com',
    ELASTIC_APM_SERVER_URL: 'https://staging-elk.sendyit.com:8200',
    ELASTIC_APM_ENVIRONMENT: 'staging',
    ELASTIC_APM_SERVICE_VERSION: packageJson.version,
    FULFILMENT_SERVICE: 'https://authtest.sendyit.com/fulfilment/v1/',
    MISSION_CONTROL_BFF: 'https://authtest.sendyit.com/mission-control-bff/',
  },
  production: {
    BASE_URL: 'http://localhost:8080/',
    PRIVATE_API: 'https://auth.sendyit.com/parcel',
    POSITIONS: 'https://auth.sendyit.com/positions/',
    CUSTOMERS_APP: 'https://auth.sendyit.com/customers/',
    PARTNERS_APP: 'https://auth.sendyit.com/partners/',
    ADONIS_API: 'https://auth.sendyit.com/adonis/',
    RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
    DISPATCH_LIST: 'https://auth.sendyit.com/dispatch/',
    NODE_PRIVATE_API: 'https://auth.sendyit.com/v1/',
    NODE_PARTNER_API: 'https://auth.sendyit.com/partner/v1/',
    ORDERS_APP: 'https://auth.sendyit.com/orders/',
    LOGIN_URL: 'https://auth.sendyit.com/parcel/admin_glogin',
    SOLR_BASE: 'https://gate.sendyit.com/solr/orders/',
    RIDER_SEARCH: 'https://gate.sendyit.com/solr/riders/',
    PEER_SEARCH: 'https://gate.sendyit.com/solr/peer_clients/',
    BIZ_SEARCH: 'https://gate.sendyit.com/solr/cop_clients/',
    VEHICLE_SEARCH: 'https://gate.sendyit.com/solr/vehicle/',
    VENDORS: 'https://auth.sendyit.com/vendors/',
    OWNER_SEARCH: 'https://gate.sendyit.com/solr/owner/',
    COUPON_SEARCH: 'https://gate.sendyit.com/solr/coupon/',
    STAFF_SEARCH: 'https://gate.sendyit.com/solr/staff/',
    STAFF_API: 'https://auth.sendyit.com/staffapi/',
    FULFILMENT_ORDERS: 'https://gate.sendyit.com/solr/delivery/',
    FULFILMENT_BATCHES: 'https://gate.sendyit.com/solr/batch/',
    FULFILMENT_INVOICE: 'https://gate.sendyit.com/solr/invoices/',
    FULFILMENT_SELLERS: 'https://gate.sendyit.com/solr/sellers/',
    FULFILMENT_DELIVERY: 'https://gate.sendyit.com/solr/seller_deliveries/',
    PAYMENT_SERVICE: 'https://auth.sendyit.com/localisation/',
    PRICING_SERVICE: 'https://auth.sendyit.com/',
    OFFLINE_ORDERS:
      'https://cors-anywhere.herokuapp.com/https://prod.sendyit.com/orders/',
    OFFLINE_PRICING:
      'https://cors-anywhere.herokuapp.com/https://prod.sendyit.com/pricing/',
    AUTH: 'https://auth.sendyit.com/',
    PARTNER_API: 'https://auth.sendyit.com/rider/admin_partner_api/v5/',
    HELPSCOUT_TOKEN: 'https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_CONVERSATIONS: 'https://api.helpscout.net/v2/conversations',
    HELPSCOUT_REFRESH: ' https://api.helpscout.net/v2/oauth2/token',
    HELPSCOUT_USERS: ' https://api.helpscout.net/v2/users',

    RABBITMQ_URL: 'wss://stomp.sendyit.com:443/ws',
    BROKER_USER: 'production',

    ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: 'https://auth.sendyit.com',
    ELASTIC_APM_SERVER_URL: 'https://apm.sendyit.com:443',
    ELASTIC_APM_ENVIRONMENT: 'production',
    ELASTIC_APM_SERVICE_VERSION: packageJson.version,
    FULFILMENT_SERVICE: 'https://auth.sendyit.com/fulfilment/v1/',
    MISSION_CONTROL_BFF: 'https://auth.sendyit.com/mission-control-bff/',
  },
};
export default config;
