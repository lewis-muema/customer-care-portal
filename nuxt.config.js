const bodyParser = require('body-parser');
const customConfig = require('./config/custom');

export default {
  mode: 'universal',

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
    'aos/dist/aos.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    'plugins/date-filter.js',
    // '@/plugins/aos.js',
    { src: '~plugins/vue-infinite-scroll.js', ssr: false },
    { src: '~plugins/aos.js', ssr: false },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    'nuxt-pouch',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseUrl: process.env.BASE_URL || 'https://caretest.sendyit.com/customer',
    credentials: false,
  },
  /*
   ** Build configuration
   */
  build: {
    /**
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://caretest.sendyit.com/customer',
    DOCKER_ENV: process.env.DOCKER_ENV || 'development',
    environment: process.env.DOCKER_ENV,
    customConfigs: customConfig,
    BACKEND_API_KEY: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
  },
  serverMiddleware: [bodyParser.json(), '~/api'],
};
