<template>
  <div class="nps-container fulfilment-font">
    <FulfilmentInboundComponent />
  </div>
</template>
<script>
import FulfilmentInboundComponent from '@/modules/fulfilment/inbound/Inbound.vue';

export default {
  components: {
    FulfilmentInboundComponent,
  },
  layout: 'plain',
};
</script>
