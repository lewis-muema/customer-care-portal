import Vue from 'vue';
import * as VueGoogleMaps from '@/node_modules/vue2-google-maps';

export default ({ app }) => {
  Vue.use(VueGoogleMaps, {
    load: { key: app.$env.GOOGL_API_KEY },
  });
};
