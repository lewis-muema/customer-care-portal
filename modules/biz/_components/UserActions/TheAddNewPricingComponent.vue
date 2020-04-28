<template>
  <div>
    <div v-if="configured">
      <div class="row">
        <div class="col-md-12">
          <h4>Custom Pricing</h4>
        </div>
      </div>
      <div v-for="card in cards" :key="card.pricingModel">
        <div v-show="summaryStatus">
          <div class="row">
            <div class="col-md-6 activeconfig">
              <table class="card-table" width="100%">
                <tr>
                  <td>
                    <p class="clientnameandcurrency">
                      {{ copName }} - {{ currency }}
                    </p>
                  </td>
                  <td>
                    <p
                      v-if="card.status === 'Active'"
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
                    <p class="pricingmodelname">{{ card.pricingModel }}</p>
                  </td>
                </tr>
                <br />
                <tr>
                  <td>
                    <p class="lastmodified">Last Modified: 28th October 2019</p>
                  </td>
                  <td>
                    <button
                      @click="viewConfigDetails(card.pricingModel, card.status)"
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
      </div>
      <div v-if="this.viewStatus">
        <view-distance-pricing-component
          :user="user"
          :status="cardStatus"
          @viewUpdate="onViewUpdate"
        ></view-distance-pricing-component>
      </div>
      <div v-if="this.viewLocation">
        <view-location-pricing-component
          :user="user"
          :status="cardStatus"
          @viewUpdate="onViewUpdate"
        ></view-location-pricing-component>
      </div>
      <div v-if="this.viewContainer">
        <view-container-pricing-component
          :user="user"
          :status="cardStatus"
          @viewUpdate="onViewUpdate"
        ></view-container-pricing-component>
      </div>
    </div>
    <div>
      <div v-show="this.section === 0">
        <div>
          Custom Pricing
        </div>
        <p class="pricing-p" v-if="!configured">
          {{ this.copName }} has no custom pricing set up at the moment.
        </p>
        <p class="pricing-p" v-else>
          Add a new custom pricing.
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
            @destroyLocationComponent="resetSection(0)"
          ></location-pricing-component>
        </div>
        <div class="pricing-table-styling" v-if="this.newDistancePricing">
          <distance-pricing-component
            :user="user"
            @sectionUpdate="onSectionUpdate"
            @destroyDistanceComponent="resetSection(0)"
          ></distance-pricing-component>
        </div>
        <div class="pricing-table-styling" v-if="this.newContainerPricing">
          <container-pricing-component
            :user="user"
            @sectionUpdate="onSectionUpdate"
            @destroyContainerComponent="resetSection(0)"
          ></container-pricing-component>
        </div>
        <div v-show="this.section === -1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import Mixpanel from 'mixpanel';
import ViewDistancePricingComponent from './CustomPricing/ViewDistancePricingComponent.vue';
import ViewLocationPricingComponent from './CustomPricing/ViewLocationPricingComponent.vue';
import ViewContainerPricingComponent from './CustomPricing/ViewContainerPricingComponent.vue';
import LocationPricingComponent from './CustomPricing/LocationPricingComponent.vue';
import DistancePricingComponent from './CustomPricing/DistancePricingComponent.vue';
import ContainerPricingComponent from './CustomPricing/ContainerPricingComponent.vue';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

