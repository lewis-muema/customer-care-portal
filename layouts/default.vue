<template>
  <div class="wrapper" v-if="loggedUser !== null">
    <TheHeader :user="loggedUser" />
    <TheSidenav :user="loggedUser" />
    <div class="content-wrapper">
      <TheBreadCrumbView :route="name" />
      <TheTopBar />
      <TheMainSection />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TheHeader from '@/components/Navigation/TheHeader';
import TheSidenav from '@/components/Navigation/TheSidenav';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheTopBar from '@/components/TopBar/TheTopBar';
import TheFooter from '@/components/Navigation/TheFooter';
import TheMainSection from '@/components/UI/TheMainSection';
import SessionMxn from '@/mixins/session_mixin';

export default {
  middleware: ['check-auth', 'auth'],

  components: {
    TheHeader,
    TheSidenav,
    TheBreadCrumbView,
    TheTopBar,
    TheFooter,
    TheMainSection,
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
    ...mapGetters(['getAuthenticationToken']),

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
      const token = this.getAuthenticationToken;
      const partsOfToken = token.split('.');
      const middleString = atob(partsOfToken[1]);
      const payload = JSON.parse(middleString);
      this.setSession(payload);
      this.updateSession(payload);

      return (this.loggedUser = payload);
    },
  },
};
</script>
