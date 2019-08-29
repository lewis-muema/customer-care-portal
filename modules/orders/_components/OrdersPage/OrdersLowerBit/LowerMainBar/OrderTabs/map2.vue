<template>
  <div class="content">
    <GmapMap
      ref="map"
      :center="mapCentreLocation"
      :zoom="13"
      map-type-id="roadmap"
      class=""
      :options="mapOptions"
      style="width: 100%; height: 446px; top: 0; left: 0;right: 0; bottom: 0;"
    >
    </GmapMap>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'TheMapHolderComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order.order_details,
      mapOptions: {
        // disableDefaultUI: true,
      },
      mapCentreLocation: {
        lat: -1.3084143,
        lng: 36.7658132,
      },
      markerOptions: {},
      mapLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/getMarkers',
      vendors: '$_orders/getVendors',
      polyline: '$_orders/getPolyline',
      tracking_data: '$_orders/$_tracking/getTrackingData',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
    }),
  },
  mounted() {
    // this.trackingDataRequest();
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
    });
    this.$store.dispatch('$_orders/connectMqtt');
  },
  methods: {
    ...mapActions({
      setTrackingData: '$_orders/setTrackingData',
    }),
    async trackingDataRequest() {
      const payload = {
        app: 'NODE_PRIVATE_API',
        endpoint: 'pending_delivery',
        apiKey: false,
        params: { order_no: this.orderDetails.order_no },
      };
      const data = await this.setTrackingData(payload);
      // this.dispatchList = data;
      // this.dispatchStatus = data.status;
      // this.partnerList = data.partner_list;
    },
  },
};
</script>
