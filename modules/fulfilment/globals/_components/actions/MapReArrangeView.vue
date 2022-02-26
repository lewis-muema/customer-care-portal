<template>
  <el-dialog
    :visible.sync="getMapDialogVisible"
    center
    width="84%"
    top="10vh"
    class="dialogOrder"
    :show-close="false"
    append-to-body
  >
    <el-row :gutter="20">
      <el-col :span="18" class="mapsstyle">
        <div class="">
          <el-button
            @click="removeMapDialog()"
            class="mapdialog"
            icon="el-icon-close"
            circle
          ></el-button>
          <gmap-map
            ref="mapRef"
            :center="center"
            :zoom="10"
            map-type-id="roadmap"
            style="width: 886px; height: 600px"
            :options="options"
          >
            <div v-if="mapLoaded">
              <gmap-marker
                v-for="(m, index) in markers"
                :key="index"
                :position="{
                  lat: m.lat,
                  lng: m.lng,
                }"
                :clickable="true"
                :draggable="false"
                :icon="m.icon"
                @click="center = m.position"
              />
            </div>
            <gmap-polyline
              v-if="typeof getRouteDistance === 'object' && mapLoaded"
              :path="decode_path(getRouteDistance.polyline)"
              :options="polyOptions"
            />
          </gmap-map>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'MapReArrangeView',
  data() {
    return {
      center: { lat: -1.2997, lng: 36.7731 },
      options: {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true,
        keyboardShortcuts: false,
        gestureHandling: false,
      },
      polyOptions: {
        strokeColor: '#092794',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      },
      resultsArrays: [],
      newOrderList: [],
      mapLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      getMapDialogVisible: 'fulfilment/getMapDialogVisible',
      getCheckedOrders: 'fulfilment/getCheckedOrders',
      getChosenHub: 'fulfilment/getChosenHub',
      getActivePage: 'getActivePage',
      getRouteDistance: 'fulfilment/getRouteDistance',
      getSelectedDate: 'fulfilment/getSelectedDate',
      getSelectedCountry: 'fulfilment/getSelectedCountry',
    }),
    distPickup() {
      return this.getActivePage === 'Outbound_ordersView';
    },
    orderList: {
      get() {
        return this.getCheckedOrders;
      },
      set(newValue) {
        newValue = this.newOrderList;
      },
    },
    markers() {
      const markersLocations = [];
      const latit = parseFloat(this.getChosenHub.hub_location.latitude);
      const longit = parseFloat(this.getChosenHub.hub_location.longitude);
      markersLocations.push({
        lat: latit,
        lng: longit,
        icon:
          'https://s3.eu-west-1.amazonaws.com/webplatform.testimages/test.images/top/mapMarker.png',
      });
      this.getCheckedOrders.forEach(item => {
        const latude = parseFloat(item.destination_latitude);
        const lontude = parseFloat(item.destination_longitude);
        markersLocations.push({
          lat: latude,
          lng: lontude,
          icon:
            'https://s3.eu-west-1.amazonaws.com/webplatform.testimages/test.images/top/mapMarker2.png',
        });
      });
      return markersLocations;
    },
    finalbatchingOrder() {
      const orderSelectedInitIds = this.getCheckedOrders.map(
        ({ order_id }) => order_id,
      );
      const resultsArray = this.newOrderList.map(({ order_id }) => order_id);
      const orderIdArray = JSON.parse(JSON.stringify(resultsArray));
      const orderFinalIds =
        this.orderIdArray !== [] ? resultsArray : orderSelectedInitIds;
      return orderFinalIds;
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
      this.setBounds();
      this.setPaths();
    });
  },
  methods: {
    ...mapMutations({
      setMapDialogVisible: 'fulfilment/setMapDialogVisible',
      updateCheckedOrders: 'fulfilment/setCheckedOrders',
    }),
    ...mapActions({
      perform_post_actions: 'fulfilment/perform_post_actions',
      finalRouteDistance: 'fulfilment/finalRouteDistance',
    }),
    decode_path(path) {
      return google.maps.geometry.encoding.decodePath(path);
    },
    async setBounds() {
      if (this.mapLoaded && this.markers.length > 0) {
        await this.$refs.mapRef.$mapPromise.then(map => {
          const bounds = new google.maps.LatLngBounds();
          this.markers.forEach(loc => {
            bounds.extend({ lat: loc.lat, lng: loc.lng });
          });
          map.fitBounds(bounds);
        });
      }
    },
    async setPaths() {
      if (this.mapLoaded && this.markers.length > 0) {
        await this.$refs.mapRef.$mapPromise.then(map => {
          const flightPath = new google.maps.Polyline({
            path: this.decode_path(this.getRouteDistance.polyline),
            strokeColor: '#092794',
          });
          flightPath.setMap(map);
        });
      }
    },
    removeMapDialog() {
      this.setMapDialogVisible(false);
    },
    onDrop(dropResult) {
      this.newOrderList = this.applyDrag(this.orderList, dropResult);
      this.updateCheckedOrders(this.newOrderList);
      this.finalRouteDistancefetch();
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    },
  },
};
</script>
<style scoped>
.mapsstyle {
  margin: 0%;
  width: 886px;
  padding-right: 10px !important;
}
.mapdialog {
  z-index: 10;
  position: absolute;
  margin: 10px;
}
</style>
