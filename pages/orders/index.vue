<template>
  <!-- <TheSearchComponent /> -->
  <TheOrdersComponent />
</template>
<script>
import TheOrdersComponent from '@/components/OrdersPage/TheOrdersComponent';
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
