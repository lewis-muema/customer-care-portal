const bodyParser = require('body-parser');
const webpack = require('webpack');

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
          'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js',
        type: 'text/javascript',
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js',
        type: 'text/javascript',
      },
      {
        src: 'js/adminlte.min.js',
        type: 'text/javascript',
      },
      {
        src: 'js/demo.js',
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
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic',
      },
      {
        href:
          '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css',
        rel: 'stylesheet',
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
    '@assets/style/AdminLTE.css',
    // '@assets/style/Ionicons/css/ionicons.min.css',
    '@assets/style/typeahead.css',
    '@assets/style/skins/_all-skins.min.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['plugins/core-components.js', 'plugins/date-filter.js'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseUrl: process.env.BASE_URL || 'https://nuxt-blog-590c5.firebaseio.com',
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
    baseUrl: process.env.BASE_URL || 'https://nuxt-blog-590c5.firebaseio.com',
    backendKey: '4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT',
    fbApiKey: 'AIzaSyDVvREAXSltEbLF1XSaPR4psMN0oSyQN4g',
  },
  serverMiddleware: [bodyParser.json(), '~/api'],
};
