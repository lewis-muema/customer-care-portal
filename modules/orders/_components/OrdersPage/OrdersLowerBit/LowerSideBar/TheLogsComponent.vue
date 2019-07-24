<template>
  <div>logs go here</div>
</template>
<script>
export default {
  name: 'TheLogsComponent',
  props: {
    orderDetails: {
      type: Object,
      required: true,
    },
  },
};
</script>
