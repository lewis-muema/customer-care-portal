<template>
  <div>
    <TheSearchComponent />
    <TheUserTableComponent />
  </div>
</template>

<script>
import TheSearchComponent from '@/components/UsersPage/TheSearchComponent';
import TheUserTableComponent from '@/components/UsersPage/TheUserTableComponent';

export default {
  layout: 'users',
  name: 'TheUserPageComponent',
  components: {
    TheSearchComponent,
    TheUserTableComponent,
  },
};
</script>
