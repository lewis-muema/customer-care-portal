<template>
  <header
    class="main-header"
    style="position: fixed;
    width: 100%;"
  >
    <TheLogo />
    <TheMainNav />
  </header>
</template>

<script>
import TheLogo from '@/components/Navigation/TheLogo';
import TheMainNav from '@/components/Navigation/TheMainNav';

export default {
  name: 'TheHeader',
  components: {
    TheLogo,
    TheMainNav,
  },
  asyncData(context) {
    console.log('context.route.name');
  },
};
</script>
