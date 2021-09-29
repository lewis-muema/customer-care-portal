<template>
  <div class="nps-container">
    <FulfilmentHubComponent />
  </div>
</template>
<script>
import FulfilmentHubComponent from '@/modules/fulfilment/hubs/Hubs.vue';

export default {
  components: {
    FulfilmentHubComponent,
  },
  layout: 'plain',
};
</script>
