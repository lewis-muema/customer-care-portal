<template>
  <div>
    <div v-if="previewDistancePricing">
      <preview-distance-pricing-component
        :configs="tableData"
        :user="user"
        @sectionUpdate="onSectionUpdate"
        @configSubmitted="configSubmitted"
      ></preview-distance-pricing-component>
    </div>
    <div v-else>
      <template>
        <el-table
          :data="tableData"
          row-class-name="no-hover"
          class="table--width"
          max-height="300"
        >
          <el-table-column class="delete-col" width="40" fixed="left">
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index > 0"
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
                type="text"
                size="small"
              >
                <i class="fa fa-fw fa-close pricing-delete-icon"></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="City" width="335">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="Min width 150px"
                v-model="visible"
                :disabled="scope.$index !== currentIndex"
              >
                <div>
                  <div
                    class="single-suggestion"
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    @click="handleSelect(scope.$index, suggestion.description)"
                  >
                    {{ suggestion.description }}
                  </div>
                </div>
                <el-input
                  slot="reference"
                  size="small"
                  class="table--col-text"
                  placeholder="Search city"
                  v-model="pacInput[scope.$index].name"
                  @focus="handleFocus(scope.$index)"
                ></el-input>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Vendor Type" width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.name"
                placeholder="Select Vendor"
                size="small"
                @change="onChange($event, scope.$index, scope.row)"
                @focus="currentIndex = scope.$index"
              >
                <el-option
                  v-for="vendor in vendorTypes"
                  :key="vendor.id"
                  :label="vendor.name"
                  :value="vendor.name"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="base_cost" label="Partner Amount" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.base_cost"
                @change="calculateClientFee(scope.$index, scope.row)"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sendy_commission"
            label="Sendy Commission (%)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                class="table--col-text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="scope.row.sendy_commission"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="append">
                  %
                </template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="service_fee" label="Service Fee" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                type="text"
                class="table--col-text"
                v-model="scope.row.service_fee"
                @change="calculateClientFee(scope.$index, scope.row)"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="insurance" label="Insurance" width="200">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.insurance"
                @change="calculateClientFee(scope.$index, scope.row)"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="client_fee" label="Client Fee" width="200">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.client_fee"
                @focus="currentIndex = scope.$index"
              >
                <template class="pricing-prepend" slot="prepend"
                  >{{ currency }}
                </template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="base_km" label="Base Distance" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.base_km"
                @focus="currentIndex = scope.$index"
              >
                <template class="pricing-prepend" slot="prepend">
                  KM
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="cost_per_km_above_base_km"
            label="Price per additional KM"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                size="small"
                class="table--col-text"
                v-model="scope.row.cost_per_km_above_base_km"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="additional_location_cost"
            label="Price per additional dropoff"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.additional_location_cost"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="waiting_time_cost_per_min"
            label="Waiting fee per hour"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.waiting_time_cost_per_min"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="loader_cost"
            label="Loading fee (per loader)"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.loader_cost"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="cancellation_fee"
            label="Cancellation Fee"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.cancellation_fee"
                @focus="currentIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
        </el-table>
        <p class="pricing-add-row" @click="addRow('Distance')">
          <i class="fa fa-plus"></i> Add a new row
        </p>
        <button @click="goBack()" class="pricing-back-text">
          Previous page
        </button>
        <el-button
          class="pricing-save-btn btn-primary"
          @click="previewConfig"
          :disabled="validNewStep"
          >Save & Preview
        </el-button>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';
import PreviewDistancePricingComponent from './PreviewDistancePricingComponent.vue';

export default {
  name: 'DistancePricingComponent',
  components: {
    'preview-distance-pricing-component': PreviewDistancePricingComponent,
  },
  mixins: [PricingConfigsMxn],
  data() {
    return {
      visible: false,
      pacInput: [
        {
          name: '',
        },
      ],
      currentIndex: 0,
      currency: '',
      vendorName: '',
      suggestions: [],
      vendorTypes: [],
      tableData: [
        {
          city: '',
          name: '',
          base_cost: '',
          base_km: '',
          cost_per_km_above_base_km: '',
          additional_location_cost: '',
          waiting_time_cost_per_min: '',
          loader_cost: '',
          sendy_commission: '',
          service_fee: '',
          insurance: '',
          client_fee: '',
          cancellation_fee: '',
        },
      ],
      previewDistancePricing: false,
      clientFee: 0,
    };
  },
  computed: {
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.vendorName;
      });
    },
    herokuKey() {
      return this.$env.HEROKU_GOOGLE_API_KEY;
    },
    validNewStep() {
      let city = '';
      let vendor = '';
      for (let i = 0; i < this.tableData.length; i += 1) {
        city = this.tableData[i].city;
        vendor = this.tableData[i].name;
      }
      return city === '' || vendor === '';
    },
  },
  watch: {
    pacInput: {
      handler(val) {
        val = val[this.currentIndex].name;
        if (
          val &&
          val.length > 2 &&
          this.tableData[this.currentIndex].city !== val
        ) {
          this.search(val);
        }
      },
      deep: true,
    },
    calculateClientFee(val) {},
  },
  async mounted() {
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    await this.fetchVendorTypes(countryCode);
    this.trackAddPricingDataPage();
  },
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
    }),
    goBack() {
      this.updateSection(1);
      this.$emit('sectionUpdate', false);
    },
    previewConfig() {
      this.trackSaveAndPreview();
      this.previewDistancePricing = true;
    },
    onChange(event, index, row) {
      this.vendorName = row.name;
      this.tableData[index].id = this.vendor.id;
      this.tableData[index].insurance = this.vendor.insurance
        ? this.vendor.insurance.max_distance_cost
        : 0;
    },
    calculateClientFee(index, row) {
      const partnerAmount = parseInt(row.base_cost, 10);
      const serviceFee = parseInt(row.service_fee, 10);
      const insurance = parseInt(row.insurance, 10);
      const orderAmount = partnerAmount + serviceFee + insurance;
      return (this.tableData[index].client_fee = orderAmount);
    },
    handleFocus(index) {
      this.currentIndex = index;
      if (this.pacInput[index].name !== '') {
        this.search(this.pacInput[index].name);
      }
    },
    handleSelect(index, item) {
      this.pacInput[index].name = item;
      this.visible = false;
      this.tableData[index].city = item;
      this.suggestions = [];
    },
    deleteRow(index, rows) {
      this.currentIndex = this.tableData.length - 2;
      this.tableData.splice(index, 1);
      this.pacInput.splice(index, 1);
    },
    onSectionUpdate(value) {
      this.previewDistancePricing = value;
    },
    configSubmitted() {
      this.previewLocationPricing = false;
      this.$emit('destroyDistanceComponent');
      this.goBack();
    },
    trackAddPricingDataPage() {
      mixpanel.track('Add Distance Pricing data Page - PageView', {
        type: 'PageView',
      });
    },
    trackSaveAndPreview() {
      mixpanel.track('Save and Preview Distance Pricing button - ButtonClick', {
        type: 'Click',
      });
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=geometry&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
          this.visible = true;
        });
    }, 500),
  },
};
</script>
<style>
.table--col-text {
  text-align: center !important;
}
.table--width {
  width: 1000px !important;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
  padding-bottom: 15px !important;
}
.single-suggestion {
  cursor: pointer;
  height: 25px;
  padding-right: 15px;
}
</style>
