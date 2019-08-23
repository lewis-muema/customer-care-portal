<template>
  <div class="col-md-4">
    <div class="box box-primary lower_sider_bar">
      <div class="map_custom" :id="`map_custom_${orderDetails.order_no}`">
        <img
          :src="
            `https://maps.googleapis.com/maps/api/staticmap?center=-1.300041,36.780792&zoom=13&size=351x200&maptype=roadmap&markers=color:blue%7Clabel:R%7C-1.300041,36.780792&key=${this.customConfig.GOOGL_API_KEY}`
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
      <TheRiderViewComponent :order="orderDetails.rider_details" />
      <TheLogsComponent :order="orderDetails" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// import TheSideMapComponent from './TheSideMapComponent';
import TheLogsComponent from './TheLogsComponent';
import TheRiderViewComponent from './TheRiderViewComponent';

export default {
  name: 'TheSideComponent',
  components: {
    // TheSideMapComponent,
    TheRiderViewComponent,
    TheLogsComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
    };
  },
  computed: {
    ...mapState(['customConfig']),
  },
  mounted() {
    console.log('customConfig', this.orderDetails);
  },
};
</script>

<style>
.lower_sider_bar {
  padding-bottom: 1px;
}
</style>
