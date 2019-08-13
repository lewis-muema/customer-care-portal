<template>
  <div class="col-md-4">
    <div class="box box-primary lower_sider_bar">
      <!-- <TheSideMapComponent :order-details="orderDetails" />
      <TheRiderViewComponent />
      <TheLogsComponent :order-details="orderDetails" /> -->

      <!-- {{ orderDetails }} -->
    </div>
  </div>
</template>

<script>
import TheSideMapComponent from './TheSideMapComponent';
import TheLogsComponent from './TheLogsComponent';
import TheRiderViewComponent from './TheRiderViewComponent';

export default {
  name: 'TheSideComponent',
  components: {
    // TheSideMapComponent,
    // TheRiderViewComponent,
    // TheLogsComponent,
  },
  props: {},
};
</script>

<style>
.lower_sider_bar {
  padding-bottom: 1px;
}
</style>
