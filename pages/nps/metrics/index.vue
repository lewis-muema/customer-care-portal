<template>
  <div class="nps-container">
    <TheNPSMetricsComponent />
  </div>
</template>
<script>
import TheNPSMetricsComponent from '@/modules/nps/_components/MetricsSection/TheMetricsView.vue';

export default {
  layout: 'plain',

  components: {
    TheNPSMetricsComponent,
  },
};
</script>
