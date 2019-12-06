<template>
  <div>
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
        <el-table-column prop="from" label="Pick up location" width="200">
        </el-table-column>
        <el-table-column prop="to" label="Drop off location" width="200">
        </el-table-column>
        <el-table-column prop="proximity" label="Proximity" width="130">
        </el-table-column>
        <el-table-column prop="name" label="Vendor type" width="130">
        </el-table-column>
        <el-table-column prop="order_amount" label="Client fee" width="130">
        </el-table-column>
        <el-table-column prop="rider_amount" label="Partner price" width="130">
        </el-table-column>
        <el-table-column prop="service_fee" label="Sendy fee" width="130">
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
  name: 'PreviewLocationPricingComponent',
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
      approver: '',
      approverMail: '',
      currency: '',
      isHidden: false,
      approverSelect: false,
      tableData: this.configs,
      copId: this.user.user_details.cop_id,
      customPricingDetails: this.customdata,
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      getSessionData: 'getSession',
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
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      setAdmins: 'setAdmins',
      submit_custom_pricing: 'submit_custom_pricing',
    }),
    editTable() {
      this.$emit('sectionUpdate', false);
    },
    getApprover() {
      this.approverSelect = true;
    },
    previewTable() {
      this.approverSelect = false;
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
          // this.sendEmailNotification();
          // this.fetchCustomDistancePricingData();
        } else {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      } catch (error) {
        this.status = false;
      }
      // this.trackMixpanelPeople();
    },
    createPayload(data) {
      console.log('data', data);
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
table td {
  padding: 5px !important;
}
</style>
