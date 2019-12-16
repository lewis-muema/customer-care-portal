<template>
  <div class="assigned-component">
    <div class="assigned-component-tabs">
      <span>total orders</span><br />
      <span class="orders-counter">10</span><br />
      <span>containers</span><br />
    </div>
    <div class="assigned-component-tabs">
      <span>assigned orders</span><br />
      <span class="orders-counter">8</span><br />
      <span>containers</span><br />
    </div>
    <div class="assigned-component-tabs">
      <span>unassigned orders</span><br />
      <span class="orders-counter">2</span><br />
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
