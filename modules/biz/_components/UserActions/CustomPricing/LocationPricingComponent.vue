<template>
  <div>
    <div v-if="previewLocationPricing">
      <preview-location-pricing-component
        :configs="tableData"
        :user="user"
        @sectionUpdate="onSectionUpdate"
        @configSubmitted="configSubmitted"
      ></preview-location-pricing-component>
    </div>
    <div v-else>
      <template>
        <p class="insurance-reminder">
          PS: Insurance fees are charged as Ksh 200 for 100km and below and Ksh
          400 for above 100km.
        </p>
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
          <el-table-column prop="from" label="Pick up location" width="335">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="Min width 150px"
                v-model="visible1"
                :disabled="scope.$index !== rowIndex"
              >
                <div>
                  <div
                    class="single-suggestion"
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    @click="
                      handleSelectFrom(suggestion, scope.$index, scope.row)
                    "
                  >
                    {{ suggestion.description }}
                  </div>
                </div>
                <el-input
                  slot="reference"
                  size="small"
                  class="table--col-text"
                  placeholder="Search location"
                  v-model="pacInput1[scope.$index].name"
                  @focus="handleFocus(scope.$index, 1)"
                  @blur="handleBlur()"
                ></el-input>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="to" label="Drop off location" width="335">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="Min width 150px"
                v-model="visible2"
                :disabled="scope.$index !== rowIndex"
              >
                <div>
                  <div
                    class="single-suggestion"
                    v-for="suggestion in suggestions"
                    :key="suggestion.id"
                    @click="handleSelectTo(suggestion, scope.$index, scope.row)"
                  >
                    {{ suggestion.description }}
                  </div>
                </div>
                <el-input
                  slot="reference"
                  size="small"
                  class="table--col-text"
                  placeholder="Search location"
                  v-model="pacInput2[scope.$index].name"
                  @focus="handleFocus(scope.$index, 2)"
                  @blur="handleBlur()"
                ></el-input>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="distance" label="Distance" width="200">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="small"
                type="text"
                class="table--col-text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="scope.row.distance"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Vendor type" width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.name"
                placeholder="Select Vendor"
                size="small"
                @change="onChange($event, scope.$index, scope.row)"
                @focus="rowIndex = scope.$index"
              >
                <el-option
                  v-for="vendor in vendorTypes.slice(0, -1)"
                  :key="vendor.id"
                  :label="vendor.name"
                  :value="vendor.name"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="order_amount" label="Client fee" width="200">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.order_amount"
                @focus="rowIndex = scope.$index"
              >
                <template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="rider_amount"
            label="Partner price"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.rider_amount"
                @input="calculateClientFee(scope.$index, scope.row)"
                @focus="rowIndex = scope.$index"
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
                ><template class="pricing-prepend" slot="append">
                  %
                </template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="service_fee" label="Sendy fee" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="text"
                class="table--col-text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="scope.row.service_fee"
                @input="calculateClientFee(scope.$index, scope.row)"
                @focus="rowIndex = scope.$index"
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
                @input="calculateClientFee(scope.$index, scope.row)"
                @focus="rowIndex = scope.$index"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
        </el-table>
        <p class="pricing-add-row" @click="addRow('Location')">
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
import _ from 'lodash';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';
import PreviewLocationPricingComponent from './PreviewLocationPricingComponent.vue';

