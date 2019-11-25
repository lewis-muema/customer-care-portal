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
              :key="model.pricing_model_name"
            >
              <input
                type="radio"
                :value="model.pricing_model_name"
                :id="model.pricing_model_name"
                v-model="checkedPricingModel"
              />
              <label :for="model.pricing_model_name">{{
                model.pricing_model_name
              }}</label>
            </div>
          </div>
          <p class="pricing-pagination">Part {{ this.section }} of 2</p>
          <button @click="goBack()" class="pricing-back-text">
            Previous page
          </button>
          <button
            :disabled="checkedPricingModel === ''"
            @click="goNext"
            class="btn btn-primary action-button pricing-next-button"
          >
            Setup pricing
          </button>
        </div>
        <div class="pricing-table-styling" v-show="this.section === 2">
          <template>
            <el-table
              :data="tableData"
              row-class-name="no-hover"
              style="width: 1000px"
              max-height="300"
            >
              <el-table-column class="delete-col" width="40" fixed="left">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >
                    <i class="fa fa-fw fa-close pricing-delete-icon"></i>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="city" label="City" width="200">
                <template slot-scope="scope">
                  <el-autocomplete
                    v-if="!scope.row.city"
                    size="small"
                    class="inline-input"
                    v-model="pacInput"
                    :value="handleSelect"
                    :fetch-suggestions="querySearch"
                    placeholder="Search city"
                    :trigger-on-focus="false"
                    @select="handleSelect($event, scope.$index, scope.row)"
                  >
                  </el-autocomplete>
                  <el-input
                    v-if="scope.row.city"
                    size="small"
                    style="text-align:center"
                    placeholder="Search city"
                    v-model="scope.row.city"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="Vendor Type" width="200">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.vendor_type"
                    placeholder="Select Vendor"
                    size="small"
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
              <el-table-column prop="base_cost" label="Base Fee" width="200">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    style="text-align:center"
                    v-model="scope.row.base_cost"
                    ><template class="pricing-prepend" slot="prepend">{{
                      currency
                    }}</template></el-input
                  >
                </template>
              </el-table-column>
              <el-table-column prop="base_km" label="Base Distance" width="200">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    style="text-align:center"
                    v-model="scope.row.base_km"
                  >
                    <template class="pricing-prepend" slot="prepend"
                      >KM</template
                    >
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
                    size="small"
                    style="text-align:center"
                    v-model="scope.row.cost_per_km_above_base_km"
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
                    style="text-align:center"
                    v-model="scope.row.additional_location_cost"
                    ><template class="pricing-prepend" slot="prepend">{{
                      currency
                    }}</template></el-input
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="waiting_time_cost_per_min"
                label="Waiting fee per minute"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    style="text-align:center"
                    v-model="scope.row.waiting_time_cost_per_min"
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
                    style="text-align:center"
                    v-model="scope.row.loader_cost"
                    ><template class="pricing-prepend" slot="prepend">{{
                      currency
                    }}</template></el-input
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="service_fee"
                label="Service Charge"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    style="text-align:center"
                    v-model="scope.row.service_fee"
                    ><template class="pricing-prepend" slot="append"
                      >%</template
                    ></el-input
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
                    style="text-align:center"
                    v-model="scope.row.cancellation_fee"
                    ><template class="pricing-prepend" slot="prepend">{{
                      currency
                    }}</template></el-input
                  >
                </template>
              </el-table-column>
            </el-table>

            <p class="pricing-add-row" @click="addRow">
              <i class="fa fa-plus"></i> Add a new row
            </p>
            <button @click="goBack()" class="pricing-back-text">
              Previous page
            </button>
            <el-button
              class="pricing-save-btn btn-primary"
              @click="previewConfig"
              >Save & Preview
            </el-button>
          </template>
        </div>
        <div v-show="this.section === 3">
          <the-preview-configs-component
            :configs="tableData"
            :user="user"
          ></the-preview-configs-component>
        </div>
        <div v-show="this.section === -1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import ThePreviewConfigsComponent from './ThePreviewConfigsComponent.vue';
