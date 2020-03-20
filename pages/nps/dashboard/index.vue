<template>
  <div class="nps-container">
    <TheNPSDashboardComponent />
  </div>
</template>
<script>
import TheNPSDashboardComponent from '@/modules/nps/dashboard.vue';

export default {
  layout: 'plain',

  components: {
    TheNPSDashboardComponent,
  },
};
</script>
