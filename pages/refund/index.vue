<template>
  <TheUserPageComponent :user="user" />
</template>
<script>
import TheUserPageComponent from '~/modules/users/_components/TheUserPageComponent';

export default {
  layout: 'plain',
  components: {
    TheUserPageComponent,
  },
  computed: {
    user() {
      return 'refund';
    },
  },
};
</script>
