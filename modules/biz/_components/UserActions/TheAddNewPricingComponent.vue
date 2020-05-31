<template>
  <div>
    <div>
      <div v-show="this.section === 1" class="pricing-vendor-select">
        Please select the pricing model for
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
            <label :for="model.model_id">{{ model.pricing_model_name }}</label>
          </div>
        </div>
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
          @destroyLocationComponent="resetSection(1)"
        ></location-pricing-component>
      </div>
      <div class="pricing-table-styling" v-if="this.newDistancePricing">
        <distance-pricing-component
          :user="user"
          @sectionUpdate="onSectionUpdate"
          @destroyDistanceComponent="resetSection(1)"
        ></distance-pricing-component>
      </div>
      <div class="pricing-table-styling" v-if="this.newContainerPricing">
        <container-pricing-component
          :user="user"
          @sectionUpdate="onSectionUpdate"
          @destroyContainerComponent="resetSection(1)"
        ></container-pricing-component>
      </div>
      <div class="pricing-table-styling" v-if="this.newDailyRatePricing">
        <daily-rate-pricing-component
          :user="user"
          @sectionUpdate="onSectionUpdate"
          @destroyContainerComponent="resetSection(1)"
        ></daily-rate-pricing-component>
      </div>
      <div class="pricing-table-styling" v-if="this.newMileagePricing">
        <mileage-pricing-component
          :user="user"
          @sectionUpdate="onSectionUpdate"
          @destroyContainerComponent="resetSection(1)"
        ></mileage-pricing-component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import Mixpanel from 'mixpanel';
import LocationPricingComponent from './CustomPricing/LocationPricingComponent.vue';
import DistancePricingComponent from './CustomPricing/DistancePricingComponent.vue';
import ContainerPricingComponent from './CustomPricing/ContainerPricingComponent.vue';
import DailyRatePricingComponent from './CustomPricing/DailyRatePricingComponent.vue';
import MileagePricingComponent from './CustomPricing/MileagePricingComponent.vue';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

const pricingModels = [
  { model_id: 1, pricing_model_name: 'Distance based pricing(Customised)' },
  { model_id: 2, pricing_model_name: 'Location pricing' },
  // { model_id: 3, pricing_model_name: 'Tonnage pricing' },
  { model_id: 4, pricing_model_name: 'Container pricing' },
  { model_id: 5, pricing_model_name: 'Daily rate pricing' },
  { model_id: 6, pricing_model_name: 'Mileage pricing' },
];
const mixpanel = Mixpanel.init('b36c8592008057290bf5e1186135ca2f');
export default {
  name: 'TheAddNewPricingComponent',
  components: {
    'location-pricing-component': LocationPricingComponent,
    'distance-pricing-component': DistancePricingComponent,
    'container-pricing-component': ContainerPricingComponent,
    'daily-rate-pricing-component': DailyRatePricingComponent,
    'mileage-pricing-component': MileagePricingComponent,
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
      newMileagePricing: false,
      newDailyRatePricing: false,
      viewLocation: false,
      viewContainer: false,
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
    this.updateSummaryStatus(true);
    this.updateSection(1);
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
      } else if (this.section === 2 && this.checkedPricingModel === 5) {
        this.newDailyRatePricing = true;
      } else if (this.section === 2 && this.checkedPricingModel === 6) {
        this.newMileagePricing = true;
      }
    },
    goBack() {
      this.updateSection(this.section - 1);
    },
    onSectionUpdate(value) {
      this.newLocationPricing = value;
      this.newDistancePricing = value;
      this.newContainerPricing = value;
      this.newDailyRatePricing = value;
      this.newMileagePricing = value;
    },
    async resetSection(section) {
      this.copName = this.user.user_details.cop_name;
      this.copId = this.user.user_details.cop_id;
      this.currency = this.user.user_details.default_currency;
      this.countryCode = this.user.user_details.country_code;
      this.checkedPricingModel = 1;
      await this.fetchCustomDistancePricingData();
      await this.fetchVendorTypes(this.countryCode);
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
