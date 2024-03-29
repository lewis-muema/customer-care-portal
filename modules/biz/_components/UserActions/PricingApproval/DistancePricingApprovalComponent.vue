<template>
  <div>
    <div class="approval-sub-title">
      {{ pricingTitle }}
    </div>
    <div v-if="pendingRequests">
      <div v-show="!rejectWithReason">
        <div class="approval-text-title">
          {{ approvalText }}
        </div>
        <el-table
          :data="distancePricingTableData"
          border
          class="pricing-table-styling"
        >
          <el-table-column width="110">
            <template slot-scope="scope">
              <el-button
                class="approve-config-btn btn-primary"
                @click="approveDistancePricingConfigs(scope.row, scope.$index)"
                >Approve</el-button
              >
            </template>
          </el-table-column>
          <el-table-column width="110">
            <template slot-scope="scope">
              <el-button
                @click="provideReason(scope.row, scope.$index)"
                class="reject-config-btn btn-primary"
              >
                Reject
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="City" width="170">
          </el-table-column>
          <el-table-column prop="name" label="Vendor Type" width="170">
          </el-table-column>
          <el-table-column prop="currency" label="Currency" width="80">
          </el-table-column>
          <el-table-column prop="base_cost" label="Partner Amount" width="150">
          </el-table-column>
          <el-table-column
            prop="sendy_commission"
            label="Sendy commission (%)"
            width="170"
          >
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
          <el-table-column prop="loader_cost" label="Loading Fee" width="120">
          </el-table-column>
          <el-table-column
            prop="cancellation_fee"
            label="cancellation Fee"
            width="130"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="approver-select reject-textarea" v-show="rejectWithReason">
        <template>
          <div class="pricing-approver-select">
            <div class="approver-title">
              Please provide {{ crmName }} with a reason why you have declined
              the custom pricing for {{ copName }}.
            </div>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Please input"
              v-model="rejectionReason"
            >
            </el-input>
            <div>
              <button @click="goBack" class="edit-table-link reject-text-btn">
                Go Back
              </button>
              <el-button
                :disabled="rejectionReason === '' || loading"
                class="pricing-save-btn submit-approval-btn btn-primary"
                @click="rejectDistancePricingConfigs"
                >Reject Request</el-button
              >
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <div class="approval-no-requests-text">
        Response successfully submitted! You do not have any pending requests.
      </div>
    </div>
  </div>
</template>

<script>
import Mixpanel from 'mixpanel';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SessionMxn from '@/mixins/session_mixin';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

