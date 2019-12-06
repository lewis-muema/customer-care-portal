<template>
  <div>
    <div v-show="this.addPricing">
      <div v-show="this.summaryStatus">
        <div class="row">
          <div class="col-md-12">
            <h4>Custom Pricing</h4>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 activeconfig">
            <table class="card-table" width="100%">
              <tr>
                <td>
                  <p class="clientnameandcurrency">
                    {{ this.copName }} - {{ currency }}
                  </p>
                </td>
                <td>
                  <p
                    v-show="!status"
                    class="waiting-status-tag pricing-status-button"
                  >
                    Awaiting approval
                  </p>
                  <p
                    v-show="status"
                    class="active-status-tag pricing-status-button"
                  >
                    Active
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p class="pricingmodelname">Distance Based Pricing</p>
                </td>
              </tr>
              <br />
              <tr>
                <td>
                  <p class="lastmodified">Last Modified: 28th October 2019</p>
                </td>
                <td>
                  <button
                    @click="viewConfigDetails"
                    class="pricing-details-link"
                  >
                    See pricing details
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12"></div>
        </div>
      </div>
      <div v-if="this.viewStatus">
        <the-view-config-details-component
          :configs="distancePricingTableData"
          :customdata="customPricingDetails"
          :user="user"
        ></the-view-config-details-component>
      </div>
    </div>
    <div v-show="this.firstPricing">
      <div v-show="this.section === 0">
        <div>
          Custom Pricing
        </div>
        <p class="pricing-p">
          {{ this.copName }} has no custom pricing set up at the moment.
        </p>
        <button
          @click="goNext()"
          class="btn btn-primary action-button pricing-btn"
        >
          Add Custom Pricing
        </button>
      </div>
      <div v-show="this.section !== 0">
        <div v-show="customTitle" class="pricing-sub-title">
          {{ pricingTitle }}
        </div>
        <div v-show="this.section === 1" class="pricing-vendor-select">
          Please select the pricing model you wish to customise for
          {{ this.copName }}
          <div class="pricing-radio-box">
            <div
              class="radiobtn"
              v-for="model in pricingModels"
              :key="model.model_id"
            >
              <input
                type="radio"
                :value="model.model_id"
                :id="model.model_id"
                v-model="checkedPricingModel"
              />
              <label :for="model.model_id">{{
                model.pricing_model_name
              }}</label>
            </div>
          </div>
          <p class="pricing-pagination">Part {{ this.section }} of 2</p>
          <button @click="goBack()" class="pricing-back-text">
            Previous page
          </button>
          <button
            :disabled="checkedPricingModel === 3 || checkedPricingModel === 2"
            class="btn btn-primary action-button pricing-next-button"
            @click="goNext"
          >
            Setup pricing
          </button>
        </div>
        <div v-if="this.newLocationPricing">
          <location-pricing-component
            :user="user"
            @sectionUpdate="onSectionUpdate"
          ></location-pricing-component>
        </div>
        <div class="pricing-table-styling" v-if="this.newDistancePricing">
          <distance-pricing-component
            :user="user"
            @sectionUpdate="onSectionUpdate"
          ></distance-pricing-component>
        </div>
        <div v-show="this.section === -1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import TheViewConfigDetailsComponent from './TheViewDetailsComponent.vue';
import LocationPricingComponent from './CustomPricing/LocationPricingComponent.vue';
import DistancePricingComponent from './CustomPricing/DistancePricingComponent.vue';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

