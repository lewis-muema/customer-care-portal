<template>
  <no-ssr>
    <span>
      <div class="holder">
        <div class="signin-error">
          <span v-if="getloginErrors !== null" v-html="getloginErrors"> </span>
        </div>
        <sendy-auth-social
          @authenticated="signIn"
          @error="signInError"
          app-name="SENDY"
          button-text="Sign in with Google"
        />
      </div>
    </span>
  </no-ssr>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import Cookie from 'js-cookie';
import SessionMxn from '@/mixins/session_mixin';

export default {
  name: 'login',
  layout: 'login',
  mixins: [SessionMxn],
  computed: {
    ...mapGetters(['getloginErrors']),
  },

  mounted() {
    this.clearCache();
  },
  methods: {
    ...mapMutations({
      setToken: 'setToken',
      updateSession: 'setSession',
      clearToken: 'clearToken',
      setTokenExpiryStatus: 'setTokenExpiryStatus',
      setLoginErrors: 'setLoginErrors',
    }),
    ...mapActions({
      clearCache: 'clearCache',
      fetchEnvironmentVariables: 'fetch_environment_variables',
    }),
    async signIn(data) {
      const token = data.token;
      const accessToken = token.access_token;
      const refreshToken = token.refresh_token;

      this.setToken(accessToken);
      this.setTokenExpiryStatus(false);
      localStorage.setItem('jwtToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      Cookie.set('jwt', accessToken);
      Cookie.set('refreshToken', refreshToken);

      await this.fetchKeys();

      this.$router.push('/orders');
    },
    // eslint-disable-next-line handle-callback-err,node/handle-callback-err
    signInError(error) {
      this.setLoginErrors(
        'Sorry, your details could not match.<br /> Please make sure you are using your Sendy email.',
      );
    },
    setLogoutTimer(duration) {
      setTimeout(() => {
        this.clearToken();
      }, duration);
    },
    async fetchKeys() {
      const environmentVariables = await this.fetchEnvironmentVariables();
    },
  },
};
</script>
<style>
.sendy--social-auth {
  height: auto;
  top: 0;
  bottom: 0;
}
.sendy--social-auth h1.sendy--app-name {
  text-align: center;
  font-size: 35px;
  margin-bottom: 25px;
  font-weight: 300;
}
.sendy--social-auth div.sendy--form {
  text-align: center;
  color: #666;
}
.signin-error {
  color: #f57f20;
  margin: 100px 0 0px 0;
  text-align: center;
}
.holder {
  position: absolute;
  width: 100%;
  height: 100vh;
  background: #d2d6de;
}
.sendy--social-auth .sendy--app-name {
  margin: 0 0 30px 0 !important;
  padding: 0;
}
</style>
