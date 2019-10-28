<template>
  <no-ssr>
    <span>
      <div class="alert alert danger" v-if="errors.length > 0">
        {{ errors }}
      </div>
      <sendy-auth-social
        @authenticated="signIn"
        @error="signInError"
        app-name="SENDY"
        button-text="Sign in with Google"
      />
    </span>
  </no-ssr>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Cookie from 'js-cookie';
import SessionMxn from '@/mixins/session_mixin';

export default {
  name: 'login',
  layout: 'login',
  mixins: [SessionMxn],
  data() {
    return {
      errors: [],
    };
  },

  methods: {
    ...mapMutations({
      setToken: 'setToken',
      updateSession: 'setSession',
      clearToken: 'clearToken',
    }),
    signIn(data) {
      const refreshToken = data.refresh_token;
      const accessToken = data.access_token;
      this.setToken(accessToken);
      localStorage.setItem('jwtToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const tokenDuration = 24 * 60 * 60;
      const expirationDate = new Date().getTime() + tokenDuration;
      this.setLogoutTimer(tokenDuration);
      localStorage.setItem('tokenExpiration', expirationDate);
      Cookie.set('jwt', accessToken);
      Cookie.set('tokenExpiration', expirationDate);

      this.$router.push('/orders');
    },
    signInError(error) {
      this.errors.push(error.message);
    },
    setLogoutTimer(duration) {
      setTimeout(() => {
        this.clearToken();
      }, duration);
    },
  },
};
</script>
<style>
.sendy--social-auth {
  height: auto;
  position: absolute;
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
</style>
