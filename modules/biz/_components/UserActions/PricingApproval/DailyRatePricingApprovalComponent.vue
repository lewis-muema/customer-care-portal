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
          :data="dailyRatePricingTableData"
          border
          class="pricing-table-styling preview-container"
        >
          <el-table-column width="110">
            <template slot-scope="scope">
              <el-button
                class="approve-config-btn btn-primary"
                @click="approveLocationPricingConfigs(scope.row, scope.$index)"
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
          <el-table-column prop="name" label="Vendor Type" width="200">
          </el-table-column>
          <el-table-column prop="currency" label="Currency" width="80">
          </el-table-column>
          <el-table-column prop="monthly_rate" label="Monthly rate" width="200">
          </el-table-column>
          <el-table-column
            prop="no_of_working_days"
            label="Working days"
            width="130"
          >
          </el-table-column>
          <el-table-column prop="daily_rate" label="Daily rate" width="130">
          </el-table-column>
          <el-table-column
            prop="sendy_take"
            label="Sendy take (Amount)"
            width="170"
          >
          </el-table-column>
          <el-table-column label="Partner rate" width="170">
            <template slot-scope="scope">
              {{ scope.row.partner_price_type.replace(/_/g, ' ') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="partner_daily_rate"
            label="Partner daily rate"
            width="130"
          >
          </el-table-column>
          <el-table-column
            prop="partner_monthly_rate"
            label="Partner monthly rate"
            width="200"
          >
          </el-table-column>
          <el-table-column label="Fuel inclusivity" width="200">
            <template slot-scope="scope">
              {{ scope.row.fuel_inclusive ? 'Inclusive' : 'Non-inclusive' }}
            </template>
          </el-table-column>
          <el-table-column prop="maximum_km" label="Maximum KMs" width="200">
          </el-table-column>
          <el-table-column
            prop="rate_per_additional_km"
            label="Rate per additional km"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="partner_rate_per_additional_km"
            label="Partner rate per additional km"
            width="230"
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
                :disabled="rejectionReason === ''"
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
import moment from 'moment';
import SessionMxn from '@/mixins/session_mixin';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

const mixpanel = Mixpanel.init('d0554ae8b8905e4984de170b62b2c9c6');
export default {
  name: 'DailyRatePricingApprovalComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dailyRatePricingTableData: [],
      customPricingDetails: [],
      approvalParams: [],
      copId: '',
      adminId: '',
      currency: '',
      rejectionReason: '',
      rejectIndex: 0,
      crmName: '',
      copName: '',
      pendingRequests: false,
      rejectWithReason: false,
      pricingTitle: 'Daily Rate Pricing Table',
      approvalText: 'Requires your approval',
    };
  },
  computed: {
    ...mapGetters({
      pendingLocationPricing: 'getPendingLocationPricing',
      configuredDedicatedPricing: 'getConfiguredDedicatedPricing',
      getSessionData: 'getSession',
      getApproveStatus: 'getApproveStatus',
    }),
    pendingDailyRatePricing() {
      const data = [];
      this.configuredDedicatedPricing.forEach(row => {
        if (
          row.price_type === 'daily_rate' &&
          row.status === 'Pending' &&
          row.approved_by === this.adminId
        ) {
          data.push(row);
        }
      });
      return data;
    },
  },
  watch: {
    pendingRequests(val) {
      this.pendingRequests = val;
    },
  },
  mounted() {
    this.updateApproveStatus(true);
    this.dailyRatePricingTableData = this.pendingDailyRatePricing;
    this.pendingRequests = false;
    if (this.getApproveStatus && this.dailyRatePricingTableData.length !== 0) {
      this.pendingRequests = true;
    }
    this.copId = this.user.user_details.cop_id;
    this.copName = this.user.user_details.cop_name;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.getSessionData.payload.data.admin_id, 10);
    this.crmName = this.getSessionData.payload.data.name;
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
      approve_pricing_configs: 'approve_pricing_configs',
    }),
    async rejectDistancePricingConfigs() {
      this.trackRejectConfigs();
      this.approvalParams = this.createPayload(
        this.dailyRatePricingTableData[this.rejectIndex],
        'DeActivated',
        this.rejectionReason,
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/review_dedicated_price_configs',
        apiKey: false,
        params: this.approvalParams,
      };
      try {
        const data = await this.approve_pricing_configs(payload);
        if (data.status) {
          const configs = await this.fetchDedicatedPricingData();
          this.dailyRatePricingTableData = this.pendingDailyRatePricing;
          this.trackMixpanelPeople();
          notification.push(
            'You have successfully rejected the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.rejectionReason = '';
          if (this.dailyRatePricingTableData.length === 0) {
            this.pendingRequests = false;
          } else {
            this.goBack();
          }
        } else {
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
    provideReason(dataRow, dataIndex) {
      this.rejectIndex = dataIndex;
      this.rejectWithReason = true;
      this.trackRejectConfigsPage();
    },
    goBack() {
      this.rejectWithReason = false;
    },
    async approveLocationPricingConfigs(dataRow, dataIndex) {
      this.trackApproveConfig();
      this.approvalParams = this.createPayload(
        this.dailyRatePricingTableData[dataIndex],
        'Active',
        'Approved',
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/review_dedicated_price_configs',
        apiKey: false,
        params: this.approvalParams,
      };
      try {
        const data = await this.approve_pricing_configs(payload);
        if (data.status) {
          const configs = await this.fetchDedicatedPricingData();
          this.dailyRatePricingTableData = this.pendingDailyRatePricing;
          this.trackPassedApproval();
          this.trackMixpanelPeople();
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          if (this.dailyRatePricingTableData.length === 0) {
            this.pendingRequests = false;
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
    createPayload(data, status, message) {
      const payload = {
        cop_id: this.copId,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        approval_info: [
          {
            vendor_id: data.id,
            message,
            approved_by: parseInt(this.adminId, 10),
            status,
          },
        ],
      };
      return payload;
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
.table td {
  padding: 5px !important;
}
</style>
