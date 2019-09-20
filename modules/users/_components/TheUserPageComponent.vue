<template>
  <div>
    <TheBreadCrumbView :route="user" />

    <TheSearchComponent :user="user" />
    <TheUserTableComponent />
  </div>
</template>

<script>
import TheSearchComponent from '~/modules/users/_components/TheSearchComponent';
import TheUserTableComponent from '~/modules/users/_components/TheUserTableComponent';
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
