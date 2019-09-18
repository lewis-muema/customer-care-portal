import Vue from 'vue';

import SendyAuth from '@sendyit/auth';

Vue.use(SendyAuth, {
  // social authentication driver: 'google'
  // default: google

  // internal authentication url
  authUrl: 'https://authtest.sendyit.com/parcel/admin_glogin',

  // custom configurations for social drivers
  configs: {
    google: {
      // google's client key & identification for gapi
      clientId:
        '693530769708-t8ibd43rpavia989f7n95dqtcps5rt33.apps.googleusercontent.com',
    },
  },
});
