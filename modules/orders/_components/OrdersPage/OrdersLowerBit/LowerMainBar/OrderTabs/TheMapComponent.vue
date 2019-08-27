<template>
  <div>
    {{ mapRoute }}
    <input
      type="hidden"
      :id="`load_map_val_${orderDetails.order_no}`"
      value="0"
      :ref="`load_map_val_${orderDetails.order_no}`"
    />
    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
      <iframe
        class="embed-responsive-item"
        :src="`${mapRoute}`"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'TheMapComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order.order_details,
      mapRoute: null,
    };
  },
  computed: {
    ...mapState(['baseUrl']),
  },
  mounted() {
    this.mapRoute = `${this.baseUrl}/map_route/${this.orderDetails.order_no}`;
    this.load_map();
  },
  methods: {
    load_map() {
      const map_holder = document.getElementById(
        `load_map_val_${this.orderDetails.order_no}`,
      );
      const load_map_val = parseInt(map_holder.value);

      console.log('id', load_map_val);
    },
  },
};
</script>
