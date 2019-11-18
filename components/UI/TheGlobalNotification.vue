<template>
  <div class="box box-info">
    <div class="box-body">
      <div class="error-page">
        <div class="global-notification" v-if="getTokenExpiryStatus">
          <h3>An error was Encountered!</h3>
          <h6 class="text-danger">
            <strong>Error: </strong> Your token has expired. You will be logged
            out and redirected to login shortly.
            {{ redirect() }}
          </h6>
          <h6 class="text-danger">
            <small>
              (incase you are not logged out automatically, kindly logout and
              login again)
            </small>
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
      await this.logout();
      this.setTokenExpiryStatus(false);
      this.$router.push('/login');
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    },
  },
};
</script>