export default {
  name: 'LocationPricingComponent',
  components: {
    'preview-location-pricing-component': PreviewLocationPricingComponent,
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
      rowIndex: 0,
      pacInput1: [
        {
          name: '',
        },
      ],
      pacInput2: [
        {
          name: '',
        },
      ],
      shortestDistance: 0,
      visible1: false,
      visible2: false,
      currency: '',
      vendorName: '',
      suggestions: [],
      vendorTypes: [],
      tableData: [
        {
          id: 1,
          name: '',
          cop_id: 1,
          cop_name: '',
          currency: '',
          admin_id: 1,
          sendy_commission: 0,
          service_fee: 0,
          from: '',
          from_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          to_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          empty_return_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          to: '',
          empty_container_destination: '',
          status: '',
          city: '',
          distance: '',
          insurance: 0,
          order_amount: 0,
          rider_amount: 0,
          container_weight_tonnes: '',
          container_size_feet: '',
          container_errand_type: 'drop_off',
        },
      ],
      previewLocationPricing: false,
    };
  },
  computed: {
    herokuKey() {
      return this.$env.HEROKU_GOOGLE_API_KEY;
    },
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.vendorName;
      });
    },
    fromLocation() {
      return this.suggestions.find(op => {
        return op.place_id === this.fromPlaceId;
      });
    },
    validNewStep() {
      let from = '';
      let to = '';
      let vendor = '';
      for (let i = 0; i < this.tableData.length; i += 1) {
        from = this.tableData[i].from;
        to = this.tableData[i].to;
        vendor = this.tableData[i].name;
      }
      return from === '' || to === '' || vendor === '';
    },
  },
  watch: {
    pacInput1: {
      handler(val) {
        val = val[this.rowIndex].name;
        if (
          val &&
          val.length > 2 &&
          this.tableData[this.rowIndex].from !== val
        ) {
          this.search(val, 1);
        }
      },
      deep: true,
    },
    pacInput2: {
      handler(val) {
        val = val[this.rowIndex].name;
        if (val && val.length > 2 && this.tableData[this.rowIndex].to !== val) {
          this.search(val, 2);
        }
      },
      deep: true,
    },
  },
  async mounted() {
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    await this.fetchVendorTypes(countryCode);
    this.trackAddPricingDataPage();
    // this.distanceCalculator();
  },
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
    }),
    goBack() {
      this.updateSection(1);
      this.$emit('sectionUpdate', false);
    },
    handleFocus(index, input) {
      this.rowIndex = index;
      if (input === 1) {
        if (this.pacInput1[index].name !== '') {
          this.search(this.pacInput1[index].name, input);
        }
      } else if (input === 2) {
        if (this.pacInput2[index].name !== '') {
          this.search(this.pacInput2[index].name, input);
        }
      }
    },
    handleBlur() {
      this.visible1 = false;
      this.visible2 = false;
    },
    handleSelectFrom(item, index, rows) {
      this.handleBlur();
      this.suggestions = [];
      this.tableData[index].from = item.description;
      this.pacInput1[index].name = item.description;
      const fromPlaceId = item.place_id;
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${fromPlaceId}&key=${this.herokuKey}`,
        )
        .then(response => {
          const fromLatLong = response.data.result.geometry.location;
          const coordinatesArray = Object.keys(fromLatLong).map(
            key => fromLatLong[key],
          );
          [coordinatesArray[0], coordinatesArray[1]] = [
            parseFloat(coordinatesArray[1].toFixed(6)),
            parseFloat(coordinatesArray[0].toFixed(6)),
          ];
          this.tableData[index].from_location.coordinates = coordinatesArray;
          if (
            this.tableData[index].to_location.coordinates[0] !== 0 &&
            this.tableData[index].to_location.coordinates[1] !== 0
          ) {
            const distance = this.distanceCalculator(
              this.tableData[index].from_location,
              this.tableData[index].to_location,
              index,
            );
          }
        });
    },
    handleSelectTo(item, index, rows) {
      this.handleBlur();
      this.suggestions = [];
      this.tableData[index].to = item.description;
      this.pacInput2[index].name = item.description;
      const toPlaceId = item.place_id;
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${toPlaceId}&key=${this.herokuKey}`,
        )
        .then(response => {
          const toLatLong = response.data.result.geometry.location;
          const coordinatesArray = Object.keys(toLatLong).map(
            key => toLatLong[key],
          );
          [coordinatesArray[0], coordinatesArray[1]] = [
            parseFloat(coordinatesArray[1].toFixed(6)),
            parseFloat(coordinatesArray[0].toFixed(6)),
          ];
          this.tableData[index].to_location.coordinates = coordinatesArray;
          if (
            this.tableData[index].from_location.coordinates[0] !== 0 &&
            this.tableData[index].from_location.coordinates[1] !== 0
          ) {
            this.distanceCalculator(
              this.tableData[index].from_location,
              this.tableData[index].to_location,
              index,
            );
          }
        });
    },
    deleteRow(index, rows) {
      this.rowIndex = this.tableData.length - 2;
      this.tableData.splice(index, 1);
      this.pacInput1.splice(index, 1);
      this.pacInput2.splice(index, 1);
    },
    onChange(event, index, row) {
      this.vendorName = row.name;
      this.tableData[index].id = this.vendor.id;
      let insuranceValue = 0;
      if (this.tableData[index].distance && this.vendor.insurance) {
        insuranceValue =
          this.tableData[index].distance < this.vendor.insurance.max_distance_km
            ? this.vendor.insurance.max_distance_cost
            : this.vendor.insurance.above_max_distance_cost;
      } else if (
        this.tableData[index].distance === '' &&
        this.vendor.insurance
      ) {
        insuranceValue = this.vendor.insurance.max_distance_cost;
      }
      this.tableData[index].insurance = insuranceValue;
      this.calculateClientFee(index, row);
    },
    calculateClientFee(index, row) {
      const partnerAmount = parseInt(row.rider_amount, 10);
      const serviceFee = parseInt(row.service_fee, 10);
      const insurance = parseInt(row.insurance, 10);
      const orderAmount = partnerAmount + serviceFee + insurance;
      return (this.tableData[index].order_amount = orderAmount);
    },
    previewConfig() {
      this.previewLocationPricing = true;
      this.trackSaveAndPreview();
    },
    onSectionUpdate(value) {
      this.previewLocationPricing = value;
    },
    configSubmitted() {
      this.pacInput1[0].name = '';
      this.pacInput2[0].name = '';
      this.tableData = [
        {
          id: 1,
          name: '',
          cop_id: 1,
          cop_name: '',
          currency: 'KES',
          admin_id: 1,
          sendy_commission: 0,
          service_fee: 0,
          from: '',
          from_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          to_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          empty_return_location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          to: '',
          empty_container_destination: '',
          status: '',
          city: '',
          distance: '',
          order_amount: 0,
          rider_amount: 0,
          insurance: 0,
          container_weight_tonnes: '',
          container_size_feet: '',
          container_errand_type: 'drop_off',
        },
      ];
      this.previewLocationPricing = false;
      this.$emit('destroyLocationComponent');
      this.goBack();
    },
    trackAddPricingDataPage() {
      mixpanel.track('Add Location Pricing data Page - PageView', {
        type: 'PageView',
      });
    },
    trackSaveAndPreview() {
      mixpanel.track('Save and Preview Location Pricing button - ButtonClick', {
        type: 'Click',
      });
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val, input) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=geometry&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
          if (input === 1) {
            this.visible1 = true;
          } else if (input === 2) {
            this.visible2 = true;
          }
          setTimeout(() => {
            document
              .querySelectorAll('.el-popover')
              .forEach((row, index, arr) => {
                if (row.style.position === 'fixed') {
                  if (index === arr.length - 2) {
                    row.style.display = 'none';
                  }
                }
              });
          }, 50);
        });
    }, 500),
    distanceCalculator(from, to, index) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${
            from.coordinates[1]
          },${from.coordinates[0]}&destination=${to.coordinates[1]},${
            to.coordinates[0]
          }&key=${this.herokuKey}`,
        )
        .then(response => {
          this.tableData[index].distance = Math.floor(
            response.data.routes[0].legs[0].distance.value / 1000,
          );
          if (this.vendor) {
            this.onChange(
              this.tableData[index].distance,
              index,
              this.tableData[index],
            );
          }
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
.table--col-text {
  text-align: center !important;
}
.table--width {
  width: 1000px !important;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: auto;
  padding-bottom: 25px !important;
}
.insurance-reminder {
  margin-bottom: 5px;
  font-style: italic;
  font-weight: 900;
}
</style>
