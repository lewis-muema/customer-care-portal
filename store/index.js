import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
      breadcrumbs: [],
      orderDetails: { orderNo: 'AC2728669-I1C' },
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      setbreadcrumbs(state, breadcrumbs, routeName) {
        state.breadcrumbs = breadcrumbs;
      },
      setOrderDetails(state, orderDetails) {
        state.orderDetails = orderDetails;
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
      orderDetails(state) {
        return state.orderDetails;
      },
    },
  });
};

export default createStore;
