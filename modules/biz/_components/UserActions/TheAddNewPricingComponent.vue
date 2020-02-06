<template>
  <div>
    <div v-if="configured">
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
                    v-if="active"
                    class="active-status-tag pricing-status-button"
                  >
                    Active
                  </p>
                  <p v-else class="waiting-status-tag pricing-status-button">
                    Awaiting approval
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p class="pricingmodelname">{{ pricingModel }}</p>
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
        <view-distance-pricing-component
          :user="user"
        ></view-distance-pricing-component>
      </div>
      <div v-if="this.viewLocation">
        <view-location-pricing-component
          :user="user"
          @viewUpdate="onViewUpdate"
        ></view-location-pricing-component>
      </div>
    </div>
    <div v-else>
      <div v-show="this.section === 0">
        <div>
          Custom Pricing
        </div>
        <p class="pricing-p">
          {{ this.copName }} has no custom pricing set up at the moment.
        </p>
        <button
          @click="
            trackAddNewConfig();
            goNext();
          "
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
            :disabled="checkedPricingModel === 3"
            class="btn btn-primary action-button pricing-next-button"
            @click="
              trackSetUpConfig();
              goNext();
            "
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
import ViewDistancePricingComponent from './CustomPricing/ViewDistancePricingComponent.vue';
import ViewLocationPricingComponent from './CustomPricing/ViewLocationPricingComponent.vue';
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
    'view-distance-pricing-component': ViewDistancePricingComponent,
    'view-location-pricing-component': ViewLocationPricingComponent,
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
      countryCode: '',
      pricingModel: '',
      checkedVendorTypes: [],
      pricingTitle: 'New Custom Pricing',
      tableData: [],
      distancePricingTableData: [],
      locationPricingTableData: [],
      customPricingDetails: [],
      vendorTypes: [],
      vendorName: '',
      suggestions: [],
      distancePricingStatus: '',
      locationPricingStatus: '',
      pricingTable: 0,
      newLocationPricing: false,
      newDistancePricing: false,
      viewLocation: false,
      existingConfigs: false,
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
    configured() {
      return this.existingConfigs === true;
    },
    active() {
      return (
        this.distancePricingStatus === 'Active' ||
        this.locationPricingStatus === 'Active'
      );
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
    this.countryCode = this.user.user_details.country_code;
    await this.fetchCustomDistancePricingData();
    this.fetchVendorTypes(this.countryCode);
    this.setConfigStatus();
    this.updateSummaryStatus(true);
    this.updateSection(0);
    this.trackPricingHomePage();
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
      if (this.section === 1) {
        this.trackModelSelectionPage();
      } else if (this.section === 2 && this.checkedPricingModel === 1) {
        this.newDistancePricing = true;
        this.trackNewDistanceConfig();
      } else if (this.section === 2 && this.checkedPricingModel === 2) {
        this.newLocationPricing = true;
        this.trackNewLocationConfig();
      }
    },
    goBack() {
      this.updateSection(this.section - 1);
    },
    setConfigStatus() {
      if (typeof this.distancePricingTableData[0] === 'object') {
        this.pricingModel = 'Distance Based Pricing';
        this.existingConfigs = true;
        for (let i = 0; i < this.distancePricingTableData.length; i += 1) {
          if (
            typeof this.distancePricingTableData[i] !== 'undefined' &&
            this.distancePricingTableData[i].status === 'Pending'
          ) {
            this.distancePricingStatus = 'Pending';
          } else if (
            typeof this.distancePricingTableData[i] !== 'undefined' &&
            this.distancePricingTableData[i].status === 'Active'
          ) {
            this.distancePricingStatus = 'Active';
          } else return;
        }
      } else if (typeof this.locationPricingTableData[0] === 'object') {
        this.pricingModel = 'Location Pricing';
        this.existingConfigs = true;
        for (let i = 0; i < this.locationPricingTableData.length; i += 1) {
          if (this.locationPricingTableData[i].status === 'Pending') {
            this.locationPricingStatus = 'Pending';
          } else {
            this.locationPricingStatus = 'Active';
          }
        }
      } else if (
        typeof this.distancePricingTableData[0] === 'undefined' &&
        typeof this.locationPricingTableData[0] === 'undefined'
      ) {
        this.existingConfigs = false;
      } else return;
    },
    viewConfigDetails() {
      this.trackViewPricingDetails();
      this.updateSummaryStatus(false);
      this.setCustomPricingDetails(this.customPricingDetails);
      if (typeof this.distancePricingTableData[0] === 'object') {
        this.updateViewStatus(true);
        this.setTableData(this.distancePricingTableData);
      } else if (typeof this.locationPricingTableData[0] === 'object') {
        this.viewLocation = true;
        this.setTableData(this.locationPricingTableData);
      }
    },
    onSectionUpdate(value) {
      this.newLocationPricing = value;
      this.newDistancePricing = value;
    },
    onViewUpdate(value) {
      this.viewLocation = value;
    },
    trackPricingHomePage() {
      mixpanel.track('Open custom pricing Page - PageView', {
        type: 'PageView',
      });
    },
    trackAddNewConfig() {
      mixpanel.track('Add custom pricing - ButtonClick', {
        type: 'Click',
      });
    },
    trackModelSelectionPage() {
      mixpanel.track('Select Pricing model Page - PageView', {
        type: 'PageView',
      });
    },
    trackNewLocationConfig() {
      mixpanel.track('Location Pricing selected - ButtonClick', {
        type: 'Click',
      });
    },
    trackNewDistanceConfig() {
      mixpanel.track('Distance Pricing selected - ButtonClick', {
        type: 'Click',
      });
    },
    trackSetUpConfig() {
      mixpanel.track('"Setup Pricing" button - ButtonClick', {
        type: 'Click',
      });
    },
    trackViewPricingDetails() {
      mixpanel.track('"See pricing details" Link - ButtonClick', {
        type: 'Click',
      });
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
