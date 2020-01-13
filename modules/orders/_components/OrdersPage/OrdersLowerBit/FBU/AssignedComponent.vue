<template>
  <div class="assigned-component">
    <div class="assigned-component-tabs">
      <span>total orders</span><br />
      <span class="orders-counter">{{ order.freight_details.length }}</span
      ><br />
      <span>containers</span><br />
    </div>
    <div class="assigned-component-tabs">
      <span>assigned orders</span><br />
      <span class="orders-counter">0</span><br />
      <span>containers</span><br />
    </div>
    <div class="assigned-component-tabs">
      <span>unassigned orders</span><br />
      <span class="orders-counter">{{ order.freight_details.length }}</span
      ><br />
      <span>containers</span><br />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CreateOrderComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
};
</script>
