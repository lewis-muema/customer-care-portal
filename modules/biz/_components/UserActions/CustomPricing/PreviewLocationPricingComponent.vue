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
        <el-table-column prop="from" label="Pick up location" width="200">
        </el-table-column>
        <el-table-column prop="to" label="Drop off location" width="200">
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
      approver: 0,
      approverMail: '',
      currency: '',
      isHidden: false,
      approverSelect: false,
      previewing: true,
      tableData: this.configs,
      copId: this.user.user_details.cop_id,
      copName: this.user.user_details.cop_name,
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
    this.trackPricingSubmitPage();
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
          notification.push(data.message);
          actionClass = this.display_order_action_notification(data.status);
          this.previewing = false;
          this.sendEmailNotification(this.admin.email, this.admin.name);
          this.trackPassedSubmission();
          this.trackMixpanelIdentify();
          this.trackMixpanelPeople();
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
    createPayload(data) {
      const locationPricingArray = [];
      for (let i = 0; i < data.length; i += 1) {
        const locationPricingObject = {
          cop_id: this.copId,
          cop_name: this.copName,
          custom_pricing_details: {
            id: data[i].id,
            name: data[i].name,
            currency: this.currency,
            admin_id: this.approver,
            location_pricing: [],
          },
        };
        const locationData = {
          id: data[i].id,
          name: data[i].name,
          cop_id: this.copId,
          cop_name: data[i].cop_name,
          currency: this.currency,
          admin_id: this.approver,
          service_fee: data[i].service_fee,
          from: data[i].from,
          from_location: {
            type: data[i].from_location.type,
            coordinates: data[i].from_location.coordinates,
          },
          to_location: {
            type: data[i].to_location.type,
            coordinates: data[i].to_location.coordinates,
          },
          to: data[i].to,
          status: 'Pending',
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
    trackPricingSubmitPage() {
      mixpanel.track('Submit location pricing for approval Page - PageView', {
        type: 'PageView',
      });
    },
    trackPricingSubmit() {
      mixpanel.track('"Submit Request" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedSubmission() {
      mixpanel.track('Location pricing saved - Success', {
        type: 'Success',
      });
    },
    trackFailedSubmission() {
      mixpanel.track('Location pricing not saved - Fail', {
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
table td {
  padding: 5px !important;
}
.el-input--small {
  border: 1px solid#e4e7ed !important;
  border-radius: 5px !important;
}
</style>
