<template>
  <div class="nps-container">
    <FulfilmentOutboundComponent />
  </div>
</template>
<script>
import FulfilmentOutboundComponent from '@/modules/fulfilment/outbound/Outbound.vue';

export default {
  components: {
    FulfilmentOutboundComponent,
  },
  layout: 'plain',
};
</script>
