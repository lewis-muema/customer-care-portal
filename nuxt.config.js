import 'isomorphic-fetch';

const bodyParser = require('body-parser');

if (process.env.APP_ENV !== 'production' || process.env.APP_ENV !== 'staging') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
process.env.DEBUG = 'nuxt:*';

export default {
  mode: 'universal',
  server: {
    port: 8080, // default: 3000
  },
  debug: true,
  /*
   ** Headers of the page
   */
  head: {
    title: 'Sendy',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1,  maximum-scale=1, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    script: [
      {
        src: 'https://code.jquery.com/jquery-3.4.1.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI&libraries=geometry,places',
        type: 'text/javascript',
      },
      {
        src: 'https://apis.google.com/js/api.js',
        type: 'text/javascript',
      },
      {
        src: 'js/adminlte.min.js',
        type: 'text/javascript',
      },
      {
        src: 'js/typehead.bundle.js',
        type: 'text/javascript',
      },
      {
        src: 'js/bloodhound.js',
        type: 'text/javascript',
      },
      {
        src: 'https://cdn.ravenjs.com/3.14.1/raven.min.js',
        type: 'text/javascript',
      },
      {
        src: 'js/raven.js',
        type: 'text/javascript',
      },
      {
        src: 'js/hotjar.js',
        type: 'text/javascript',
      },
      {
        src: 'js/mixpanel.js',
        type: 'text/javascript',
      },
    ],
    link: [
      {
        rel: 'shortcut icon',
        sizes: '48x48',
        type: 'image/x-icon',
        href:
          'https://images.sendyit.com/web_platform/appicons/SendyAppIcon_120px.png',
      },
      {
        rel: 'stylesheet',
        href:
          'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
      },
      {
        rel: 'stylesheet',
        href:
          ' https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic',
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fa923f', height: '4px', duration: 5000 },
  /*
   ** Global CSS
   */
  css: [
    '@assets/style/custom.css',
    '@assets/style/adminLTE.min',
    '@assets/style/typeahead.css',
    '@assets/style/pricing-config.css',
    'aos/dist/aos.css',
    'vue-select/dist/vue-select.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/vue-infinite-scroll.js', ssr: false },
    { src: '~plugins/aos.js', ssr: false },
    { src: '~plugins/sendy-auth', mode: 'client', ssr: false },
    { src: '~plugins/date-time-picker', mode: 'client', ssr: false },
    { src: '~plugins/element-ui', ssr: false },
    'plugins/main.js',
    'plugins/google-maps',
    'plugins/vue-select',
    'plugins/vuelidate',
    'plugins/typeahead',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    [
      'nuxt-env',
      {
        keys: [
          'GOOGL_API_KEY',
          'GOOGLE_CLIENT_ID',
          'BACKEND_KEY',
          'SOLR_JWT',
          'APP_ENV',
          'BROKER_USER',
          'BROKER_PASS',
          'HELP_SCOUT_API_KEY',
          'HELP_SCOUT_CLIENT_ID',
          'HELP_SCOUT_SECRET_KEY',
        ],
      },
    ],
  ],
  stripe: {
    version: 'v3',
    publishableKey: process.env.STRIPE_SECRET,
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    credentials: false,
  },
  /*
   ** Build configuration
   */
  env: {
    APP_ENV: process.env.APP_ENV,
  },
  build: {
    /**
    /*
     ** You can extend webpack config here
     */

    extend(config, ctx) {},
  },

  serverMiddleware: [bodyParser.json(), '~/api'],
};
