<template>
  <el-dialog
    :visible.sync="getMapDialogVisible"
    center
    width="84%"
    top="10vh"
    class="dialogOrder"
    :show-close="false"
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
            :center="{ lat: -1.2997, lng: 36.7731 }"
            :zoom="10"
            map-type-id="roadmap"
            style="width: 886px; height: 600px"
            :options="options"
          >
            <gmap-marker
              ref="gmarker"
              v-for="(m, index) in listLatiLongi"
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
            <gmap-polyline
              ref="mapPoly"
              :path="decode_path(getRouteDistance.polyline)"
              strokeColor="#092794"
            />
          </gmap-map>
        </div>
      </el-col>
      <el-col :span="6" class="orderInfo">
        <div class="">
          <div class="rearrangeText">Rearrange batch</div>
          <div>
            <span></span>
            <span class="rearrangeDistance"
              >Distance: {{ getRouteDistance.distance.toUpperCase() }}</span
            >
          </div>
          <div class="outboundHub" v-if="distPickup">
            <el-row class="inboundHubInfo">
              <el-col :span="3"
                ><i class="fa fa-map-marker" aria-hidden="true"></i
              ></el-col>
              <el-col :span="21">
                <span class="chosenHub">{{
                  getChosenHub.hub_location.description
                }}</span>
                <div class="orderFulfilmentCenter">Fulfilment Center</div>
              </el-col>
            </el-row>
            <el-row class="inboundHubInfo">
              <el-divider class="itemDivider"></el-divider>
            </el-row>
          </div>
          <div class="orderList" v-if="distPickup">
            <div>
              <div class="simple-page">
                <Container @drop="onDrop">
                  <Draggable v-for="(order, index) in orderListi" :key="index">
                    <el-col class="orderist">
                      <el-row>
                        <el-col :span="3" class="braille">
                          <span class="ellipsisIcon"
                            ><i class="fa fa-ellipsis-v" aria-hidden="true"></i
                          ></span>
                          <span class="ellipsisIcon"
                            ><i class="fa fa-ellipsis-v" aria-hidden="true"></i
                          ></span>
                        </el-col>
                        <el-col :span="21" class="waypointsOrder">
                          <span class="waypointOrder">
                            {{ order.destination_description }}
                          </span>
                          <div class="orderCreatedDate">
                            {{ new Date(order.scheduled_date).toDateString() }}
                          </div>
                        </el-col>
                      </el-row>
                      <el-row class="rowSpacer">
                        <el-divider class="itemDivide"></el-divider>
                      </el-row>
                    </el-col>
                  </Draggable>
                </Container>
              </div>
            </div>
          </div>
          <div class="orderListInbound" v-if="!distPickup">
            <div>
              <div class="simple-page">
                <Container @drop="onDrop">
                  <Draggable v-for="(order, index) in orderListi" :key="index">
                    <el-col class="orderist">
                      <el-row>
                        <el-col :span="3" class="braille">
                          <span class="ellipsisIcon"
                            ><i class="fa fa-ellipsis-v" aria-hidden="true"></i
                          ></span>
                          <span class="ellipsisIcon"
                            ><i class="fa fa-ellipsis-v" aria-hidden="true"></i
                          ></span>
                        </el-col>
                        <el-col :span="21" class="waypointsOrder">
                          <span class="waypointOrder">
                            {{ order.destination_description }}
                          </span>
                          <div class="orderCreatedDate">
                            {{ new Date(order.scheduled_date).toDateString() }}
                          </div>
                        </el-col>
                      </el-row>
                      <el-row class="rowSpacer">
                        <el-divider class="itemDivide"></el-divider>
                      </el-row>
                    </el-col>
                  </Draggable>
                </Container>
              </div>
            </div>
            <div v-if="!distPickup">
              <el-row class="inboundHubInfo">
                <el-col :span="3"
                  ><i class="fa fa-map-marker" aria-hidden="true"></i
                ></el-col>
                <el-col :span="21">
                  <span class="chosenHub">{{
                    getChosenHub.hub_location.description
                  }}</span>
                  <div class="orderFulfilmentCenter">Fulfilment Center</div>
                </el-col>
              </el-row>
              <el-row class="inboundHubInfo">
                <el-divider class="itemDivider"></el-divider>
              </el-row>
            </div>
          </div>
          <el-button @click="submitBatch" class="submitBatch"
            >Submit batch</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { Container, Draggable } from 'vue-dndrop';
