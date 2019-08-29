import Vue from 'vue';

import * as VueGoogleMaps from '@/node_modules/vue2-google-maps';

const environment = process.env.DOCKER_ENV;
const customConfigsVar = process.env.customConfigs.customConfig;
const customConfig = customConfigsVar[environment];

Vue.use(VueGoogleMaps, {
  load: { key: customConfig.GOOGL_API_KEY },
});
