<template>
  <div v-if="previewing">
    <div class="approver-select" v-if="approverSelect">
      <template>
        <div class="pricing-approver-select">
          <div class="approver-title">
            Select the manager to approve
          </div>
          <el-select
            v-model="approver"
            size="small"
            class="el-input--small"
            filterable
            placeholder="Select manager"
          >
            <el-option
              v-for="admin in admin_list"
              :key="admin.admin_id"
              :label="admin.name"
              :value="admin.admin_id"
            >
            </el-option>
          </el-select>
          <div>
            <button @click="previewTable" class="edit-table-link">
              Preview Table
            </button>
            <el-button
              :disabled="approver === ''"
              class="pricing-save-btn submit-approval-btn btn-primary"
              @click="submitConfigs"
              >Submit Request</el-button
            >
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <el-table
        :data="tableData"
        border
        class="pricing-table-styling preview-container"
      >
        <el-table-column prop="city" label="City" width="170">
        </el-table-column>
        <el-table-column prop="name" label="Vendor Type" width="150">
        </el-table-column>
        <el-table-column prop="base_cost" label="Partner Amount" width="150">
        </el-table-column>
        <el-table-column prop="service_fee" label="Service Fee" width="120">
        </el-table-column>
        <el-table-column prop="insurance" label="Insurance" width="120">
        </el-table-column>
        <el-table-column prop="client_fee" label="Client Fee" width="120">
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
          label="Waiting fee per minute"
          width="170"
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
      <button @click="editTable" class="edit-table-link">
        Edit Table
      </button>
      <el-button
        class="pricing-save-btn submit-approval-btn btn-primary"
        @click="getApprover"
        >Submit for approval</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '@/mixins/session_mixin';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

export default {
  name: 'PreviewDistancePricingComponent',
  mixins: [SessionMxn, PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
    configs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      pricingData: [],
      admin_list: [],
      approver: 0,
      approverMail: '',
      currency: '',
      isHidden: false,
      approverSelect: false,
      previewing: true,
      tableData: this.configs,
      copId: this.user.user_details.cop_id,
      customPricingDetails: this.customdata,
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      section: 'getSectionView',
      getSessionData: 'getSession',
      addPricing: 'getAddPricingState',
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
    this.trackPricingSubmitPage();
  },
  methods: {
    ...mapMutations({
      updatePricing: 'updatePricing',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      submit_custom_pricing: 'submit_custom_pricing',
      setAdmins: 'setAdmins',
    }),
    editTable() {
      this.$emit('sectionUpdate', false);
    },
    previewTable() {
      this.approverSelect = false;
    },
    getApprover() {
      this.approverSelect = true;
    },
    async submitConfigs() {
      this.trackPricingSubmit();
      const configParams = this.createPayload(this.tableData);
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/add_custom_distance_details',
        apiKey: false,
        params: configParams,
      };
      try {
        const data = await this.submit_custom_pricing(payload);
        if (data.status) {
          this.trackPassedSubmission();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
          notification.push(
            'You have successfully created the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.previewing = false;
          this.sendEmailNotification(this.admin.email, this.admin.name);
        } else {
          this.trackFailedSubmission();
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
      this.trackMixpanelPeople();
    },
    createPayload(pricingConfigData) {
      const distancePricingArray = [];
      for (let i = 0; i < pricingConfigData.length; i += 1) {
        const distancePricingObject = {
          cop_id: this.copId,
          custom_pricing_details: {
            id: pricingConfigData[i].id,
            name: pricingConfigData[i].name,
            currency: this.currency,
            admin_id: this.approver,
            distance_pricing: {
              status: 'Pending',
              name: pricingConfigData[i].name,
              base_km: parseInt(pricingConfigData[i].base_km, 10),
              base_cost: parseInt(pricingConfigData[i].base_cost, 10),
              insurance: parseInt(pricingConfigData[i].insurance, 10),
              cancellation_fee: parseInt(
                pricingConfigData[i].cancellation_fee,
                10,
              ),
              city: pricingConfigData[i].city,
              loader_cost: parseInt(pricingConfigData[i].loader_cost, 10),
              cost_per_km_above_base_km: parseInt(
                pricingConfigData[i].cost_per_km_above_base_km,
                10,
              ),
              additional_location_cost: parseInt(
                pricingConfigData[i].additional_location_cost,
                10,
              ),
              service_fee: parseInt(pricingConfigData[i].service_fee, 10),
              waiting_time_cost_per_min: parseInt(
                pricingConfigData[i].waiting_time_cost_per_min,
                10,
              ),
            },
          },
        };
        distancePricingArray.push(distancePricingObject);
      }
      return distancePricingArray;
    },
    trackPricingSubmitPage() {
      mixpanel.track('Submit distance pricing for approval Page - PageView', {
        type: 'PageView',
      });
    },
    trackPricingSubmit() {
      mixpanel.track('"Submit Request" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedSubmission() {
      mixpanel.track('Distance pricing saved - Success', {
        type: 'Success',
      });
    },
    trackFailedSubmission() {
      mixpanel.track('Distance pricing not saved - Fail', {
        type: 'Fail',
      });
    },
    trackMixpanelIdentify() {
      mixpanel.identify('CRM', {
        email: this.getSessionData.payload.data.email,
        admin_id: this.getSessionData.payload.data.admin_id,
      });
    },

    trackMixpanelPeople() {
      mixpanel.people.set({
        'User Type': 'CRM',
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
.table td {
  padding: 5px !important;
}
.el-input--small {
  border: 1px solid#e4e7ed !important;
  border-radius: 5px !important;
}
</style>
