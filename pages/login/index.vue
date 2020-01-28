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
  mounted() {
    localStorage.removeItem('reloaded');
    const token = localStorage.getItem('jwtToken');
    if (token !== null) {
      this.$router.push('/orders');
    }
  },
  methods: {
    ...mapMutations({
      setToken: 'setToken',
      updateSession: 'setSession',
      clearToken: 'clearToken',
      setTokenExpiryStatus: 'setTokenExpiryStatus',
    }),
    signIn(data) {
      const token = data.token;
      const accessToken = token.access_token;
      const refreshToken = token.refresh_token;

      this.setToken(accessToken);
      this.setTokenExpiryStatus(false);
      localStorage.setItem('jwtToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      Cookie.set('jwt', accessToken);
      Cookie.set('refreshToken', refreshToken);

      this.$router.push('/orders');
    },
    signInError(error) {
      this.errors.push(error.message);
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
