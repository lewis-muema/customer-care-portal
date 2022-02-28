<template>
  <div class="nps-container fulfilment-font">
    <FulfilmentSellerComponent />
  </div>
</template>
<script>
import FulfilmentSellerComponent from '@/modules/fulfilment/seller/Seller.vue';

export default {
  components: {
    FulfilmentSellerComponent,
  },
  layout: 'plain',
};
</script>
