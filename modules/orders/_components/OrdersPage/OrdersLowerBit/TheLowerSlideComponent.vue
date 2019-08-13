<template>
  <td
    colspan="9"
    class="order_view_lower_cell"
    :id="`order_view_lower${orderNo}`"
  >
    <div class="lower_slide_bit" :id="`bumba_${orderNo}`">
      <div class="row">
        <TheSideComponent :order-no="orderNo" />
        <TheMainComponent :order-no="orderNo" />
      </div>
    </div>
  </td>
</template>

<script>
import TheSideComponent from './LowerSideBar/TheSideComponent';
import TheMainComponent from './LowerMainBar/TheMainComponent';

export default {
  name: 'TheLowerSlideComponent',
  components: {
    TheSideComponent,
    TheMainComponent,
  },
  props: {
    orderno: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order,
    };
  },
};
</script>
<style>
order_view_lower_cell {
  padding: 0px;
  background-color: rgba(245, 245, 245, 0.56) !important;
  font-size: 13px;
}
</style>
