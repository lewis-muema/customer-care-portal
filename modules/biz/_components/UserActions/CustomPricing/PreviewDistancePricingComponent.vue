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
    this.trackMixpanelPage();
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
          notification.push(
            'You have successfully created the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.previewing = false;
          this.sendEmailNotification(this.admin.email, this.admin.name);
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
    createPayload(pricingConfigData) {
      for (let i = 0; i < pricingConfigData.length; i += 1) {
        pricingConfigData[i].cop_id = this.copId;
        pricingConfigData[i].custom_pricing_details = {};
        pricingConfigData[i].custom_pricing_details.admin_id = this.approver;
        pricingConfigData[i].custom_pricing_details.name =
          pricingConfigData[i].name;
        pricingConfigData[i].custom_pricing_details.currency = this.currency;
        pricingConfigData[i].custom_pricing_details.id =
          pricingConfigData[i].id;
        pricingConfigData[i].custom_pricing_details.distance_pricing = {};
        pricingConfigData[i].custom_pricing_details.distance_pricing.status =
          'Pending';
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.base_km = parseInt(
          pricingConfigData[i].base_km,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.base_cost = parseInt(
          pricingConfigData[i].base_cost,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.insurance = parseInt(
          pricingConfigData[i].insurance,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.cancellation_fee = parseInt(
          pricingConfigData[i].cancellation_fee,
          10,
        );
        pricingConfigData[i].custom_pricing_details.distance_pricing.city =
          pricingConfigData[i].city;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.loader_cost = parseInt(
          pricingConfigData[i].loader_cost,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.cost_per_km_above_base_km = parseInt(
          pricingConfigData[i].cost_per_km_above_base_km,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.additional_location_cost = parseInt(
          pricingConfigData[i].additional_location_cost,
          10,
        );
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.service_fee = parseInt(
          pricingConfigData[i].service_fee,
          10,
        );
        pricingConfigData[i].custom_pricing_details.distance_pricing.name =
          pricingConfigData[i].name;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.waiting_time_cost_per_min = parseInt(
          pricingConfigData[i].waiting_time_cost_per_min,
          10,
        );

        delete pricingConfigData[i].waiting_time_cost_per_min;
        delete pricingConfigData[i].id;
        delete pricingConfigData[i].service_fee;
        delete pricingConfigData[i].additional_location_cost;
        delete pricingConfigData[i].cost_per_km_above_base_km;
        delete pricingConfigData[i].loader_cost;
        delete pricingConfigData[i].city;
        delete pricingConfigData[i].cancellation_fee;
        delete pricingConfigData[i].base_cost;
        delete pricingConfigData[i].client_fee;
        delete pricingConfigData[i].insurance;
        delete pricingConfigData[i].base_km;
      }
      return pricingConfigData;
    },
    trackMixpanelPage() {
      mixpanel.track('Pricing Config Preview and Submit');
    },
    trackMixpanelPeople() {
      mixpanel.people.set({
        'User Type': 'Client Relationship Manager',
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
</style>
