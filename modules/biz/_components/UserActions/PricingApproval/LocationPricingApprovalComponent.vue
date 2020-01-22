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
          :data="locationPricingTableData"
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
          <el-table-column
            prop="rider_amount"
            label="Partner price"
            width="130"
          >
          </el-table-column>
          <el-table-column prop="service_fee" label="Sendy fee" width="130">
          </el-table-column>
        </el-table>
        <button @click="provideReason" class="reject-config-text">
          Reject Pricing
        </button>
        <el-button
          class="approve-config-btn btn-primary"
          @click="approveLocationPricingConfigs"
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
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

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
      locationPricingTableData: [],
      customPricingDetails: [],
      approvalParams: [],
      copId: '',
      adminId: '',
      currency: '',
      rejectionReason: '',
      crmName: '',
      copName: '',
      pendingRequests: false,
      rejectWithReason: false,
      pricingTitle: 'Location Pricing Table',
      approvalText: 'Requires your approval',
    };
  },
  computed: {
    ...mapGetters({
      pendingLocationPricing: 'getPendingLocationPricing',
      getSessionData: 'getSession',
      getApproveStatus: 'getApproveStatus',
    }),
  },
  watch: {
    pendingRequests(val) {
      this.pendingRequests = val;
    },
  },
  async mounted() {
    this.updateApproveStatus(true);
    await this.getDistancePricingConfigs();
    this.locationPricingTableData = this.pendingLocationPricing;
    this.pendingRequests = false;
    if (this.getApproveStatus && this.locationPricingTableData.length !== 0) {
      this.pendingRequests = true;
    }
    this.copId = this.user.user_details.cop_id;
    this.copName = this.user.user_details.cop_name;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.getSessionData.payload.data.admin_id, 10);
    this.crmName = this.getSessionData.payload.data.name;
    this.trackMixpanelPage();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateApproveStatus: 'updateApproveStatus',
    }),
    ...mapActions({
      approve_location_pricing_configs: 'approve_location_pricing_configs',
      reject_location_pricing_configs: 'reject_location_pricing_configs',
    }),
    async rejectDistancePricingConfigs() {
      this.trackMixpanelIdentify();
      this.trackMixpanelPeople();
      this.approvalParams = this.createPayload(
        this.locationPricingTableData,
        'deactivated',
      );
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: this.locationPricingTableData,
      };
      try {
        const data = await this.approve_location_pricing_configs(payload);
        if (data.status) {
          notification.push(
            'You have successfully rejected the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.pendingRequests = false;
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
    async approveLocationPricingConfigs() {
      this.trackMixpanelIdentify();
      this.trackMixpanelPeople();
      this.approvalParams = this.createPayload(
        this.locationPricingTableData,
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
        const data = await this.approve_location_pricing_configs(payload);
        if (data.status) {
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.pendingRequests = false;
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
    createPayload(data, status) {
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
          status,
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
    trackMixpanelPage() {
      mixpanel.track('Pricing Config Approval Page');
    },
    trackMixpanelIdentify() {
      mixpanel.identify(this.getSessionData.payload.data.name, {
        email: this.getSessionData.payload.data.email,
        admin_id: this.getSessionData.payload.data.admin_id,
      });
    },
    trackMixpanelPeople() {
      mixpanel.people.set({
        'User Type': 'Approving Manager',
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
