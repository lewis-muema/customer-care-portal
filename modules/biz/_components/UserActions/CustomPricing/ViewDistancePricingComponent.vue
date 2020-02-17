<template>
  <div v-show="this.viewStatus">
    <div class="approval-sub-title">
      {{ tableTitle }}
    </div>
    <div class="approval-text-title">
      View mode
    </div>
    <el-table
      :data="tableData"
      border
      class="pricing-table-styling configs-view-table"
    >
      <el-table-column prop="city" label="City" width="160"> </el-table-column>
      <el-table-column prop="name" label="Vendor Type" width="160">
      </el-table-column>
      <el-table-column prop="base_cost" label="Partner Amount" width="150">
      </el-table-column>
      <el-table-column prop="service_fee" label="Service Fee" width="120">
      </el-table-column>
      <el-table-column prop="insurance" label="Insurance" width="120">
      </el-table-column>
      <el-table-column prop="base_km" label="Base Distance" width="120">
      </el-table-column>
      <el-table-column
        prop="cost_per_km_above_base_km"
        label="Price per additional KM"
        width="170"
      >
      </el-table-column>
      <el-table-column
        prop="additional_location_cost"
        label="Price per additional dropoff"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="waiting_time_cost_per_min"
        label="Waiting fee per hour"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="base_km" label="Loading Fee" width="120">
      </el-table-column>
      <el-table-column
        prop="cancellation_fee"
        label="cancellation Fee"
        width="130"
      >
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
  name: 'ViewDistancePricingComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tableData: [],
      customPricingDetails: [],
      tableTitle: 'Distance Pricing Table',
      showSummary: true,
      copId: '',
      pricingApprovalData: [],
    };
  },
  computed: {
    ...mapGetters({
      viewStatus: 'getViewStatus',
      summaryStatus: 'getSummaryStatus',
      getSessionData: 'getSession',
      getTableData: 'getTableData',
      getCustomPricingDetails: 'getCustomPricingDetails',
    }),
  },
  mounted() {
    this.tableData = this.getTableData;
    this.customPricingDetails = this.getCustomPricingDetails;
    this.copId = this.user.user_details.cop_id;
    this.trackViewDetailsPage();
  },
  methods: {
    ...mapMutations({
      updateViewStatus: 'updateViewStatus',
      updateSummaryStatus: 'updateSummaryStatus',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSection: 'setSectionView',
      updateTableData: 'setTableData',
    }),
    ...mapActions({
      deactivate_distance_pricing_configs:
        'deactivate_distance_pricing_configs',
    }),
    viewSummary() {
      this.updateSummaryStatus(true);
      this.updateViewStatus(false);
    },
    async resetCustomPricing() {
      this.trackResetConfigs();
      const approvalParams = this.createPayload(this.customPricingDetails);
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: approvalParams,
      };
      try {
        const data = await this.deactivate_distance_pricing_configs(payload);
        if (data.status) {
          this.trackResetConfigsSuccess();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
          notification.push('Custom price configs deactivated successfully.');
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.updateViewStatus(false);
        } else {
          this.trackResetConfigsFail();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    createPayload(pricingApprovalData) {
      const distancePricingArray = [];
      for (let i = 0; i < pricingApprovalData.length; i += 1) {
        const distancePricingObject = {
          cop_id: this.copId,
          vendor_id: pricingApprovalData[i].id,
          custom_pricing_details: {
            id: pricingApprovalData[i].id,
            name: pricingApprovalData[i].name,
            currency: pricingApprovalData[i].currency,
            admin_id: pricingApprovalData[i].admin_id,
            distance_pricing: pricingApprovalData[i].distance_pricing,
          },
        };
        if (typeof distancePricingObject.vendor_id !== 'undefined') {
          distancePricingObject.custom_pricing_details.distance_pricing.status =
            'Deactivated';
          distancePricingArray.push(distancePricingObject);
        }
      }
      return distancePricingArray;
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
.configs-view-table {
  width: 1000px;
}
.table td {
  padding: 5px !important;
}
</style>
