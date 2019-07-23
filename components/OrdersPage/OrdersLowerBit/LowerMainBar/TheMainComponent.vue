<template>
  <div class="col-md-8">
    <TheOrderActionsComponent />
    <TheOrderDetailsComponent />
  </div>
</template>

<script>
import TheOrderActionsComponent from '@/components/OrdersPage/OrdersLowerBit/LowerMainBar/TheOrderActionsComponent';
import TheOrderDetailsComponent from '@/components/OrdersPage/OrdersLowerBit/LowerMainBar/TheOrderDetailsComponent';

export default {
  name: 'TheMainComponent',
  components: {
    TheOrderActionsComponent,
    TheOrderDetailsComponent,
  },
};
</script>
