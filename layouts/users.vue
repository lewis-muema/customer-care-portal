<template>
  <div class="wrapper" v-if="loggedUser !== null">
    <TheHeader :user="loggedUser" />
    <div class="content-wrapper full-width">
      <TheBreadCrumbView :breadcrumbs="breadcrumbs" />
      <TheMainSection />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TheHeader from '@/components/Navigation/TheHeader';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheMainSection from '@/components/UI/TheMainSection';
import TheFooter from '@/components/Navigation/TheFooter';
import SessionMxn from '@/mixins/session_mixin';

export default {
  middleware: ['check-auth', 'auth'],

  components: {
    TheHeader,
    TheBreadCrumbView,
    TheMainSection,
    TheFooter,
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
<style scoped>
.content {
  padding-top: 54px;
}
.wrapper {
  background-color: #ffffff;
}
</style>
