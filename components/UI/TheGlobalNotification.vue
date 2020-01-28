<template> </template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TheGlobalNotification',
  async mounted() {
    this.setLoginErrors(
      'Sorry, your session has expired.<br /> Please Login again.',
    );
    await this.clearCache();
    await this.$router.push('/login');
  },
  methods: {
    ...mapMutations({
      setLoginErrors: 'setLoginErrors',
    }),
    ...mapActions(['clearCache']),
  },
};
</script>
