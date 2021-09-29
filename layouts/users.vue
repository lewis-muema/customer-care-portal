<template>
  <div class="wrapper" v-if="loggedUser !== null">
    <TheHeader :user="loggedUser" />
    <div class="content-wrapper full-width">
      <span v-if="getTokenExpiryStatus">
        <TheGlobalNotification />
      </span>
      <span v-else>
        <TheBreadCrumbView :breadcrumbs="breadcrumbs" />
        <TheMainSection />
      </span>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Base64 } from 'js-base64';
import TheHeader from '@/components/Navigation/TheHeader';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheMainSection from '@/components/UI/TheMainSection';
import TheFooter from '@/components/Navigation/TheFooter';
import SessionMxn from '@/mixins/session_mixin';
import TheGlobalNotification from '@/components/UI/TheGlobalNotification';

export default {
  middleware: ['check-auth', 'auth'],

  components: {
    TheHeader,
    TheBreadCrumbView,
    TheMainSection,
    TheFooter,
    TheGlobalNotification,
  },
  mixins: [SessionMxn],
  data() {
    return {
      logged_user: '',
      loggedUser: null,
      token: null,
      name: 'users',
    };
  },
  head: {
    bodyAttrs: {
      class: 'hold-transition skin-blue sidebar-mini  sidebar-collapse',
    },
  },
  computed: {
    ...mapGetters(['getAuthenticationToken', 'getTokenExpiryStatus']),

    breadcrumbs() {
      return this.$store.getters.breadcrumbs;
    },
  },
  async mounted() {
    const environmentVariables = !this.getEnvironmentVariables
      ? await this.fetchEnvironmentVariables()
      : this.getEnvironmentVariables;

    this.getloggedUser();
  },

  methods: {
    ...mapMutations({
      updateSession: 'setSession',
    }),
    ...mapActions({
      fetchEnvironmentVariables: 'fetch_environment_variables',
    }),

    getloggedUser() {
      const storedToken = localStorage.getItem('jwtToken');
      const token =
        this.getAuthenticationToken === null
          ? storedToken
          : this.getAuthenticationToken;

      if (token && token !== '' && storedToken !== 'undefined') {
        const partsOfToken = token.split('.');
        const middleString = Base64.decode(partsOfToken[1]);
        const payload = JSON.parse(middleString);
        this.setSession(payload);
        this.updateSession(payload);

        const userData = payload.payload.data;
        this.$apm.setUserContext({
          id: userData.admin_id,
          username: userData.name,
          email: userData.email,
        });

        return (this.loggedUser = payload);
      } else {
        this.$router.push('/login');
      }
    },
  },
};
</script>
<style scoped>
.content {
  padding-top: 54px;
}
.wrapper {
  background-color: #ffffff;
}
</style>
