import configurations from './config';

export default {
  CONFIG: configurations[process.env.APP_ENV],
  GOOGL_API_KEY: process.env.GOOGL_API_KEY,
  RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
  USER_IMAGE: 'https://care.sendyit.com/customer/include/team/',
};
