<template>
  <div>
    <p>Test</p>
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