import moment from 'moment';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'MapReArrangeView',
  components: { Container, Draggable },
  mixins: [NotificationMxn],

  data() {
    return {
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
      resultsArrays: [],
      newOrderListi: [],
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
    orderListi: {
      get() {
        return this.getCheckedOrders;
      },
      set(newValue) {
        newValue = this.newOrderListi;
      },
    },
    listLatiLongi() {
      const locationsz = [];
      const latit = parseFloat(this.getChosenHub.hub_location.latitude);
      const longit = parseFloat(this.getChosenHub.hub_location.longitude);
      locationsz.push({
        lat: latit,
        lng: longit,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      });
      this.getCheckedOrders.forEach(item => {
        const latude = parseFloat(item.destination_latitude);
        const lontude = parseFloat(item.destination_longitude);
        locationsz.push({
          lat: latude,
          lng: lontude,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });
      });
      return locationsz;
    },
    finalbatchingOrder() {
      const orderSelectedInitIds = this.getCheckedOrders.map(
        ({ order_id }) => order_id,
      );
      const resultsArray = this.newOrderListi.map(({ order_id }) => order_id);
      const orderIdArray = JSON.parse(JSON.stringify(resultsArray));
      const orderFinalIds =
        this.orderIdArray !== [] ? resultsArray : orderSelectedInitIds;
      return orderFinalIds;
    },
  },
  async updated() {
    if (this.$refs.mapRef) {
      this.$refs.mapRef.$mapPromise.then(map => {
        const bounds = new google.maps.LatLngBounds();
        this.listLatiLongi.forEach(loc => {
          bounds.extend({ lat: loc.lat, lng: loc.lng });
        });
        map.fitBounds(bounds);
      });
      await this.$refs.mapRef.$mapPromise.then(map => {
        const flightPath = new google.maps.Polyline({
          path: this.decode_path(this.getRouteDistance.polyline),
          strokeColor: '#092794',
        });
        flightPath.setMap(map);
      });
    }
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
    removeMapDialog() {
      this.setMapDialogVisible(false);
    },
    onDrop(dropResult) {
      this.newOrderListi = this.applyDrag(this.orderListi, dropResult);
      this.updateCheckedOrders(this.newOrderListi);
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
    async finalRouteDistancefetch() {
      this.resultsArrays = this.newOrderListi.map(({ order_id }) => order_id);
      this.processing = true;
      this.disabled = true;
      const direction =
        this.distPickup === 'Outbound_ordersView' ? 'OUTBOUND' : 'INBOUND';
      const payload = {
        app: 'MISSION_CONTROL_BFF',
        endpoint: 'batches/route',
        apiKey: false,
        params: {
          hub_id: this.getChosenHub.hub_id,
          direction,
          orders: this.resultsArrays,
        },
      };
      try {
        const res = await this.finalRouteDistance(payload);
      } catch (error) {
        this.disabled = false;
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
    async submitBatch() {
      this.processing = true;
      this.disabled = true;
      const direction =
        this.distPickup === 'Outbound_ordersView' ? 'OUTBOUND' : 'INBOUND';

      const epoch_date = moment(
        this.getSelectedDate,
        'YYYY-MM-DD h:mm a',
      ).valueOf();

      const payload = {
        app: 'MISSION_CONTROL_BFF',
        endpoint: 'batches',
        apiKey: false,
        params: {
          hub_id: this.getChosenHub.hub_id,
          direction,
          country: this.getSelectedCountry,
          scheduled_date: epoch_date,
          orders: this.finalbatchingOrder,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          setTimeout(() => {
            this.doNotification(
              1,
              'Batch Created',
              `Batch has been created successfully. Batch ID:  ${res.data.data.data.batch_id}`,
            );
            this.setMapDialogVisible(false);
          }, 800);
        } else {
          this.disabled = false;
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Create Batch Error', error_response);
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        this.disabled = false;
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
  },
};
</script>
<style>
.waypointsOrder > .way {
  /* left: 950px; */
  height: 20px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>

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
.rearrangeText {
  position: absolute;
  padding-left: 29px;
  height: 22px;
  left: 880px;
  top: 47px;
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}
.rearrangeDistance {
  position: absolute;
  height: 19px;
  left: 935px;
  top: 90px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
}
.outboundHub {
  position: absolute;
  left: 900px;
  top: 110px;
  right: 1%;
  padding-top: 1%;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  height: 20px;
}
.submitBatch {
  position: absolute;
  width: 270px;
  height: 44px;
  left: 910px;
  top: 520px;
  background: #0049b7;
  border: 1px solid #1b7fc3;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
}
.orderCreatedDate {
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 14px;
  color: #606266;
}
.orderFulfilmentCenter {
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 14px;
  color: #606266;
}
.ellipsisIcon {
  color: #909399;
  padding-top: 5px !important;
}
.itemDivider {
  margin: 15px 0px;
}
.itemDivide {
  margin-right: 0px;
  margin-bottom: 0px;
  margin-left: -15px;
  margin-top: 0px;
}
.rowSpacer {
  margin-top: 15px;
  margin-right: 0px;
  margin-bottom: 15px;
  margin-left: 15px;
}
.waypointOrder {
  /* left: 950px; */
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.waypointsOrder {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.orderList {
  position: absolute;
  left: 900px;
  right: 1%;
  padding-top: 3%;
  top: 150px;
  bottom: 64.81%;
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  height: 20px;
}
.orderListInbound {
  position: absolute;
  left: 900px;
  right: 1%;
  padding-top: 2%;
  top: 100px;
  bottom: 64.81%;
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  height: 20px;
}
.braille {
  padding-left: 0px !important;
  padding-right: 0px !important;
  align-self: center;
}
.inboundHubInfo {
  padding-left: 10px;
}
</style>
