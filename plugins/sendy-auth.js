import Vue from 'vue';

import SendyAuth from '@sendyit/auth';

Vue.use(SendyAuth, {
  authUrl: process.env.LOGIN_URL,

  configs: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
    },
  },
});
