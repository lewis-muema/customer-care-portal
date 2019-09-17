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

      // const partsOfToken = token.split('.');
      // const middleString = atob(partsOfToken[1]);
      // const { payload } = JSON.parse(middleString);

      // const session_data = payload;
      // const json_session = session_data;
      // Cookie.set('sessionData', json_session);
      // this.setSession(json_session);

      // this.updateSession(session_data);
      this.$router.push('/orders');
    },
    signInError(error) {
      this.errors.push(error.message);
      console.log('error', error);
    },
    setLogoutTimer(duration) {
      setTimeout(() => {
        this.clearToken();
      }, duration);
    },
  },
};
</script>
// setAuthenticationToken