const pricingModels = [
  { model_id: 1, pricing_model_name: 'Distance based pricing(Customised)' },
  { model_id: 2, pricing_model_name: 'Location pricing' },
  { model_id: 3, pricing_model_name: 'Tonnage pricing' },
];
export default {
  name: 'TheAddNewPricingComponent',
  components: {
    'the-view-config-details-component': TheViewConfigDetailsComponent,
    'location-pricing-component': LocationPricingComponent,
    'distance-pricing-component': DistancePricingComponent,
  },
  mixins: [PricingConfigsMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkedPricingModel: 0,
      copName: '',
      pacInput: '',
      copId: '',
      currency: '',
      value: '',
      pricingModels,
      checkedVendorTypes: [],
      pricingTitle: 'New Custom Pricing',
      tableData: [],
      distancePricingTableData: [],
      customPricingDetails: [],
      vendorTypes: [],
      vendorName: '',
      suggestions: [],
      pricingStatus: '',
      pricingTable: 0,
      newLocationPricing: false,
      newDistancePricing: false,
    };
  },
  computed: {
    ...mapGetters({
      section: 'getSectionView',
      firstPricing: 'getFirstPricingState',
      addPricing: 'getAddPricingState',
      editStatus: 'getEditStatus',
      viewStatus: 'getViewStatus',
      summaryStatus: 'getSummaryStatus',
      configuredDistancePricing: 'getConfiguredDistancePricing',
    }),
    customTitle() {
      return this.section === 1 || this.section === 2;
    },
    status() {
      return this.pricingStatus === 'Active';
    },
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.vendorName;
      });
    },
  },
  watch: {
    distancePricingTableData(val) {
      this.distancePricingTableData = val;
      if (this.distancePricingTableData.length === 0) {
        this.setFirstPricing(true);
        this.updatePricing(false);
      } else {
        this.updatePricing(true);
        this.setFirstPricing(false);
      }
    },
  },
  async mounted() {
    this.copName = this.user.user_details.cop_name;
    this.copId = this.user.user_details.cop_id;
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    this.updateSection(0);
    await this.fetchCustomDistancePricingData();
    if (this.distancePricingTableData.length === 0) {
      this.setFirstPricing(true);
    } else {
      this.updatePricing(true);
    }
    for (let i = 0; i < this.distancePricingTableData.length; i += 1) {
      if (this.distancePricingTableData[i].status === 'Pending') {
        this.pricingStatus = 'Pending';
      } else {
        this.pricingStatus = 'Active';
      }
    }
    this.fetchVendorTypes(countryCode);
    this.trackMixpanelPage();
  },
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
      updatePricing: 'updatePricing',
      setFirstPricing: 'setFirstPricing',
      updateViewStatus: 'updateViewStatus',
      updateSummaryStatus: 'updateSummaryStatus',
      setCustomPricingDetails: 'setCustomPricingDetails',
      setTableData: 'setTableData',
    }),
    goNext() {
      this.updateSection(this.section + 1);
      if (this.section === 2 && this.checkedPricingModel === 1) {
        this.newDistancePricing = true;
      } else if (this.section === 2 && this.checkedPricingModel === 2) {
        this.newLocationPricing = true;
      }
    },
    goBack() {
      this.updateSection(this.section - 1);
    },
    viewConfigDetails() {
      this.updateSummaryStatus(false);
      this.updateViewStatus(true);
      this.setCustomPricingDetails(this.customPricingDetails);
      this.setTableData(this.distancePricingTableData);
    },
    trackMixpanelPage() {
      mixpanel.track('Pricing Config Summary Page');
    },
    trackMixpanelNewConfig() {
      mixpanel.track('New Pricing Config Page');
    },
    onSectionUpdate(value) {
      this.newLocationPricing = value;
      this.newDistancePricing = value;
    },
  },
};
</script>

<style scoped>
.el-table__row .el-input .el-input__inner {
  border-style: none;
}
.hover-row .el-input .el-input__inner {
  border-style: solid;
}
.el-input--small .el-input__inner {
  border: none !important;
}
.no-hover:hover > td {
  background-color: initial !important;
}
.el-input-group__append,
.el-input-group__prepend {
  padding: 0px 5px !important;
}
tr:hover {
  background-color: white !important;
}
.table td {
  padding: 5px !important;
}
</style>
