<template>
  <div class="box box-primary order-main-lowerslide ">
    <div class="body-box lower_slide_body">
      <div class="tabs custom_more">
        <TheButtonsComponent />
      </div>
    </div>
  </div>
</template>
<script>
import TheButtonsComponent from '@/components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderActions/TheButtonsComponent';

export default {
  name: 'TheOrderActionsComponent',
  components: {
    TheButtonsComponent,
  },
};
</script>
<style>
.order-main-lowerslide {
  min-height: 231px;
}
.lower_slide_body {
  padding: 10px 10px 0px 10px;
}
</style>
