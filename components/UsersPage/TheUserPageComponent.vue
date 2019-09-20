<template>
  <div>
    <TheBreadCrumbView :route="user" />

    <TheSearchComponent />
    <TheUserTableComponent />
  </div>
</template>

<script>
import TheSearchComponent from '@/components/UsersPage/TheSearchComponent';
import TheUserTableComponent from '@/components/UsersPage/TheUserTableComponent';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';

export default {
  name: 'TheUserPageComponent',
  layout: 'users',

  components: {
    TheSearchComponent,
    TheUserTableComponent,
    TheBreadCrumbView,
  },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
};
</script>
