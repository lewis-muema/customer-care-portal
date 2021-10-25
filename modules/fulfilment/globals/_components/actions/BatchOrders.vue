<template>
  <div>
    <el-row v-if="fetching" class="batch-details-holder">
      <p>
        <i class="fa fa-spinner fa-spin loader"></i>
        <span class="summary-text-loader">Processing orders summary...</span>
      </p>
    </el-row>
    <div v-else>
      <el-row class="batch-details-holder">
        <el-col :span="12" class="batch-summary-inner">
          <span class="batch-summary-highlight"> Estimated weight(s) :</span>
          <ul>
            <li
              v-for="(measure, index) in summary.estimated_measure"
              :key="index"
              class="batch-sumarry-highlight-value"
            >
              {{ measure.value.toFixed(3) }}
              {{ measure.value_type === 'KILOGRAM' ? 'kgs' : 'litres' }}
            </li>
          </ul>
        </el-col>
        <el-col :span="12" class="batch-summary-inner">
          <span class="batch-summary-highlight">Total quantity : </span>
          <span class="batch-sumarry-highlight-value">{{
            summary.total_ordered_items_count
          }}</span></el-col
        >
        <el-col :span="12" class="batch-summary-inner">
          <span class="batch-summary-highlight">Region : </span
          ><span class="batch-sumarry-highlight-value">N/A</span></el-col
        >
        <el-col :span="12" class="batch-summary-inner"
          ><span class="batch-summary-highlight">Waypoints :</span>
          <span class="batch-sumarry-highlight-value">
            {{ summary.waypoints }}
          </span></el-col
        >
      </el-row>
      <el-row>
        <div class="vehicle-header recommended-vehicle-type">
          Recommended vehicle type
        </div>
        <div
          v-if="!showRecommendedVehicle(summary.recommended_vehicle_type)"
          class="vehicle-holder"
        >
          <div>N/A</div>
        </div>
        <div v-else class="vehicle-holder">
          <img :src="`${webImages}${selectedVendor.image}`" />
          <div>{{ selectedVendor.name }}</div>
        </div>
      </el-row>
      <el-row>
        <div class="vehicle-header">Select Hub</div>
        <el-select v-model="hub" class="full-width hub-field">
          <el-option
            v-for="item in getHubs"
            :key="item.hub_id"
            :label="item.hub_name"
            :value="item.hub_id"
          >
          </el-option>
        </el-select>
      </el-row>
      <el-row>
        <div class="vehicle-header">Select Scheduled date</div>
        <VueCtkDateTimePicker
          class="fulfilment-date-class"
          formatted="MMM DD YYYY hh:mm:ss a"
          v-model="selectedDate"
          :range="false"
          :no-label="true"
          id="liveops"
        />
      </el-row>
    </div>
    <el-button
      type="primary"
      class="full-width action-submit-button"
      :disabled="!hub || !selectedDate || this.orders.length === 0 || disabled"
      @click="batchOrders()"
    >
      Batch
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'BatchOrders',
  mixins: [NotificationMxn],

  props: ['orders', 'page'],
  data() {
    return {
      selectedOrders: null,
      processing: false,
      fetching: false,
      summary: [],
      selectedVendor: [],
      selectedDate: '',
      hub: '',
      disabled: false,
    };
  },
  computed: {
    ...mapGetters({
      vehicles: 'fulfilment/getVehicles',
      getHubs: 'fulfilment/getHubs',
    }),
  },
  async mounted() {
    this.fetching = true;
    this.fetchVehicles();
    await this.generateOrderIDs();
    await this.fetchOrdersSummary();

    this.fetching = false;
  },
  methods: {
    ...mapActions({
      orders_summary: 'fulfilment/orders_summary',
      fetchVehicles: 'fulfilment/fetchVehicles',
      perform_post_actions: 'fulfilment/perform_post_actions',
    }),

    generateOrderIDs() {
      const arr = [];
      for (let index = 0; index < this.orders.length; index++) {
        arr.push(this.orders[index].order_id);
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.selectedOrders = {
        orders: arr,
      };
      return arr;
    },

    async fetchOrdersSummary() {
      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: 'missioncontrol/orders/summary',
        apiKey: false,
        params: this.selectedOrders,
      };
      try {
        const res = await this.orders_summary(payload);
        if (res.status === 200) {
          this.summary = res.data.data;
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Order Summary Error', error_response);
        }
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
    showRecommendedVehicle(val) {
      let vendor = null;
      if (!val) {
        return vendor;
      }
      const filteredVehicle = this.vehicles.filter(
        vehicle => vehicle.value === val,
      );
      // eslint-disable-next-line prettier/prettier
        vendor = filteredVehicle.length > 0 ? filteredVehicle[0]: null;
      this.selectedVendor = vendor;
      return vendor;
    },
    async batchOrders() {
      // eslint-disable-next-line no-unreachable
      this.processing = true;
      this.disabled = true;
      if (!this.hub || !this.selectedDate) {
        this.doNotification(2, 'Batching Error', 'Kindly provide all values');
        return;
      }
      // eslint-disable-next-line prettier/prettier
      const direction = this.page === 'Outbound_ordersView' ? 'OUTBOUND' : 'INBOUND';

      const date = Date.parse(this.selectedDate);

      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: 'missioncontrol/batches',
        apiKey: false,
        params: {
          hub_id: this.hub,
          direction,
          scheduled_date: date,
          orders: this.selectedOrders.orders,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Batch Created',
            `Batch has been created successfully. Batch ID:  ${res.data.data.batch_id}`,
          );
          setTimeout(() => {
            this.$emit('dialogStatus', false);
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
.batch-details-holder {
  background: #f8fafb;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  padding: 16px;
}
.vehicle-header {
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: #000000;
  margin-top: 1em;
}
.vehicle-holder {
  display: inline-flex;
}
.vehicle-holder img {
  width: 7%;
  margin-right: 1em;
}
.vehicle-holder div {
  margin-top: 8px;
  letter-spacing: 0.1px;
  color: #000000;
}
.hub-field {
  padding-top: 1%;
}
.fulfilment-date-class .field-input {
  border: 1px solid #b3afaf;
  border-radius: 6px;
  margin-top: 1%;
}
.batch-summary-highlight {
  font-size: 13px;
  color: #000000;
  font-weight: 100;
}
.batch-sumarry-highlight-value {
  font-size: 13px;
  color: #000000;
  font-weight: 400;
}
.summary-text-loader {
  font-size: 13px;
  margin-left: 3%;
}
.batch-summary-inner {
  margin-bottom: 1%;
}
.recommended-vehicle-type {
  margin-bottom: 2%;
}
</style>
