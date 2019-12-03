export default {
  methods: {
    register_store_module(moduleName, storeModule) {
      const store = this.$store;

      if (!(store && store.state && store.state[moduleName])) {
        store.registerModule(moduleName, storeModule);
      }
    },
  },
};
