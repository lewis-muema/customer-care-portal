import 'isomorphic-fetch';

const bodyParser = require('body-parser');
const customConfig = require('./config/custom');

const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7ImRhdGEiOnsiYWRtaW5fdHlwZSI6IjAiLCJhZG1pbl9pZCI6IjExMCIsImVjb21tZXJjZV9vbmx5IjoiMCIsInN0YXR1cyI6IjEiLCJlbWFpbCI6ImpveWNlQHNlbmR5aXQuY29tIiwiYWdlbnRfZXh0ZW5zaW9uIjoiMCIsImV4dGVybmFsX3N0YXR1cyI6IjAiLCJjb3BfaWQiOm51bGwsIm5hbWUiOiJKb3ljZSBLZW1ib2kiLCJwb3N0IjoiRnJvbnRlbmQgRW5naW5lZXIiLCJjb3VudHJ5X2NvZGVzIjoiW1wiS0VcIl0iLCJkZXYiOiIxIiwicGljIjoiZWdneS5wbmciLCJwcml2aWxlZ2UiOiJ7XCJ2aWV3X25ld19mZWF0dXJlXCI6IHRydWUsIFwicmVjb3JkX21wZXNhXCI6IHRydWUsIFwiY2hhdFwiOiB0cnVlLCBcImFwcHJvdmVfcGFydG5lcnNcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlcIjogdHJ1ZSwgXCJyZWNvcmRfbm90aWZpY2F0aW9uXCI6IHRydWUsIFwicmVjb3JkX2NoZXF1ZXNcIjogdHJ1ZSwgXCJyZWNvcmRfcGFydG5lcl93aXRoZHJhd2FsXCI6IHRydWUsIFwicmVjb3JkX3Byb21vX2NvZGVcIjogdHJ1ZSwgXCJyZWNvcmRfdXNlclwiOiB0cnVlLCBcInJlY29yZF9wYXNzX2NoYW5nZVwiOiB0cnVlLCBcImFwcHJvdmVfcHJlcGF5X2JpbGxpbmdcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlfYmlsbGluZ1wiOiB0cnVlLCBcImNoYW5nZV9hY2NvdW50X21hbmFnZXJcIjogdHJ1ZSwgXCJsb2NhdGlvbl9wcm94aW1pdHlcIjogdHJ1ZSwgXCJyZWFzc2lnbl9vcmRlcnNcIjogdHJ1ZSwgXCJ1cGRhdGVfZGVsaXZlcnlfc3RhdHVzXCI6dHJ1ZX0iLCJzZW5kX2RlcHRfaWQiOiIyIiwicm9sZSI6IjIiLCJwaG9uZSI6IjI1NDcxOTE2OTEyNCIsInNob3dfZWNvbW1lcmNlIjoiMCIsImFsbG93ZWRfb3JkZXJzIjpudWxsfSwibWFuYWdlZF9saXN0Ijp7fX0sInN0YXR1cyI6dHJ1ZSwiZXhwaXJ5IjoiODY0MDAifQ.Ja6bsNdKI1irh-6IaBgccLog-wDbX4rX0m0UeeGAPfE';

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
    { src: '~plugins/vue-infinite-scroll.js', ssr: false },
    { src: '~plugins/aos.js', ssr: false },
    'plugins/main.js',
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
    jwtToken,
  },
  serverMiddleware: [bodyParser.json(), '~/api'],
};
