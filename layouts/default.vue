<template>
  <div class="wrapper" v-if="userData !== null">
    <TheHeader :user="userData" />
    <TheSidenav :user="userData" />
    <div class="content-wrapper">
      <TheBreadCrumbView :breadcrumbs="breadcrumbs" />
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
      userData: null,
      token: null,
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
    this.loggedUser();
  },
  methods: {
    ...mapMutations({
      updateSession: 'setSession',
    }),
    loggedUser() {
      const token = this.getAuthenticationToken;
      const partsOfToken = token.split('.');
      const middleString = atob(partsOfToken[1]);
      const payload = JSON.parse(middleString);
      this.setSession(payload);
      this.updateSession(payload);

      return (this.userData = payload);
    },
  },
};
</script>