const pricingModels = [
  { model_id: 1, pricing_model_name: 'Distance based pricing(Customised)' },
  { model_id: 2, pricing_model_name: 'Location pricing' },
  { model_id: 3, pricing_model_name: 'Tonnage pricing' },
  { model_id: 4, pricing_model_name: 'Container pricing' },
];
const mixpanel = Mixpanel.init('b36c8592008057290bf5e1186135ca2f');
export default {
  name: 'TheAddNewPricingComponent',
  components: {
    'view-distance-pricing-component': ViewDistancePricingComponent,
    'view-location-pricing-component': ViewLocationPricingComponent,
    'view-container-pricing-component': ViewContainerPricingComponent,
    'location-pricing-component': LocationPricingComponent,
    'distance-pricing-component': DistancePricingComponent,
    'container-pricing-component': ContainerPricingComponent,
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
      checkedPricingModel: 1,
      copName: '',
      pacInput: '',
      copId: '',
      currency: '',
      value: '',
      pricingModels,
      countryCode: '',
      pricingModel: '',
      cards: [],
      cardStatus: '',
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
      newContainerPricing: false,
      viewLocation: false,
      viewContainer: false,
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
    summaryStatus(val) {
      if (val) {
        this.viewLocation = false;
        this.viewContainer = false;
        this.updateViewStatus(false);
      }
    },
  },
  async mounted() {
    this.copName = this.user.user_details.cop_name;
    this.copId = this.user.user_details.cop_id;
    this.currency = this.user.user_details.default_currency;
    this.countryCode = this.user.user_details.country_code;
    await this.fetchCustomDistancePricingData();
    await this.fetchVendorTypes(this.countryCode);
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
      } else if (this.section === 2 && this.checkedPricingModel === 4) {
        this.newContainerPricing = true;
      }
    },
    goBack() {
      this.updateSection(this.section - 1);
    },
    setConfigStatus() {
      this.cards = [];
      if (this.distancePricingTableData.length > 0) {
        this.existingConfigs = true;
        let modelStatus = 'Active';
        this.distancePricingTableData.forEach(row1 => {
          if (row1.status === 'Pending') {
            modelStatus = row1.status;
          }
        });
        this.cards.push({
          pricingModel: 'Distance Based Pricing',
          status: modelStatus,
        });
      }
      if (this.locationPricingTableData.length > 0) {
        this.existingConfigs = true;
        let containers = false;
        let locations = false;
        let locationStatus = 'Active';
        let containerStatus = 'Active';
        this.locationPricingTableData.forEach(row2 => {
          if (Object.prototype.hasOwnProperty.call(row2, 'empty_return')) {
            containers = true;
            if (row2.status === 'Pending') {
              containerStatus = row2.status;
            }
          } else {
            locations = true;
            if (row2.status === 'Pending') {
              locationStatus = row2.status;
            }
          }
        });
        if (locations) {
          this.cards.push({
            pricingModel: 'Location Pricing',
            status: locationStatus,
          });
        }
        if (containers) {
          this.cards.push({
            pricingModel: 'Container Pricing',
            status: containerStatus,
          });
        }
      }
      if (
        this.locationPricingTableData.length === 0 &&
        this.distancePricingTableData.length === 0
      ) {
        this.existingConfigs = false;
      }
    },
    viewConfigDetails(model, status) {
      this.cardStatus = status;
      this.trackViewPricingDetails();
      this.updateSummaryStatus(false);
      this.setCustomPricingDetails(this.customPricingDetails);
      if (model === 'Distance Based Pricing') {
        this.updateViewStatus(true);
        this.setTableData(this.distancePricingTableData);
      } else if (model === 'Location Pricing') {
        this.viewLocation = true;
        const data = [];
        this.locationPricingTableData.forEach(row3 => {
          if (!Object.prototype.hasOwnProperty.call(row3, 'empty_return')) {
            data.push(row3);
          }
        });
        this.setTableData(data);
      } else if (model === 'Container Pricing') {
        this.viewContainer = true;
        const data = [];
        this.locationPricingTableData.forEach(row3 => {
          if (Object.prototype.hasOwnProperty.call(row3, 'empty_return')) {
            data.push(row3);
          }
        });
        this.setTableData(data);
      }
    },
    onSectionUpdate(value) {
      this.newLocationPricing = value;
      this.newDistancePricing = value;
      this.newContainerPricing = value;
    },
    async resetSection(section) {
      this.copName = this.user.user_details.cop_name;
      this.copId = this.user.user_details.cop_id;
      this.currency = this.user.user_details.default_currency;
      this.countryCode = this.user.user_details.country_code;
      this.checkedPricingModel = 1;
      await this.fetchCustomDistancePricingData();
      await this.fetchVendorTypes(this.countryCode);
      this.setConfigStatus();
      this.updateSection(section);
    },
    onViewUpdate(value) {
      this.viewLocation = value;
      this.resetSection(this.section);
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
