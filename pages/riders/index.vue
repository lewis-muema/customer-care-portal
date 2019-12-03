<template>
  <TheUserPageComponent :user="user" />
</template>
<script>
import TheUserPageComponent from '~/modules/users/_components/TheUserPageComponent';

export default {
  layout: 'users',
  components: {
    TheUserPageComponent,
  },
  computed: {
    user() {
      return 'riders';
    },
  },
};
</script>
