import configurations from './config';

export default {
  CONFIG: configurations[process.env.APP_ENV],
  RIDER_DELIVERY_IMG: 'https://sendy-delivery-signatures.s3.amazonaws.com/',
  USER_IMAGE:
    'https://sendy-web-apps-assets.s3-eu-west-1.amazonaws.com/staff/team/',
  SEARCH_APPEND: '-SEARCH-GFSJHGSDYRE68636B347',
  DISTANCE_ICON:
    'https://s3.eu-west-1.amazonaws.com/webplatform.testimages/test.images',
};
