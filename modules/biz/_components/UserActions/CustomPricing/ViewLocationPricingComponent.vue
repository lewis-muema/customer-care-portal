<template>
  <div>
    <div class="approval-sub-title">
      {{ tableTitle }}
    </div>
    <div class="approval-text-title">
      View mode
    </div>
    <el-table
      :data="tableData"
      border
      class="pricing-table-styling preview-container"
    >
      <el-table-column prop="from" label="Pick up location" width="200">
      </el-table-column>
      <el-table-column prop="to" label="Drop off location" width="200">
      </el-table-column>
      <el-table-column prop="name" label="Vendor type" width="130">
      </el-table-column>
      <el-table-column prop="order_amount" label="Client fee" width="130">
      </el-table-column>
      <el-table-column prop="rider_amount" label="Partner price" width="130">
      </el-table-column>
      <el-table-column prop="service_fee" label="Sendy fee" width="130">
      </el-table-column>
    </el-table>
    <div class="pricing-view-actions">
      <button @click="viewSummary" class="back-to-summary-link">
        Back to summary
      </button>
      <button @click="resetCustomPricing" class="pricing-remove">
        Remove custom pricing
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '@/mixins/session_mixin';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

export default {
  name: 'ViewLocationPricingComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pricingData: [],
      admin_list: [],
      adminId: 0,
      currency: '',
      tableTitle: 'Location Pricing Table',
      isHidden: false,
      approverSelect: false,
      tableData: [],
      copId: this.user.user_details.cop_id,
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      getSessionData: 'getSession',
      getTableData: 'getTableData',
      summaryStatus: 'getSummaryStatus',
    }),
    admin() {
      return this.admin_list.find(op => {
        return op.admin_id === this.approver;
      });
    },
  },
  watch: {
    getAdmins(admins) {
      return (this.admin_list = admins);
    },
  },
  async mounted() {
    await this.setAdmins();
    this.currency = this.user.user_details.default_currency;
    this.tableData = this.getTableData;
    this.adminId = this.getSessionData.payload.data.admin_id;
  },
  methods: {
    ...mapMutations({
      updateSummaryStatus: 'updateSummaryStatus',
    }),
    ...mapActions({
      setAdmins: 'setAdmins',
      deactivate_location_pricing: 'deactivate_location_pricing',
    }),
    viewSummary() {
      this.updateSummaryStatus(true);
      this.$emit('viewUpdate', false);
    },
    async resetCustomPricing() {
      const configParams = this.createPayload(this.tableData);
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: configParams,
      };
      try {
        const data = await this.deactivate_location_pricing(payload);
        if (data.status) {
          notification.push('Custom price configs deactivated successfully.');
          actionClass = this.display_order_action_notification(data.status);
          this.$emit('viewUpdate', false);
        } else {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      } catch (error) {
        this.status = false;
      }
      this.trackMixpanelPeople();
    },
    createPayload(data) {
      const locationData = data;
      for (let i = 0; i < data.length; i += 1) {
        data[i].cop_id = this.copId;
        data[i].custom_pricing_details = {};
        data[i].custom_pricing_details.location_pricing = [];
        data[i].custom_pricing_details.location_pricing[i] = {};
        data[i].custom_pricing_details.location_pricing[i].id = data[i].id;
        data[i].custom_pricing_details.location_pricing[i].name = data[i].name;
        data[i].custom_pricing_details.location_pricing[i].cop_id =
          data[i].cop_id;
        data[i].custom_pricing_details.location_pricing[i].cop_name =
          data[i].cop_name;
        data[i].custom_pricing_details.location_pricing[
          i
        ].currency = this.currency;
        data[i].custom_pricing_details.location_pricing[i].admin_id = parseInt(
          this.adminId,
          10,
        );
        data[i].custom_pricing_details.location_pricing[
          i
        ].waiting_time_cost_per_min = data[i].waiting_time_cost_per_min;
        data[i].custom_pricing_details.location_pricing[i].sendy_commission =
          data[i].sendy_commission;
        data[i].custom_pricing_details.location_pricing[
          i
        ].order_confirmation_time_delay = data[i].order_confirmation_time_delay;
        data[i].custom_pricing_details.location_pricing[i].waiting_time_base =
          data[i].waiting_time_base;
        data[i].custom_pricing_details.location_pricing[i].fixed_status =
          data[i].fixed_status;
        data[i].custom_pricing_details.location_pricing[i].cancellation_fee =
          data[i].cancellation_fee;
        data[i].custom_pricing_details.location_pricing[
          i
        ].min_cancellation_fee = data[i].min_cancellation_fee;
        data[i].custom_pricing_details.location_pricing[
          i
        ].extra_distance_base_km = data[i].extra_distance_base_km;
        data[i].custom_pricing_details.location_pricing[
          i
        ].order_pickup_time_delay = data[i].order_pickup_time_delay;
        data[i].custom_pricing_details.location_pricing[
          i
        ].percentage_cancellation_fee = data[i].percentage_cancellation_fee;
        data[i].custom_pricing_details.location_pricing[
          i
        ].max_cancellation_fee = data[i].max_cancellation_fee;
        data[i].custom_pricing_details.location_pricing[i].time = data[i].time;
        data[i].custom_pricing_details.location_pricing[i].fixed_cost =
          data[i].fixed_cost;
        data[i].custom_pricing_details.location_pricing[i].base_cost =
          data[i].base_cost;
        data[i].custom_pricing_details.location_pricing[i].base_km =
          data[i].base_km;
        data[i].custom_pricing_details.location_pricing[
          i
        ].cost_per_km_above_base_km = data[i].cost_per_km_above_base_km;
        data[i].custom_pricing_details.location_pricing[
          i
        ].additional_location_cost = data[i].additional_location_cost;
        data[i].custom_pricing_details.location_pricing[i].service_fee =
          data[i].service_fee;
        data[i].custom_pricing_details.location_pricing[i].from = data[i].from;
        data[i].custom_pricing_details.location_pricing[i].from_location = {};
        data[i].custom_pricing_details.location_pricing[i].from_location.type =
          data[i].from_location.type;
        data[i].custom_pricing_details.location_pricing[
          i
        ].from_location.coordinates = data[i].from_location.coordinates;
        data[i].custom_pricing_details.location_pricing[i].to_location = {};
        data[i].custom_pricing_details.location_pricing[i].to_location.type =
          data[i].to_location.type;
        data[i].custom_pricing_details.location_pricing[
          i
        ].to_location.coordinates = data[i].to_location.coordinates;
        data[i].custom_pricing_details.location_pricing[i].to = data[i].to;
        data[i].custom_pricing_details.location_pricing[i].status =
          'Deactivated';
        data[i].custom_pricing_details.location_pricing[i].city = data[i].city;
        data[i].custom_pricing_details.location_pricing[i].order_amount =
          data[i].order_amount;
        data[i].custom_pricing_details.location_pricing[i].rider_amount =
          data[i].rider_amount;
        data[i].vendor_id = data[i].id;
        data[i].from_coordinates = data[i].from_location.coordinates;
        data[i].to_coordinates = data[i].to_location.coordinates;

        delete data[i].admin_id;
        delete data[i].cop_name;
        delete data[i].id;
        delete data[i].name;
        delete data[i].currency;
        delete data[i].city;
        delete data[i].from;
        delete data[i].from_location;
        delete data[i].order_amount;
        delete data[i].rider_amount;
        delete data[i].service_fee;
        delete data[i].status;
        delete data[i].to;
        delete data[i].to_location;
        delete data[i].additional_location_cost;
        delete data[i].base_cost;
        delete data[i].base_km;
        delete data[i].cancellation_fee;
        delete data[i].cost_per_km_above_base_km;
        delete data[i].extra_distance_base_km;
        delete data[i].fixed_cost;
        delete data[i].fixed_status;
        delete data[i].max_cancellation_fee;
        delete data[i].min_cancellation_fee;
        delete data[i].order_confirmation_time_delay;
        delete data[i].order_pickup_time_delay;
        delete data[i].percentage_cancellation_fee;
        delete data[i].sendy_commission;
        delete data[i].time;
        delete data[i].waiting_time_base;
        delete data[i].waiting_time_cost_per_min;
      }
      return data;
    },
  },
};
</script>

<style scoped>
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #3c8dbc !important;
  border-color: #ebeef5;
}
.preview-container {
  width: 1000px;
}
table td {
  padding: 5px !important;
}
</style>
