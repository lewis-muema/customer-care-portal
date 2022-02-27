<template>
  <el-row class="text-right mr-4 add-order">
    <el-button
      type="primary"
      class="add-batch-section"
      @click="arrangeBatch"
      v-if="permissions.add_fulfilment_order_to_batch"
    >
      Rearrange
    </el-button>
    <el-button
      type="primary"
      class="add-batch-section"
      @click="centerDialogVisible = true"
      v-if="permissions.add_fulfilment_order_to_batch"
    >
      + Add to batch
    </el-button>

    <el-dialog
      title="Add order to batch"
      :visible.sync="centerDialogVisible"
      width="30%"
      left
      class="text-left add-batch"
      @close="closeDialog()"
    >
      <div class="add-label">Order number</div>
      <SearchOrder
        section="orders"
        placeholder="Enter order number"
        @orderDetails="handleOrder"
        page="addOrder"
      />
      <el-row v-if="order" class="search-details">
        <div>Destination</div>
        <div class="search-value">{{ order.destination }}</div>

        <div>Recipient</div>
        <div class="search-value">{{ order.recipient_name }}</div>

        <div>Seller</div>
        <div class="search-value">{{ order.business_name }}</div>
      </el-row>

      <el-button
        type="primary"
        class="full-width action-submit-button"
        @click="addOrder()"
        :disabled="!order || disabled"
      >
        Add to batch
      </el-button>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'AddOrder',
  components: {
    SearchOrder: () => import('../filters/Search'),
  },
  mixins: [NotificationMxn],
  props: ['batch'],

  data() {
    return {
      centerDialogVisible: false,
      order: null,
      disabled: false,
      processing: false,
      chosenHubData: [],
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters({
      getActivePage: 'getActivePage',
      getTableDetails: 'fulfilment/getTableDetails',
      getHubs: 'fulfilment/getHubs',
    }),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    orderNumbers() {
      const arr = [];
      if (this.order) {
        arr.push(this.order.order_id);
      }
      return arr;
    },
    markers() {
      const markersLocations = [];
      const latit = parseFloat(this.chosenHubData[0].hub_location.latitude);
      const longit = parseFloat(this.chosenHubData[0].hub_location.longitude);
      markersLocations.push({
        lat: latit,
        lng: longit,
        icon:
          'https://s3.eu-west-1.amazonaws.com/webplatform.testimages/test.images/top/mapMarker.png',
      });
      this.getTableDetails.orders.forEach(item => {
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
  },
  methods: {
    ...mapMutations({
      isSearching: 'fulfilment/setSearchingStatus',
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
      setMapDialogVisible: 'fulfilment/setMapDialogVisible',
      setChosenHub: 'fulfilment/setChosenHub',
      setMapMarkers: 'fulfilment/setMapMarkers',
    }),
    ...mapActions({
      perform_patch_actions: 'fulfilment/perform_patch_actions',
      fetchRouteDistance: 'fulfilment/fetchRouteDistance',
    }),
    async arrangeBatch() {
      this.chosenHubData = this.getHubs.filter(hubs => {
        return hubs.hub_id === this.getTableDetails.hub.hub_id;
      });
      this.setChosenHub(this.chosenHubData[0]);
      this.setMapMarkers(this.markers);
      await this.fetchPath();
      setTimeout(() => {
        this.setMapDialogVisible(true);
      }, 800);
    },
    async fetchPath() {
      const orderIds = this.getTableDetails.orders.map(
        ({ order_id }) => order_id,
      );
      const payload = {
        app: 'MISSION_CONTROL_BFF',
        endpoint: 'batches/route',
        apiKey: false,
        params: {
          hub_id: this.getTableDetails.hub.hub_id,
          direction: this.getTableDetails.direction,
          orders: orderIds,
        },
      };
      try {
        const res = await this.fetchRouteDistance(payload);
        this.setRouteDistance(res.data.data);
      } catch (error) {
        this.disabled = false;
      }
    },
    handleOrder(orderDetails) {
      this.order = orderDetails;
    },
    closeDialog() {
      this.order = null;
      this.centerDialogVisible = false;
    },
    async addOrder() {
      this.processing = true;
      this.disabled = true;
      this.isSearching(false);

      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: `missioncontrol/batches/${this.batch}/addorders`,
        apiKey: false,
        params: {
          orders: this.orderNumbers,
        },
      };

      try {
        const res = await this.perform_patch_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Add to batch',
            `Order has been added to batch successfully`,
          );
          setTimeout(() => {
            this.updateProcessingStatus(true);
            this.centerDialogVisible = false;
          }, 800);
          // eslint-disable-next-line no-unreachable
        } else {
          this.disabled = false;
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Add to batch', error_response);
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
.add-order .fa-spin {
  margin-left: -2em;
}
.add-order input::placeholder {
  color: #909399;
  font-size: 13px;
  line-height: 16px;
}
.search-details {
  background: rgba(196, 196, 196, 0.23);
  border-radius: 6px;
  margin-top: 3px;
  width: 90%;
  padding: 1em;
}
.search-value {
  font-size: 16px;
  /* line-height: 22px; */
  color: #000000;
  margin-bottom: 10px;
}
.action-submit-button.el-button.is-disabled,
.action-submit-button.el-button.is-disabled:focus,
.action-submit-button.el-button.is-disabled:hover {
  color: #c0c4cc;
  background-color: #f0f3f7;
  border-color: #f0f3f7;
}
.add-label {
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  margin-bottom: 10px;
}
</style>
