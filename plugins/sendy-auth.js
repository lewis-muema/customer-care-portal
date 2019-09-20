import Vue from 'vue';

import SendyAuth from '@sendyit/auth';
import config from '~/config/configs';

Vue.use(SendyAuth, {
  authUrl: config.CONFIG.LOGIN_URL,

  configs: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
    },
  },
});
