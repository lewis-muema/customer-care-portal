<template>
  <div class="col-md-4">
    <div class="box box-primary lower_sider_bar">
      <TheSideMapComponent :order-details="orderDetails" />
      <TheRiderViewComponent />
      <TheLogsComponent :order-details="orderDetails" />

      {{ orderDetails }}
    </div>
  </div>
</template>

<script>
import TheSideMapComponent from '@/components/OrdersPage/OrdersLowerBit/LowerSideBar/TheSideMapComponent';
import TheLogsComponent from '@/components/OrdersPage/OrdersLowerBit/LowerSideBar/TheLogsComponent';
import TheRiderViewComponent from '@/components/OrdersPage/OrdersLowerBit/LowerSideBar/TheRiderViewComponent';

export default {
  name: 'TheSideComponent',
  components: {
    TheSideMapComponent,
    TheRiderViewComponent,
    TheLogsComponent,
  },
  props: {
    orderDetails: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.lower_sider_bar {
  padding-bottom: 1px;
}
</style>
