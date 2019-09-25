import configurations from './config';

console.log('app', process.env.APP_ENV);

if (process.client) {
  console.log('app', process.env.APP_ENV);
  console.log('client', process.client);
}
export default {
  CONFIG: configurations[process.env.APP_ENV],
  RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
  USER_IMAGE: 'https://care.sendyit.com/customer/include/team/',
  SEARCH_APPEND: '-SEARCH-GFSJHGSDYRE68636B347',
};
