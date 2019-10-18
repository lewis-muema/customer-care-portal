<template>
  <header
    class="main-header"
    style="position: fixed;
    width: 100%;"
  >
    <TheLogo />
    <TheMainNav :user="user" />
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import SessionMxn from '@/mixins/session_mixin';
import TheLogo from '@/components/Navigation/TheLogo';
import TheMainNav from '@/components/Navigation/TheMainNav';

export default {
  name: 'TheHeader',

  components: {
    TheLogo,
    TheMainNav,
  },
  mixins: [SessionMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