import TheViewConfigDetailsComponent from './TheViewDetailsComponent.vue';

const pricingModels = [
  { pricing_model_name: 'Distance based pricing(Customised)' },
  { pricing_model_name: 'Location pricing' },
  { pricing_model_name: 'Tonnage pricing' },
];
export default {
  name: 'TheAddNewPricingComponent',
  components: {
    'the-preview-configs-component': ThePreviewConfigsComponent,
    'the-view-config-details-component': TheViewConfigDetailsComponent,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkedPricingModel: '',
      copName: '',
      pacInput: '',
      copId: '',
      currency: '',
      value: '',
      address: '',
      checkedVendorTypes: [],
      checkedBusinessUnit: '',
      pricingTitle: 'New Custom Pricing',
      pricingModels,
      tableData: [],
      distancePricingTableData: [],
      customPricingDetails: [],
      vendorTypes: [],
      suggestions: [],
      selectedVendor: '',
      pricingStatus: '',
      addCount: 0,
      pricingTable: 0,
      pricingData: [
        {
          city: 'Entebbe',
          vendor_type: '5 Ton Truck',
          base_fee: '280',
          base_distance: '20',
          price_per_additional_KM: '2,160',
          price_per_additional_dropoff: '10,800',
          waiting_fee_per_hour: '18,000',
          loading_fee: '18,000',
          service_charge: '20',
          cancellation_fee: '40000',
        },
      ],
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
    pacInput(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&key=AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
        });
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
  },
  beforeMount() {},
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
      updatePricing: 'updatePricing',
      setFirstPricing: 'setFirstPricing',
      updateEditStatus: 'updateEditStatus',
      updateViewStatus: 'updateViewStatus',
      updateSummaryStatus: 'updateSummaryStatus',
      updateDistancePricing: 'updateDistancePricing',
    }),
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      request_pricing_data: 'request_pricing_data',
    }),
    goNext() {
      this.updateSection(this.section + 1);
      if (this.section === 2) {
        this.addRow();
      }
    },
    goBack() {
      this.updateSection(this.section - 1);
    },
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
    },
    addRow() {
      const anotherRow = {
        city: this.pricingData.city,
        name: this.pricingData.vendor_type,
        base_cost: this.pricingData.base_fee,
        base_km: this.pricingData.base_distance,
        cost_per_km_above_base_km: this.pricingData.price_per_additional_KM,
        additional_location_cost: this.pricingData.price_per_additional_dropoff,
        waiting_time_cost_per_min: this.pricingData.waiting_fee_per_hour,
        loader_cost: this.pricingData.loading_fee,
        service_fee: this.pricingData.service_charge,
        cancellation_fee: this.pricingData.cancellation_fee,
      };
      this.tableData.push(anotherRow);
    },
    previewConfig() {
      this.updateSection(3);
    },
    viewConfigDetails() {
      this.updateSummaryStatus(false);
      this.updateViewStatus(true);
    },
    async fetchVendorTypes(countryCode) {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'vendors/types',
        apiKey: false,
        params: {
          pickup_country_code: countryCode,
          dropoff_country_code: countryCode,
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        return (this.vendorTypes = data.vendor_types);
      } catch (error) {
        this.status = false;
      }
    },
    async fetchCustomDistancePricingData() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.currency,
        },
      };
      try {
        const data = await this.request_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          return (this.distancePricingTableData = this.configuredDistancePricing);
        } else {
          this.distancePricingTableData = [];
        }
      } catch (error) {
        this.status = false;
      }
    },
    querySearch(queryString, cb) {
      for (let i = 0; i < this.suggestions.length; i += 1) {
        this.suggestions[i].value = this.suggestions[i]['description'];
        delete this.suggestions[i].description;
      }
      cb(this.suggestions);
    },
    handleSelect(item, index, rows) {
      this.tableData[index].city = item.value;
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
</style>
