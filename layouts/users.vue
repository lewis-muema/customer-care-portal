<template>
  <div class="wrapper">
    <div class="content-wrapper full-width">
      <TheBreadCrumbView />
      <TheMainSection />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';
import TheMainSection from '@/components/UI/TheMainSection';
import TheFooter from '@/components/Navigation/TheFooter';

export default {
  components: {
    TheBreadCrumbView,
    TheMainSection,
    TheFooter,
  },
};
</script>
