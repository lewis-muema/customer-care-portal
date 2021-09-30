<template>
  <div class="nps-container fulfilment-font">
    <FulfilmentReturnsComponent />
  </div>
</template>
<script>
import FulfilmentReturnsComponent from '@/modules/fulfilment/returns/Returns.vue';

export default {
  components: {
    FulfilmentReturnsComponent,
  },
  layout: 'plain',
};
</script>
