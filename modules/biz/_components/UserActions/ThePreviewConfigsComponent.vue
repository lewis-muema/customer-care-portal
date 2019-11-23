<template>
  <div>
    <div
      v-show="
        this.addPricing === false && this.section === 3 && !this.approverSelect
      "
    >
      <el-table
        :data="tableData"
        border
        class="pricing-table-styling"
        style="width: 1000px"
      >
        <el-table-column prop="city" label="City" width="110">
        </el-table-column>
        <el-table-column prop="vendor_type" label="Vendor Type" width="110">
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
          label="Waiting fee per minute"
          width="170"
        >
        </el-table-column>
        <el-table-column prop="loading_fee" label="Loading Fee" width="120">
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
      <button @click="editTable" class="edit-table-link">
        Edit Table
      </button>
      <el-button
        class="pricing-save-btn submit-approval-btn btn-primary"
        @click="getApprover"
        >Submit for approval</el-button
      >
    </div>
    <div class="approver-select" v-if="approverSelect">
      <template>
        <div class="pricing-approver-select">
          <div class="approver-title">
            Select the manager to approve
          </div>
          <el-select
            v-model="approver"
            size="small"
            placeholder="Select approver"
          >
            <el-option
              v-for="approver in approvers"
              :key="approver.admin_id"
              :label="approver.name"
              :value="approver.admin_id"
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
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ThePreviewConfigsComponent',
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
      tableData: this.configs,
      pricingData: [],
      customPricingDetails: this.customdata,
      approver: '',
      copId: this.user.user_details.cop_id,
      isHidden: false,
      approverSelect: false,
      approvers: [
        { admin_id: 1, name: 'Philemon Ope', business_unit: 'EBU' },
        { admin_id: 2, name: 'Don Okoth', business_unit: 'FBU' },
        { admin_id: 35, name: 'Everlyne Ndanu', business_unit: 'MBU' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      section: 'getSectionView',
      addPricing: 'getAddPricingState',
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
      updatePricing: 'updatePricing',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      submit_custom_pricing: 'submit_custom_pricing',
    }),
    editTable() {
      this.updateSection(2);
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
        endpoint: 'price_config/add_custom_distance_details',
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
          this.updateSection(-1);
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
    createPayload(pricingConfigData) {
      for (let i = 0; i < pricingConfigData.length; i++) {
        pricingConfigData[i].cop_id = this.copId;
        pricingConfigData[i].custom_pricing_details = {};
        pricingConfigData[i].custom_pricing_details.admin_id = this.approver;
        pricingConfigData[i].custom_pricing_details.distance_pricing = {};
        pricingConfigData[i].custom_pricing_details.distance_pricing.status =
          'Pending';
        pricingConfigData[i].custom_pricing_details.distance_pricing.base_km =
          pricingConfigData[i].base_km;
        pricingConfigData[i].custom_pricing_details.distance_pricing.base_cost =
          pricingConfigData[i].base_cost;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.cancellation_fee =
          pricingConfigData[i].cancellation_fee;
        pricingConfigData[i].custom_pricing_details.distance_pricing.city =
          pricingConfigData[i].city;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.loader_cost =
          pricingConfigData[i].loader_cost;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.cost_per_km_above_base_km =
          pricingConfigData[i].cost_per_km_above_base_km;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.additional_location_cost =
          pricingConfigData[i].additional_location_cost;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.service_fee =
          pricingConfigData[i].service_fee;
        pricingConfigData[i].custom_pricing_details.distance_pricing.name =
          pricingConfigData[i].name;
        pricingConfigData[
          i
        ].custom_pricing_details.distance_pricing.waiting_time_cost_per_min =
          pricingConfigData[i].waiting_time_cost_per_min;

        delete pricingConfigData[i].waiting_time_cost_per_min;
        delete pricingConfigData[i].name;
        delete pricingConfigData[i].service_fee;
        delete pricingConfigData[i].additional_location_cost;
        delete pricingConfigData[i].cost_per_km_above_base_km;
        delete pricingConfigData[i].loader_cost;
        delete pricingConfigData[i].city;
        delete pricingConfigData[i].cancellation_fee;
        delete pricingConfigData[i].base_cost;
        delete pricingConfigData[i].base_km;
      }
      return pricingConfigData;
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
