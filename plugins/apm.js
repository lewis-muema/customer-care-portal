import Vue from 'vue';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import configs from '../config/configs';

/**
 * Initialise and register the Real User Monitoring (RUM) client side APM
 * plugin with root Vue instance.
 *
 * See https://www.elastic.co/guide/en/apm/agent/rum-js/4.x/vue-integration.html
 */
const config = configs.CONFIG;
export default ({ store }) => {
  const router = store.$router;
  Vue.use(ApmVuePlugin, {
    router,
    config: {
      serviceName: 'cc-portal-redesign-client',
      serverUrl: config.ELASTIC_APM_SERVER_URL,
      serviceVersion: config.ELASTIC_APM_SERVICE_VERSION,
      environment: config.ELASTIC_APM_ENVIRONMENT,
      distributedTracingOrigins: [
        config.ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS,
      ],
    },
  });
};
