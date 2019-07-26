// global functions (es6)
import axios from 'axios';

export const updateValue = ({ commit }, payload) => {
  commit('updateValue', payload);
};

export const setPosts = (vuexContext, posts) => {
  vuexContext.commit('setPosts', posts);
};

const environment = process.env.DOCKER_ENV;
const customConfigsVar = process.env.customConfigs.customConfig;
const customConfig = customConfigsVar[environment];

export default {
  requestAxiosPost({ state, commit }, payload) {
    const baseUrl = window.location.origin;
    const url = customConfig[payload.app];
    const apikey = process.env.BACKEND_API_KEY;
    // add api key - if request is going to the backend
    if (payload.app === 'BACKEND_CUSTOMERS_APP') {
      payload.endpoint = `${payload.endpoint}?apikey=${apikey}`;
    }
    let config = {};

    // check if payload is a string here and change the content type
    if ('params' in payload) {
      payload.values = payload.params;
      if (typeof payload.params === 'object') {
        payload.values = JSON.stringify(payload.params);
      }
    } else if (typeof payload.values === 'object') {
      // assume we used values
      payload.values = JSON.stringify(payload.values);
    }
    localStorage.setItem(
      'jwtToken',
      'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7ImRhdGEiOnsiYWRtaW5fdHlwZSI6IjAiLCJhZG1pbl9pZCI6IjExMCIsImVjb21tZXJjZV9vbmx5IjoiMCIsInN0YXR1cyI6IjEiLCJlbWFpbCI6ImpveWNlQHNlbmR5aXQuY29tIiwiYWdlbnRfZXh0ZW5zaW9uIjoiMCIsImV4dGVybmFsX3N0YXR1cyI6IjAiLCJjb3BfaWQiOm51bGwsIm5hbWUiOiJKb3ljZSBLZW1ib2kiLCJwb3N0IjoiRnJvbnRlbmQgRW5naW5lZXIiLCJjb3VudHJ5X2NvZGVzIjoiW1wiS0VcIl0iLCJkZXYiOiIxIiwicGljIjoiZWdneS5wbmciLCJwcml2aWxlZ2UiOiJ7XCJ2aWV3X25ld19mZWF0dXJlXCI6IHRydWUsIFwicmVjb3JkX21wZXNhXCI6IHRydWUsIFwiY2hhdFwiOiB0cnVlLCBcImFwcHJvdmVfcGFydG5lcnNcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlcIjogdHJ1ZSwgXCJyZWNvcmRfbm90aWZpY2F0aW9uXCI6IHRydWUsIFwicmVjb3JkX2NoZXF1ZXNcIjogdHJ1ZSwgXCJyZWNvcmRfcGFydG5lcl93aXRoZHJhd2FsXCI6IHRydWUsIFwicmVjb3JkX3Byb21vX2NvZGVcIjogdHJ1ZSwgXCJyZWNvcmRfdXNlclwiOiB0cnVlLCBcInJlY29yZF9wYXNzX2NoYW5nZVwiOiB0cnVlLCBcImFwcHJvdmVfcHJlcGF5X2JpbGxpbmdcIjogdHJ1ZSwgXCJhcHByb3ZlX3Bvc3RwYXlfYmlsbGluZ1wiOiB0cnVlLCBcImNoYW5nZV9hY2NvdW50X21hbmFnZXJcIjogdHJ1ZSwgXCJsb2NhdGlvbl9wcm94aW1pdHlcIjogdHJ1ZSwgXCJyZWFzc2lnbl9vcmRlcnNcIjogdHJ1ZSwgXCJ1cGRhdGVfZGVsaXZlcnlfc3RhdHVzXCI6dHJ1ZX0iLCJzZW5kX2RlcHRfaWQiOiIyIiwicm9sZSI6IjIiLCJwaG9uZSI6IjI1NDcxOTE2OTEyNCIsInNob3dfZWNvbW1lcmNlIjoiMCIsImFsbG93ZWRfb3JkZXJzIjpudWxsfSwibWFuYWdlZF9saXN0Ijp7fX0sInN0YXR1cyI6dHJ1ZSwiZXhwaXJ5IjoiODY0MDAifQ.xaz0h4YaC_OB2VDKT6kM_haCrbzgdtyw32r6WrW6DW4',
    );
    const jwtToken = localStorage.getItem('jwtToken');
    const requestedPayload = payload.endpoint;
    const externalEndpoints = ['sign_up_check', 'sign_in'];
    // set content type to json
    if (externalEndpoints.includes(requestedPayload)) {
      config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
      config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtToken,
        },
      };
    } else {
      const notification = {
        title: 'Your session has expired!',
        level: 2,
        message: 'You will be redirected to the login page after 5 seconds.',
      };
      // !!!!FIX ME :: set notifications here
    }
    return new Promise((resolve, reject) => {
      axios.post(`${url}${payload.endpoint}`, payload.values, config).then(
        response => {
          if (response.data === 401 || response.data === 403) {
            // !!!!FIX ME :: set notifications here
            const notification = {
              title: 'Something went wrong!',
              level: 2,
              message: 'Please log out and log in again.',
            };
            commit('setNotification', notification);
            commit('setNotificationStatus', true);
          } else {
            resolve(response);
          }
        },
        error => {
          reject(error);
        },
      );
    });
  },

  setBreadCrumbs({ commit }) {
    const breadcrumbsObject = {
      peer: {
        name: 'Peer',
        description: 'clients',
        mainName: 'Home',
        category: 'Clients',
        subCategory: 'Peer',
      },

      biz: {
        name: 'biz',
        description: 1,
        mainName: 'dfff',
        category: '',
        subCategory: '',
      },
    };
    const routeName = $nuxt.$route.name;
    // Fix this
    commit('setbreadcrumbs', breadcrumbsObject.peer);
  },
};
