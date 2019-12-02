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
      <el-table-column prop="base_cost" label="Base Fee" width="120">
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
        label="Waiting fee per min"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="base_km" label="Loading Fee" width="120">
      </el-table-column>
      <el-table-column prop="service_fee" label="Service Charge" width="120">
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
      <button
        v-show="deactivateConfig"
        @click="resetCustomPricing"
        class="pricing-remove"
      >
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
  name: 'TheViewDetailsComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    customdata: {
      type: Array,
      required: true,
    },
    configs: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tableData: this.configs,
      customPricingDetails: this.customdata,
      tableTitle: 'Distance Pricing Table',
      showSummary: true,
      deactivateConfig: true,
      copId: '',
      pricingApprovalData: [],
    };
  },
  computed: {
    ...mapGetters({
      viewStatus: 'getViewStatus',
      summaryStatus: 'getSummaryStatus',
      getSessionData: 'getSession',
    }),
  },
  mounted() {
    this.copId = this.user.user_details.cop_id;
    this.setConfigDeactivateStatus();
    this.trackMixpanelPage();
  },
  methods: {
    ...mapMutations({
      updateViewStatus: 'updateViewStatus',
      updateSummaryStatus: 'updateSummaryStatus',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSection: 'setSectionView',
    }),
    ...mapActions({
      deactivate_distance_pricing_configs:
        'deactivate_distance_pricing_configs',
    }),
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
    },
    viewSummary() {
      this.updateSummaryStatus(true);
      this.updateViewStatus(false);
    },
    async resetCustomPricing() {
      this.trackMixpanelDeactivateConfigs();
      const approvalParams = this.createPayload(this.customPricingDetails);
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/update_custom_distance_details',
        apiKey: false,
        params: approvalParams,
      };
      try {
        const data = await this.deactivate_distance_pricing_configs(payload);
        if (data.status) {
          notification.push(
            'You have successfully deativated the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.updateViewStatus(false);
        } else {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      } catch (error) {
        this.status = false;
      }
    },
    createPayload(pricingApprovalData) {
      for (let i = 0; i < pricingApprovalData.length; i += 1) {
        pricingApprovalData[i].cop_id = this.copId;
        pricingApprovalData[i].custom_pricing_details = {};
        pricingApprovalData[i].custom_pricing_details.admin_id =
          pricingApprovalData[i].admin_id;
        pricingApprovalData[i].custom_pricing_details.currency =
          pricingApprovalData[i].currency;
        pricingApprovalData[i].custom_pricing_details.distance_pricing =
          pricingApprovalData[i].distance_pricing;
        pricingApprovalData[i].custom_pricing_details.distance_pricing.status =
          'Deactivated';
        pricingApprovalData[i].vendor_id = pricingApprovalData[i].id;
        pricingApprovalData[i].custom_pricing_details.id =
          pricingApprovalData[i].id;
        pricingApprovalData[i].custom_pricing_details.name =
          pricingApprovalData[i].name;

        delete pricingApprovalData[i].admin_id;
        delete pricingApprovalData[i].currency;
        delete pricingApprovalData[i].distance_pricing;
        delete pricingApprovalData[i].id;
        delete pricingApprovalData[i].name;
      }
      return pricingApprovalData;
    },
    trackMixpanelPage() {
      mixpanel.track('Pricing Config Summary View Page');
    },
    trackMixpanelDeactivateConfigs() {
      mixpanel.track('Pricing Config Deactivate Configs');
    },
    setConfigDeactivateStatus() {
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].status === 'Active') {
          this.deactivateConfig = false;
          break;
        } else {
          this.deactivateConfig = true;
        }
      }
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
