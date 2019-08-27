import Apix from '@agog/apix';
import custom_actions from './actions';
import custom_getters from './getters';
import custom_mutations from './mutations';

const environment = process.env.DOCKER_ENV;
const customConfigsVar = process.env.customConfigs.customConfig;
const customConfig = customConfigsVar[environment];

const apix = new Apix({
  prefix: 'https://adonistest.sendyit.com',
  params: {
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'application/json',
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7ImRhdGEiOnsiYWRtaW5fdHlwZSI6IjAiLCJhZG1pbl9pZCI6IjExMCIsImVjb21tZXJjZV9vbmx5IjoiMCIsInN0YXR1cyI6IjEiLCJlbWFpbCI6ImpveWNlQHNlbmR5aXQuY29tIiwiYWdlbnRfZXh0ZW5zaW9uIjoiMCIsImV4dGVybmFsX3N0YXR1cyI6IjAiLCJjb3BfaWQiOm51bGwsIm5hbWUiOiJKb3ljZSBLZW1ib2kiLCJwb3N0IjoiRnJvbnRlbmQgRW5naW5lZXIiLCJjb3VudHJ5X2NvZGVzIjoiW1wiS0VcIl0iLCJkZXYiOiIxIiwicGljIjoiZWdneS5wbmciLCJwcml2aWxlZ2UiOiJ7XCJ2aWV3X25ld19mZWF0dXJlXCI6IHRydWUsIFwicmVjb3JkX21wZXNhXCI6IHRydWUsIFwiY2hhdFwiOiB0cnVlLCBcImFwcHJvdmVfcGFydG5lcnNcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlcIjogdHJ1ZSwgXCJyZWNvcmRfbm90aWZpY2F0aW9uXCI6IHRydWUsIFwicmVjb3JkX2NoZXF1ZXNcIjogdHJ1ZSwgXCJyZWNvcmRfcGFydG5lcl93aXRoZHJhd2FsXCI6IHRydWUsIFwicmVjb3JkX3Byb21vX2NvZGVcIjogdHJ1ZSwgXCJyZWNvcmRfdXNlclwiOiB0cnVlLCBcInJlY29yZF9wYXNzX2NoYW5nZVwiOiB0cnVlLCBcImFwcHJvdmVfcHJlcGF5X2JpbGxpbmdcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlfYmlsbGluZ1wiOiB0cnVlLCBcImNoYW5nZV9hY2NvdW50X21hbmFnZXJcIjogdHJ1ZSwgXCJsb2NhdGlvbl9wcm94aW1pdHlcIjogdHJ1ZSwgXCJyZWFzc2lnbl9vcmRlcnNcIjogdHJ1ZSwgXCJ1cGRhdGVfZGVsaXZlcnlfc3RhdHVzXCI6dHJ1ZX0iLCJzZW5kX2RlcHRfaWQiOiIyIiwicm9sZSI6IjIiLCJwaG9uZSI6IjI1NDcxOTE2OTEyNCIsInNob3dfZWNvbW1lcmNlIjoiMCIsImFsbG93ZWRfb3JkZXJzIjpudWxsfSwibWFuYWdlZF9saXN0Ijp7fX0sInN0YXR1cyI6dHJ1ZSwiZXhwaXJ5IjoiODY0MDAifQ.Os2LfUt2f-n47NyhXpxfsCQmzpeArnHkt7QsBgJ7N1U',
    },
  },
  resources: [
    { name: 'orders', url: 'orders' },
    { name: 'exchangeRates', url: `exchange-rates` },
  ],
});
const jwtToken = process.env.jwtToken;
const baseUrl = process.env.baseUrl;
export const custom_state = () => ({});
export default {
  namespaced: true,
  state: () => {
    return {
      ...apix.getState(),
      token: null,
      jwtToken,
      baseUrl,
      breadcrumbs: [],
      customConfig,
      notification: {},
      orderColumns: ['dfcsdfs'],
      delayLabels: {
        pending: 'corfirmation',
        confirmed: ' pickup',
        picked: 'delivery',
      },
      cityAbbrev: {
        Nairobi: 'nbi',
        Kisumu: 'ksm',
        Mombasa: 'msa',
        Other: 'other',
      },
      vendorLabels: {
        6: '3T',
        10: '5T',
        13: '7T',
        14: '10T',
        17: '14T',
        18: '20T',
        19: '24T',
        20: '28T',
        25: 'F',
      },
    };
  },

  getters: {
    ...apix.getGetters(),
    ...custom_getters,
  },
  mutations: {
    ...apix.getMutations(),
    ...custom_mutations,
  },
  actions: {
    ...apix.getActions(),
    ...custom_actions,
  },
};
