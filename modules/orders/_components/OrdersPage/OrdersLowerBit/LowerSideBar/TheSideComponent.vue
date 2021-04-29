<template>
  <div class="box box-primary lower_sider_bar">
    <div class="map_custom" :id="`map_custom_${order.order_no}`">
      <img
        :src="
          `https://maps.googleapis.com/maps/api/staticmap?center=-1.300041,36.780792&zoom=13&size=351x200&maptype=roadmap&markers=color:blue%7Clabel:R%7C-1.300041,36.780792&key=${googleApiKey}`
        "
        width="351px"
        height="200px;"
      />
    </div>
    <span
      class="reload_map_kali"
      onclick="get_rider_map(<?php echo $rider_details['rider_id'];?>,'<?php echo $unique_order_id;?>');"
    >
      Reload
    </span>
    <TheRiderViewComponent :order="order" />
    <TheLogsComponent :order="order" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import TheLogsComponent from './TheLogsComponent';
import TheRiderViewComponent from './TheRiderViewComponent';

export default {
  name: 'TheSideComponent',
  components: {
    TheRiderViewComponent,
    TheLogsComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    googleApiKey() {
      return this.$env.GOOGLE_API_KEY;
    },
    ...mapState(['config']),
  },
};
</script>

<style>
.lower_sider_bar {
  padding-bottom: 1px;
}
</style>
