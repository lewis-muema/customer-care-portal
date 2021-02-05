<template>
  <div class="wrapper" v-if="loggedUser !== null">
    <TheHeader :user="loggedUser" />
    <TheSidenav :user="loggedUser" />
    <div class="content-wrapper">
      <span v-if="getTokenExpiryStatus">
        <TheGlobalNotification />
      </span>
      <span v-else>
        <TheBreadCrumbView :route="name" />
        <TheTopBar />
        <TheMainSection />
      </span>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Base64 } from 'js-base64';
import TheHeader from '@/components/Navigation/TheHeader';
import TheSidenav from '@/components/Navigation/TheSidenav';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheTopBar from '@/components/TopBar/TheTopBar';
import TheFooter from '@/components/Navigation/TheFooter';
import TheMainSection from '@/components/UI/TheMainSection';
import SessionMxn from '@/mixins/session_mixin';
import TheGlobalNotification from '@/components/UI/TheGlobalNotification';

export default {
  middleware: ['check-auth', 'auth'],

  components: {
    TheHeader,
    TheSidenav,
    TheBreadCrumbView,
    TheTopBar,
    TheFooter,
    TheMainSection,
    TheGlobalNotification,
  },
  mixins: [SessionMxn],
  data() {
    return {
      logged_user: '',
      loggedUser: null,
      token: null,
      name: 'orders',
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
  mounted() {
    this.getloggedUser();
  },
  methods: {
    ...mapMutations({
      updateSession: 'setSession',
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
