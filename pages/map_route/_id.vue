<template>
  <div>
    <TheTrackingComponent :orderno="orderNo" />
  </div>
</template>
<script>
import TheTrackingComponent from '@/modules/tracking/tracking.vue';

export default {
  layout: 'map',
  components: {
    TheTrackingComponent,
  },
  data() {
    return {
      orderNo: this.$route.params.id,
    };
  },
  mounted() {
    console.log('order', this.$route.params);
  },
};
</script>
