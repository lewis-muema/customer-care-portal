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
      <el-col :span="16" class="mapsstyle">
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
                v-for="(m, index) in getMapMarkers"
                :key="index"
                :position="{
                  lat: m.lat,
                  lng: m.lng,
                }"
                :clickable="true"
                :draggable="false"
                :icon="m.icon"
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
      <el-col :span="8" class="orderInfo">
        <div class="">
          <div class="rearrangeText">Rearrange batch</div>
          <div>
            <span class="clipDistance"
              ><img
                src="https://s3.eu-west-1.amazonaws.com/webplatform.testimages/test.images/top/distance1.png"
            /></span>
            <span class="reArrangeDistance"
              >Distance: {{ getRouteDistance.distance.toUpperCase() }}</span
            >
          </div>
          <div
            class="outboundHub"
            v-if="
              page === 'Outbound_ordersView' || page === 'Outbound_batchesView'
            "
          >
            <el-row class="inboundHubInfo">
              <el-col :span="3"
                ><i class="fa fa-map-marker" aria-hidden="true"></i
              ></el-col>
              <el-col :span="21">
                <span class="chosenHub">{{ getChosenHub.hub_name }}</span>
                <div class="orderFulfilmentCenter">Fulfilment Center</div>
              </el-col>
            </el-row>
            <el-row class="inboundHubInfo">
              <el-divider class="itemDivider"></el-divider>
            </el-row>
          </div>
          <div
            class="orderList"
            v-if="
              page === 'Outbound_ordersView' || page === 'Outbound_batchesView'
            "
          >
            <div>
              <div class="simple-page">
                <Container @drop="onDrop">
                  <Draggable v-for="order in orderList" :key="order.order_id">
                    <el-col
                      class="itemListOrder"
                      @mouseenter.native="addCircle(order)"
                      @mouseleave.native="removeCircle(order)"
                    >
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
          <div
            class="orderListInbound"
            v-if="
              page === 'Inbound_ordersView' || page === 'Inbound_batchesView'
            "
          >
            <div>
              <div class="simple-page">
                <Container @drop="onDrop">
                  <Draggable v-for="order in orderList" :key="order.order_id">
                    <el-col
                      class="itemListOrder"
                      @mouseenter.native="addCircle(order)"
                      @mouseleave.native="removeCircle(order)"
                    >
                      <el-row class="orderist">
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
            <div
              v-if="
                page === 'Inbound_ordersView' || page === 'Inbound_batchesView'
              "
            >
              <el-row class="inboundHubInfo">
                <el-col :span="3"
                  ><i class="fa fa-map-marker" aria-hidden="true"></i
                ></el-col>
                <el-col :span="21">
                  <span class="chosenHub">{{ getChosenHub.hub_name }}</span>
                  <div class="orderFulfilmentCenter">Fulfilment Center</div>
                </el-col>
              </el-row>
              <el-row class="inboundHubInfo">
                <el-divider class="itemDivider"></el-divider>
              </el-row>
            </div>
          </div>
          <el-button
            @click="updateBatch"
            class="submitBatch"
            v-if="
              page === 'Inbound_batchesView' || page === 'Outbound_batchesView'
            "
            >Submit batch</el-button
          >
          <el-button
            @click="createBatch"
            class="submitBatch"
            v-if="
              page === 'Inbound_ordersView' || page === 'Outbound_ordersView'
            "
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
  props: ['page'],
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
        strokeWeight: 3,
      },
      resultsArrays: [],
      newOrderList: [],
      mapLoaded: false,
      cityCircle: '',
    };
  },
  computed: {
    ...mapGetters({
      getMapDialogVisible: 'fulfilment/getMapDialogVisible',
      getCheckedOrders: 'fulfilment/getCheckedOrders',
      getChosenHub: 'fulfilment/getChosenHub',
      getRouteDistance: 'fulfilment/getRouteDistance',
      getSelectedDateMap: 'fulfilment/getSelectedDateMap',
      getSelectedCountry: 'fulfilment/getSelectedCountry',
      getMapMarkers: 'fulfilment/getMapMarkers',
      getTableDetails: 'fulfilment/getTableDetails',
      getOrderList: 'fulfilment/getOrderList',
    }),
    orderList: {
      get() {
        return this.getOrderList;
      },
      set(newValue) {
        newValue = this.newOrderList;
      },
    },

    finalbatchingOrder() {
      const orderSelectedInitIds = this.orderList.map(
        ({ order_id }) => order_id,
      );
      const orderIdArray = this.newOrderList.map(({ order_id }) => order_id);
      const orderFinalIds =
        orderIdArray.length !== 0 ? orderIdArray : orderSelectedInitIds;
      return orderFinalIds;
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
      this.setBounds();
    });
  },
  methods: {
    ...mapMutations({
      setMapDialogVisible: 'fulfilment/setMapDialogVisible',
      setOrderList: 'fulfilment/setOrderList',
    }),
    ...mapActions({
      perform_post_actions: 'fulfilment/perform_post_actions',
      updateBatches: 'fulfilment/updateBatches',
      fetchRouteDistance: 'fulfilment/fetchRouteDistance',
    }),
    decode_path(path) {
      return google.maps.geometry.encoding.decodePath(path);
    },
    async setBounds() {
      if (this.mapLoaded && this.getMapMarkers.length > 0) {
        await this.$refs.mapRef.$mapPromise.then(map => {
          const bounds = new google.maps.LatLngBounds();
          this.getMapMarkers.forEach(loc => {
            bounds.extend({ lat: loc.lat, lng: loc.lng });
          });
          map.fitBounds(bounds);
        });
      }
    },
    async addCircle(e) {
      if (this.mapLoaded && this.getMapMarkers.length > 0) {
        await this.$refs.mapRef.$mapPromise.then(map => {
          const latude = parseFloat(e.destination_latitude);
          const lontude = parseFloat(e.destination_longitude);
          this.cityCircle = new google.maps.Circle({
            strokeColor: '#f7f7f7',
            strokeOpacity: 0.1,
            strokeWeight: 1,
            fillColor: '#f7f7f7',
            fillOpacity: 1,
            map,
            center: { lat: latude, lng: lontude },
            radius: 1000,
          });
        });
      }
    },
    removeCircle(e) {
      this.cityCircle.setMap(null);
    },
    removeMapDialog() {
      this.setMapDialogVisible(false);
    },
    onDrop(dropResult) {
      this.newOrderList = this.applyDrag(this.orderList, dropResult);
      this.setOrderList(this.newOrderList);
      this.fetchRouteDistancefetch();
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
    async fetchRouteDistancefetch() {
      this.resultsArrays = this.newOrderList.map(({ order_id }) => order_id);
      this.processing = true;
      this.disabled = true;
      const direction =
        this.page === 'Outbound_ordersView' ? 'OUTBOUND' : 'INBOUND';
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
        const res = await this.fetchRouteDistance(payload);
      } catch (error) {
        this.disabled = false;
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
    async createBatch() {
      this.processing = true;
      this.disabled = true;
      const direction =
        this.page === 'Outbound_ordersView' ? 'OUTBOUND' : 'INBOUND';

      const epoch_date = moment(
        this.getSelectedDateMap,
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
    async updateBatch() {
      this.processing = true;
      this.disabled = true;
      const payload = {
        endpoint: `batches/${this.getTableDetails.batch_id}`,
        apiKey: false,
        params: {
          hub_id: this.getTableDetails.hub.hub_id,
          direction: this.getTableDetails.direction,
          country: this.getTableDetails.country,
          scheduled_date: this.getTableDetails.scheduled_date,
          orders: this.finalbatchingOrder,
        },
      };
      try {
        const res = await this.updateBatches(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          setTimeout(() => {
            this.doNotification(
              1,
              'Batch Created',
              `Batch has been updated successfully. Batch ID:  ${res.data.data.data.batch_id}`,
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
<style scoped>
.mapsstyle {
  margin: 0%;
  width: 875px;
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
.reArrangeDistance {
  position: absolute;
  height: 19px;
  left: 945px;
  top: 90px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
}
.clipDistance {
  position: absolute;
  height: 19px;
  left: 910px;
  top: 90px;
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
  width: 22%;
  height: 8%;
  left: 75%;
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
  margin: 0px 0px;
}
.itemDivide {
  margin-right: 0px;
  margin-bottom: 0px;
  margin-left: -15px;
  margin-top: 0px;
}
.rowSpacer {
  margin-top: 5%;
  margin-right: -5%;
  margin-bottom: 0%;
  margin-left: 5%;
}
.waypointOrder {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-family: Nunito, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
}
.waypointsOrder {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.orderist {
  cursor: pointer;
}
.itemListOrder:hover {
  background-color: #e8e8e8;
  cursor: pointer;
}
.orderList {
  position: absolute;
  left: 900px;
  right: 1%;
  padding-top: 3%;
  top: 135px;
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
  top: 110px;
  bottom: 64.81%;
  height: 20px;
}
.braille {
  padding-left: 0px !important;
  padding-right: 0px !important;
  align-self: center;
}
.inboundHubInfo {
  padding-left: 10px;
  padding-top: 3%;
}
.fa {
  font-size: 18px;
}
.itemListOrder {
  padding-top: 2%;
  padding-right: 0%;
}
</style>
