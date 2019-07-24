<template>
  <span>
    <div class="map_custom" :id="`map_custom_${orderDetails.orderNo}`">
      <h2 class="center">put map here</h2>
    </div>
    <span
      class="reload_map_kali"
      onclick="get_rider_map(<?php echo $rider_details['rider_id'];?>,'<?php echo $unique_order_id;?>');"
    >
      Reload
    </span>
  </span>
</template>
<script>
export default {
  name: 'TheSideMapComponent',
  props: {
    orderDetails: {
      type: Object,
      required: true,
    },
  },
};
</script>
