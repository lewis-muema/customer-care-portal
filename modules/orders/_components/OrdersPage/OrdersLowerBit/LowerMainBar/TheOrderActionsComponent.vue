<template>
  <div class="box box-primary order-main-lowerslide ">
    <div class="body-box lower_slide_body">
      <!-- <div class="tabs custom_more"> -->
      <TheButtonsComponent :order="order" />
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import TheButtonsComponent from './OrderActions/TheButtonsComponent';

export default {
  name: 'TheOrderActionsComponent',
  components: {
    TheButtonsComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
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
.action-button {
  width: 200px;
}
</style>
