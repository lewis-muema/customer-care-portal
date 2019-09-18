<template>
  <no-ssr>
    <span>
      <div class="alert alert danger" v-if="errors.length > 0">
        {{ errors }}
      </div>
      <sendy-auth-social @authenticated="signIn" @error="signInError" />
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
      const token = data.token;
      this.setToken(token);
      localStorage.setItem('jwtToken', token);
      const tokenDuration = 24 * 60 * 60;
      const expirationDate = new Date().getTime() + tokenDuration;
      this.setLogoutTimer(tokenDuration);
      localStorage.setItem('tokenExpiration', expirationDate);
      Cookie.set('jwt', token);
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
<style scoped>
.sendy--social-auth {
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
}
.sendy--app-name {
  text-align: center !important;
}
.sendy--social-auth .sendy--app-name {
  margin: 100px 0 30px 0;
  padding: 0;
  text-align: center !important;
}
</style>
