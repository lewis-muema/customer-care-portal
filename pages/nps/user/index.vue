<template>
  <div class="nps-container">
    <TheNPSUserComponent />
  </div>
</template>
<script>
import TheNPSUserComponent from '@/modules/nps/_components/UserSection/TheUserView.vue';

export default {
  layout: 'plain',

  components: {
    TheNPSUserComponent,
  },
};
</script>
