<template>
  <tr
    class="order_row_home_lower hidden"
    :id="`child_row_${orderDetails.orderNo}`"
  >
    <td
      colspan="9"
      class="order_view_lower_cell"
      :id="`order_view_lower${orderDetails.orderNo}`"
    >
      <div class="lower_slide_bit" :id="`bumba_${orderDetails.orderNo}`">
        <div class="row">
          <TheSideComponent :order-details="orderDetails" />
          <TheMainComponent :order-details="orderDetails" />
        </div>
      </div>
    </td>
  </tr>
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
    orderDetails: {
      type: Object,
      required: true,
    },
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
