import Vue from 'vue';

import SendyAuth from '@sendyit/auth';
import config from '~/config/configs';

// eslint-disable-next-line require-await
export default ({ app }) => {
  Vue.use(SendyAuth, {
    authUrl: config.CONFIG.LOGIN_URL,
    configs: {
      google: {
        clientId: app.$config.googleClientId,
      },
    },
  });
};
