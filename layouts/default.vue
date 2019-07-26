<template>
  <div class="wrapper">
    <TheHeader />
    <TheSidenav />
    <div class="content-wrapper">
      <TheBreadCrumbView :breadcrumbs="breadcrumbs" />
      <TheTopBar />
      <TheMainSection />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TheHeader from '@/components/Navigation/TheHeader';
import TheSidenav from '@/components/Navigation/TheSidenav';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheTopBar from '@/components/TopBar/TheTopBar';
import TheFooter from '@/components/Navigation/TheFooter';
import TheMainSection from '@/components/UI/TheMainSection';

export default {
  components: {
    TheHeader,
    TheSidenav,
    TheBreadCrumbView,
    TheTopBar,
    TheFooter,
    TheMainSection,
  },
  head: {
    bodyAttrs: {
      class: 'hold-transition skin-blue sidebar-mini  sidebar-collapse',
    },
  },
  computed: {
    breadcrumbs() {
      return this.$store.getters.breadcrumbs;
    },
  },
};
</script>
