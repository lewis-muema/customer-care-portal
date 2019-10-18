<template> </template>
<script>
// import config from '~/config/configs';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      STRIPE_SECRET: process.env.STRIPE_SECRET,
    };
  },
  computed: {
    ...mapState(['config']),
  },
  mounted() {
    console.log('STRIPE_SECRET', this.config);
  },
};
</script>
