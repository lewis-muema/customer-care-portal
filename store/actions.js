// global functions (es6)
export const updateValue = ({ commit }, payload) => {
  commit('updateValue', payload);
};

export const setPosts = (vuexContext, posts) => {
  vuexContext.commit('setPosts', posts);
};
