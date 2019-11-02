<template>
  <TheOrdersComponent />
</template>
<script>
import TheOrdersComponent from '@/modules/orders/orders.vue';

export default {
  components: {
    TheOrdersComponent,
  },
  mounted() {
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded');
    } else {
      localStorage.setItem('reloaded', '1');
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  },
};
</script>
