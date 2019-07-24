<template>
  <!-- <TheSearchComponent /> -->
  <TheOrdersComponent />
</template>
<script>
import TheOrdersComponent from '@/modules/orders/orders.vue';
// import TheSearchComponent from '@/components/OrdersPage/TheSearchComponent';
export default {
  components: {
    // TheSearchComponent,
    TheOrdersComponent,
  },
  asyncData(context) {
    console.log(context.route.name);
  },
};
</script>
