<template>
  <div class="nps-container">
    <PromocodesList />
  </div>
</template>
<script>
export default {
  layout: 'plain',

  components: {
    PromocodesList: () => import('@/modules/promocodes/Coupon.vue'),
  },
};
</script>
