// global functions (es6)
import axios from 'axios';

const environment = process.env.DOCKER_ENV;
const customConfigsVar = process.env.customConfigs.customConfig;
const customConfig = customConfigsVar[environment];

export default {
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
