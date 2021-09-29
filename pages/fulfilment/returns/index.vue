<template>
  <div class="nps-container">
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
