<template>
  <div class="box box-info">
    <div class="box-body">
      <div class="error-page">
        <div class="global-notification" v-if="getTokenExpiryStatus">
          <h3>An error was Encountered!</h3>
          <h6 class="text-danger">
            <strong>Error: </strong> Your token has expired. kindly logout and
            login again
          </h6>
          <h6><strong>Error Code: </strong> 403</h6>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheGlobalNotification',
  computed: {
    ...mapGetters(['getBusinessUnits', 'getTokenExpiryStatus']),
  },
  methods: {
    ...mapMutations({
      setTokenExpiryStatus: 'setTokenExpiryStatus',
    }),
    ...mapActions(['logout']),

    redirect() {
      setTimeout(() => {
        this.onLogout();
      }, 1000);
    },
    async onLogout() {
      try {
        await this.logout();
        localStorage.clear();
        await this.$router.push('/login');
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      } catch (e) {
        return e;
      }
    },
  },
};
</script>
