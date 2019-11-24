<template>
  <div>
    <div v-if="pendingRequests">
      <div v-show="!rejectWithReason">
        <div class="approval-sub-title">
          {{ pricingTitle }}
        </div>
        <div class="approval-text-title">
          {{ approvalText }}
        </div>
        <el-table
          :data="distancePricingTableData"
          border
          class="pricing-table-styling"
          style="width: 1000px"
        >
          <el-table-column prop="city" label="City" width="170">
          </el-table-column>
          <el-table-column prop="name" label="Vendor Type" width="170">
          </el-table-column>
          <el-table-column prop="base_cost" label="Base Fee" width="150">
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
          <el-table-column prop="loader_cost" label="Loading Fee" width="120">
          </el-table-column>
          <el-table-column
            prop="service_fee"
            label="Service Charge"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="cancellation_fee"
            label="cancellation Fee"
            width="130"
          >
          </el-table-column>
        </el-table>
        <button @click="provideReason" class="reject-config-text">
          Reject Pricing
        </button>
        <el-button
          class="approve-config-btn btn-primary"
          @click="approveDistancePricingConfigs"
          >Approve pricing</el-button
        >
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
        You do not have any pending requests.
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SessionMxn from '@/mixins/session_mixin';

export default {
  name: 'ThePricingApprovalComponent',
  mixins: [SessionMxn],
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
      copId: '',
      adminId: '',
      adminName: '',
      adminMail: '',
      currency: '',
      rejectionReason: '',
      crmName: '',
      copName: '',
      rejectWithReason: false,
      pricingTitle: 'Distance Pricing Table',
      approvalText: 'Requires your approval',
    };
  },
  computed: {
    ...mapGetters({
      pendingDistancePricing: 'getPendingDistancePricing',
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
    this.copId = this.user.user_details.cop_id;
    this.copName = this.user.user_details.cop_name;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.getSessionData.payload.data.admin_id, 10);
    this.adminName = this.getSessionData.payload.data.name;
    this.adminMail = this.getSessionData.payload.data.email;
    this.getDistancePricingConfigs();
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
      send_mail_to_admin: 'send_mail_to_admin',
    }),
    async getDistancePricingConfigs() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.currency,
          status: 'Pending',
          admin_id: this.adminId,
        },
      };
      try {
        const data = await this.request_pending_distance_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          return (this.distancePricingTableData = this.pendingDistancePricing);
        } else {
          this.distancePricingTableData = [];
        }
      } catch (error) {
        this.status = false;
      }
    },
    async rejectDistancePricingConfigs() {
      const pricingApprovalData = this.customPricingDetails;
      const approvalParams = this.createPayload(
        pricingApprovalData,
        'deactivated',
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/update_custom_distance_details',
        apiKey: false,
        params: approvalParams,
      };
      try {
        const data = await this.reject_distance_pricing_configs(payload);
        if (data.status) {
          notification.push(
            'You have successfully rejected the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.getDistancePricingConfigs();
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
    provideReason() {
      this.rejectWithReason = true;
    },
    goBack() {
      this.rejectWithReason = false;
    },
    async approveDistancePricingConfigs() {
      const pricingApprovalData = this.customPricingDetails;
      const approvalParams = this.createPayload(pricingApprovalData, 'Active');
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/update_custom_distance_details',
        apiKey: false,
        params: approvalParams,
      };
      try {
        const data = await this.approve_distance_pricing_configs(payload);
        if (data.status) {
          this.sendEmailNotification();
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
    async sendEmailNotification() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'AUTH',
        endpoint: 'v1/send_email',
        apiKey: false,
        params: {
          email: this.adminMail,
          message: `Greetings! You have a new custom pricing config approval request from ${this.crmName} for ${this.copName}`,
          subject: 'New Custom Pricing Config',
          name: this.adminName,
        },
      };
      try {
        const data = await this.send_mail_to_admin(payload);
        if (data.result.status) {
          this.updateApproveStatus(false);
          notification.push(
            'You have successfully approved the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(
            data.result.status,
          );
          this.updateSuccess(false);
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
    createPayload(pricingApprovalData, status) {
      for (let i = 0; i < pricingApprovalData.length; i += 1) {
        pricingApprovalData[i].cop_id = this.copId;
        pricingApprovalData[i].custom_pricing_details = {};
        pricingApprovalData[i].custom_pricing_details.admin_id =
          pricingApprovalData[i].admin_id;
        pricingApprovalData[i].custom_pricing_details.currency =
          pricingApprovalData[i].currency;
        pricingApprovalData[i].custom_pricing_details.distance_pricing =
          pricingApprovalData[i].distance_pricing;
        pricingApprovalData[
          i
        ].custom_pricing_details.distance_pricing.status = status;
        pricingApprovalData[i].vendor_id = pricingApprovalData[i].id;
        pricingApprovalData[i].custom_pricing_details.id =
          pricingApprovalData[i].id;
        pricingApprovalData[i].custom_pricing_details.name =
          pricingApprovalData[i].name;
        pricingApprovalData[i].custom_pricing_details.rejection_message =
          status === 'Deactivated'
            ? this.rejectionReason
            : delete pricingApprovalData[i].custom_pricing_details
                .rejection_message;

        delete pricingApprovalData[i].admin_id;
        delete pricingApprovalData[i].currency;
        delete pricingApprovalData[i].distance_pricing;
        delete pricingApprovalData[i].id;
        delete pricingApprovalData[i].name;
      }
      return pricingApprovalData;
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
</style>
