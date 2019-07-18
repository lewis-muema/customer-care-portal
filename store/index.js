import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
      breadcrumbs: [],
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      setbreadcrumbs(state, breadcrumbs, routeName) {
        state.breadcrumbs = breadcrumbs;
      },
    },
    actions: {
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts);
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      breadcrumbs(state) {
        return state.breadcrumbs;
      },
    },
  });
};

export default createStore;