const mixpanel = Mixpanel.init('d0554ae8b8905e4984de170b62b2c9c6');
export default {
  name: 'DistancePricingApprovalComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      distancePricingTableData: [],
      customPricingDetails: [],
      approvalParams: [],
      copId: '',
      adminId: '',
      currency: '',
      rejectionReason: '',
      rejectIndex: 0,
      crmName: '',
      copName: '',
      rejectWithReason: false,
      pricingTitle: 'Distance Pricing Table',
      approvalText: 'Requires your approval',
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      pendingDistancePricing: 'getPendingDistancePricing',
      getCustomPricingDetails: 'getCustomPricingDetails',
      getSessionData: 'getSession',
      getApproveStatus: 'getApproveStatus',
    }),
    pendingRequests() {
      return (
        this.getApproveStatus === true &&
        this.distancePricingTableData.length !== 0
      );
    },
  },
  mounted() {
    console.log(this.getSessionData);
    console.log(this.pendingDistancePricing);
    console.log(this.getCustomPricingDetails);
    console.log(this.getApproveStatus);
    this.copId = this.user.user_details.cop_id;
    this.copName = this.user.user_details.cop_name;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.getSessionData.payload.data.admin_id, 10);
    this.crmName = this.getSessionData.payload.data.name;
    this.distancePricingTableData = this.pendingDistancePricing;
    this.getCustomPricingDetails.forEach(row => {
      if (Object.prototype.hasOwnProperty.call(row, 'distance_pricing')) {
        this.customPricingDetails.push(row);
      }
    });
    // this.trackApprovalHomePage();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateApproveStatus: 'updateApproveStatus',
    }),
    ...mapActions({
      request_pending_distance_pricing_data:
        'request_pending_distance_pricing_data',
      approve_distance_pricing_configs: 'approve_distance_pricing_configs',
      reject_distance_pricing_configs: 'reject_distance_pricing_configs',
    }),
    async rejectDistancePricingConfigs() {
      this.trackRejectConfigs();
      const clone = JSON.parse(JSON.stringify(this.customPricingDetails));
      const pricingTableData = [clone[this.rejectIndex]];
      for (let i = 0; i < pricingTableData.length; i += 1) {
        const perHourFee =
          pricingTableData[i].distance_pricing.waiting_time_cost_per_min;
        const perMinuteFee = perHourFee / 60;
        pricingTableData[
          i
        ].distance_pricing.waiting_time_cost_per_min = parseFloat(perMinuteFee);
      }
      this.approvalParams = JSON.parse(
        JSON.stringify(this.createPayload(pricingTableData, 'Deactivated')),
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: this.approvalParams,
      };

      this.loading = true;
      try {
        const data = await this.reject_distance_pricing_configs(payload);
        this.loading = false;
        if (data.status) {
          const configs = await this.getDistancePricingConfigs();
          this.trackPassedReject();
          this.trackMixpanelPeople();
          notification.push(
            'You have successfully rejected the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.rejectionReason = '';
          if (this.distancePricingTableData.length === 0) {
            this.updateApproveStatus(false);
          } else {
            this.goBack();
          }
        } else {
          this.trackFailedReject();
          this.trackMixpanelPeople();
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        this.loading = false;
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    provideReason(dataRow, dataIndex) {
      this.rejectIndex = dataIndex;
      this.rejectWithReason = true;
      this.trackRejectConfigsPage();
    },
    goBack() {
      this.rejectWithReason = false;
    },
    async approveDistancePricingConfigs(dataRow, dataIndex) {
      this.trackApproveConfig();
      const clone = JSON.parse(JSON.stringify(this.customPricingDetails));
      const pricingTableData = [clone[dataIndex]];
      for (let i = 0; i < pricingTableData.length; i += 1) {
        const perHourFee =
          pricingTableData[i].distance_pricing.waiting_time_cost_per_min;
        const perMinuteFee = perHourFee / 60;
        pricingTableData[
          i
        ].distance_pricing.waiting_time_cost_per_min = parseFloat(perMinuteFee);
      }
      this.approvalParams = JSON.parse(
        JSON.stringify(this.createPayload(pricingTableData, 'Active')),
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: this.approvalParams,
      };
      try {
        const data = await this.approve_distance_pricing_configs(payload);
        if (data.status) {
          const configs = await this.getDistancePricingConfigs();
          this.trackPassedApproval();
          this.trackMixpanelPeople();
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          if (this.distancePricingTableData.length === 0) {
            this.updateApproveStatus(false);
          }
        } else {
          this.trackFailedApproval();
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
    createPayload(pricingApprovalData, status) {
      const distancePricingArray = [];
      for (let i = 0; i < pricingApprovalData.length; i += 1) {
        if (
          Object.prototype.hasOwnProperty.call(
            pricingApprovalData[i],
            'distance_pricing',
          )
        ) {
          const distancePricingObject = {
            cop_id: this.copId,
            vendor_id: pricingApprovalData[i].id,
            custom_pricing_details: {
              id: pricingApprovalData[i].id,
              name: pricingApprovalData[i].name,
              currency: pricingApprovalData[i].currency,
              admin_id: pricingApprovalData[i].admin_id,
              object_id: pricingApprovalData[i].object_id,
              distance_pricing: pricingApprovalData[i].distance_pricing,
              rejection_message: this.rejectionReason,
            },
          };
          distancePricingObject.custom_pricing_details.distance_pricing.status = status;
          distancePricingArray.push(distancePricingObject);
        }
      }
      return distancePricingArray;
    },
    trackApprovalHomePage() {
      mixpanel.track('Open Approval tab - PageView', {
        type: 'PageView',
      });
    },
    trackApproveConfig() {
      mixpanel.track('"Approve Pricing" Page - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedApproval() {
      mixpanel.track('Configs Approved successfully - Success', {
        type: 'Success',
      });
    },
    trackFailedApproval() {
      mixpanel.track('Approval fails - Fail', {
        type: 'Fail',
      });
    },
    trackRejectConfigs() {
      mixpanel.track('"Reject Pricing" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackRejectConfigsPage() {
      mixpanel.track('Request Rejected - PageView', {
        type: 'PageView',
      });
    },
    trackPassedReject() {
      mixpanel.track('Configs rejected - Success', {
        type: 'Success',
      });
    },
    trackFailedReject() {
      mixpanel.track('Reject fails - Fail', {
        type: 'Fail',
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
.main-section-holder {
  height: 710px !important;
}
.table td {
  padding: 5px !important;
}
</style>
