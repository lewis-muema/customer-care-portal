import Vue from 'vue';

import SendyAuth from '@sendyit/auth';

Vue.use(SendyAuth, {
  authUrl: process.env.LOGIN_URL,

  configs: {
    google: {
      clientId:
        '693530769708-t8ibd43rpavia989f7n95dqtcps5rt33.apps.googleusercontent.com',
    },
  },
});
