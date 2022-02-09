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
          :data="containerPricingTableData"
          border
          class="pricing-table-styling preview-container"
        >
          <el-table-column width="110">
            <template slot-scope="scope">
              <el-button
                class="approve-config-btn btn-primary"
                @click="approveContainerPricingConfigs(scope.row, scope.$index)"
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
          <el-table-column prop="from" label="Pick up location" width="200">
          </el-table-column>
          <el-table-column prop="to" label="Drop off location" width="200">
          </el-table-column>
          <el-table-column
            prop="empty_return"
            label="Empty return location"
            width="200"
          >
          </el-table-column>
          <el-table-column prop="name" label="Vendor type" width="130">
          </el-table-column>
          <el-table-column prop="currency" label="Currency" width="80">
          </el-table-column>
          <el-table-column prop="order_amount" label="Client fee" width="130">
          </el-table-column>
          <el-table-column
            prop="rider_amount"
            label="Partner price"
            width="130"
          >
          </el-table-column>
          <el-table-column
            prop="sendy_commission"
            label="Sendy commission (%)"
            width="170"
          >
          </el-table-column>
          <el-table-column prop="service_fee" label="Sendy fee" width="130">
          </el-table-column>
          <el-table-column prop="insurance" label="Insurance" width="120">
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
                @click="rejectContainerPricingConfigs"
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
      containerPricingTableData: [],
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
      pricingTitle: 'Container Pricing Table',
      approvalText: 'Requires your approval',
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      pendingContainerPricing: 'getPendingContainerPricing',
      getSessionData: 'getSession',
      getApproveStatus: 'getApproveStatus',
    }),
  },
  watch: {
    pendingRequests(val) {
      this.pendingRequests = val;
    },
  },
  mounted() {
    this.updateApproveStatus(true);
    this.containerPricingTableData = this.pendingContainerPricing;
    this.pendingRequests = false;
    if (this.getApproveStatus && this.containerPricingTableData.length !== 0) {
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
      approve_container_pricing_configs: 'approve_container_pricing_configs',
    }),
    async rejectContainerPricingConfigs() {
      this.trackRejectConfigs();
      const clone = JSON.parse(JSON.stringify(this.containerPricingTableData));
      const pricingTableData = [clone[this.rejectIndex]];
      this.approvalParams = this.createPayload(pricingTableData, 'Deactivated');
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
        const data = await this.approve_container_pricing_configs(payload);
        this.loading = false;
        if (data.status) {
          const configs = await this.getDistancePricingConfigs();
          this.trackMixpanelPeople();
          notification.push(
            'You have successfully rejected the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.rejectionReason = '';
          if (this.containerPricingTableData.length === 0) {
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
    async approveContainerPricingConfigs(dataRow, dataIndex) {
      this.trackApproveConfig();
      this.approvalParams = this.createPayload(
        [this.containerPricingTableData[dataIndex]],
        'Active',
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
        const data = await this.approve_container_pricing_configs(payload);
        if (data.status) {
          const configs = await this.getDistancePricingConfigs();
          this.trackPassedApproval();
          this.trackMixpanelPeople();
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          if (this.containerPricingTableData.length === 0) {
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
    createPayload(data, status) {
      const containerPricingArray = [];
      for (let i = 0; i < data.length; i += 1) {
        const containerPricingObject = {
          cop_id: this.copId,
          vendor_id: data[i].id,
          from_coordinates: data[i].from_location.coordinates,
          to_coordinates: data[i].to_location.coordinates,
          object_id: data[i].object_id,
          custom_pricing_details: {
            container_pricing: [],
          },
          rejection_message: this.rejectionReason,
        };
        const containerData = {
          id: data[i].id,
          name: data[i].name,
          cop_id: this.copId,
          cop_name: data[i].cop_name,
          currency: data[i].currency,
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
          status,
          order_amount: data[i].order_amount,
          rider_amount: data[i].rider_amount,
          empty_return_location: data[i].empty_return_location,
          empty_return: data[i].empty_return,
          container_size_feet: parseInt(data[i].container_size_feet, 10),
          container_errand_type: data[i].container_errand_type,
        };
        containerPricingObject.custom_pricing_details.container_pricing.push(
          containerData,
        );
        containerPricingArray.push(containerPricingObject);
      }
      return containerPricingArray;
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
