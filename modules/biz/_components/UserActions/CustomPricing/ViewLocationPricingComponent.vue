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
    this.trackViewDetailsPage();
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
      this.trackResetConfigs();
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
          this.trackResetConfigsSuccess();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
        } else {
          this.trackResetConfigsFail();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      } catch (error) {
        this.status = false;
      }
    },
    createPayload(data) {
      const locationPricingArray = [];
      for (let i = 0; i < data.length; i += 1) {
        const locationPricingObject = {
          cop_id: this.copId,
          vendor_id: data[i].id,
          from_coordinates: data[i].from_location.coordinates,
          to_coordinates: data[i].to_location.coordinates,
          custom_pricing_details: {
            location_pricing: [],
          },
        };
        const locationData = {
          id: data[i].id,
          name: data[i].name,
          cop_id: this.copId,
          cop_name: data[i].cop_name,
          currency: this.currency,
          admin_id: parseInt(this.adminId, 10),
          waiting_time_cost_per_min: data[i].waiting_time_cost_per_min,
          sendy_commission: data[i].sendy_commission,
          order_confirmation_time_delay: data[i].order_confirmation_time_delay,
          waiting_time_base: data[i].waiting_time_base,
          fixed_status: data[i].fixed_status,
          cancellation_fee: data[i].cancellation_fee,
          min_cancellation_fee: data[i].min_cancellation_fee,
          extra_distance_base_km: data[i].extra_distance_base_km,
          order_pickup_time_delay: data[i].order_pickup_time_delay,
          percentage_cancellation_fee: data[i].percentage_cancellation_fee,
          max_cancellation_fee: data[i].max_cancellation_fee,
          time: data[i].time,
          fixed_cost: data[i].fixed_cost,
          base_cost: data[i].base_cost,
          base_km: data[i].base_km,
          cost_per_km_above_base_km: data[i].cost_per_km_above_base_km,
          additional_location_cost: data[i].additional_location_cost,
          service_fee: data[i].service_fee,
          from: data[i].from,
          service_fee: data[i].service_fee,
          from_location: {
            type: data[i].from_location.type,
            coordinates: data[i].from_location.coordinates,
          },
          to_location: {
            type: data[i].to_location.type,
            coordinates: data[i].to_location.coordinates,
          },
          to: data[i].to,
          status: 'Deactivated',
          city: data[i].city,
          order_amount: data[i].order_amount,
          rider_amount: data[i].rider_amount,
        };
        locationPricingObject.custom_pricing_details.location_pricing.push(
          locationData,
        );
        locationPricingArray.push(locationPricingObject);
      }
      return locationPricingArray;
    },
    trackViewDetailsPage() {
      mixpanel.track('View Details Link - PageView', {
        type: 'PageView',
      });
    },
    trackResetConfigs() {
      mixpanel.track('"Reset Pricing" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackResetConfigsSuccess() {
      mixpanel.track('Reset successful - Success', {
        type: 'Success',
      });
    },
    trackResetConfigsFail() {
      mixpanel.track('Reset failed - Fail', {
        type: 'Fail',
      });
    },
    trackMixpanelIdentify() {
      mixpanel.identify('Approver', {
        email: this.getSessionData.payload.data.email,
        admin_id: this.getSessionData.payload.data.admin_id,
      });
    },

    trackMixpanelPeople() {
      mixpanel.people.set({
        'User Type': 'Approver',
        $email: this.getSessionData.payload.data.email,
        $name: this.getSessionData.payload.data.name,
      });
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
