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
        <el-table
          :data="tableData"
          row-class-name="no-hover"
          class="table--width"
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
          <el-table-column prop="from" label="Pick up location" width="335">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.from"
                size="small"
                class="table--col-text"
                placeholder="Search location"
                v-model="scope.row.from"
              ></el-input>
              <el-autocomplete
                v-else
                size="small"
                class="inline-input"
                v-model="pacInput1[scope.$index].name"
                :value="handleSelectFrom"
                :fetch-suggestions="querySearch"
                placeholder="Search location"
                :trigger-on-focus="false"
                @focus="rowIndex = scope.$index"
                @select="handleSelectFrom($event, scope.$index, scope.row)"
              >
              </el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="to" label="Drop off location" width="335">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.to"
                size="small"
                class="table--col-text"
                placeholder="Search location"
                v-model="scope.row.to"
              ></el-input>
              <el-autocomplete
                v-else
                size="small"
                class="inline-input"
                v-model="pacInput2[scope.$index].name"
                :value="handleSelectTo"
                :fetch-suggestions="querySearch"
                placeholder="Search location"
                :trigger-on-focus="false"
                @focus="rowIndex = scope.$index"
                @select="handleSelectTo($event, scope.$index, scope.row)"
              >
              </el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Vendor type" width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.name"
                placeholder="Select Vendor"
                size="small"
                @change="onChange($event, scope.$index, scope.row)"
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
                size="small"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="table--col-text"
                v-model="scope.row.order_amount"
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
      pacInput3: [
        {
          name: '',
        },
      ],
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
          currency: 'KES',
          admin_id: 1,
          sendy_commission: 0,
          service_fee: 0,
          from: '',
          from_location: {
            type: 'Point',
            coordinates: [36.799157, -1.299287],
          },
          to_location: {
            type: 'Point',
            coordinates: [39.671947, -4.056442],
          },
          empty_return_location: {
            type: 'Point',
            coordinates: [37.671947, -4.056444],
          },
          to: '',
          empty_container_destination: '',
          status: '',
          city: '',
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
        if (val && val.length > 2) {
          this.search(val);
        }
      },
      deep: true,
    },
    pacInput2: {
      handler(val) {
        val = val[this.rowIndex].name;
        if (val && val.length > 2) {
          this.search(val);
        }
      },
      deep: true,
    },
    pacInput3: {
      handler(val) {
        val = val[this.rowIndex].name;
        if (val && val.length > 2) {
          this.search(val);
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
  },
  methods: {
    ...mapMutations({
      updateSection: 'setSectionView',
    }),
    goBack() {
      this.updateSection(1);
      this.$emit('sectionUpdate', false);
    },
    querySearch(queryString, cb) {
      for (let i = 0; i < this.suggestions.length; i += 1) {
        this.suggestions[i].value = this.suggestions[i]['description'];
        delete this.suggestions[i].description;
      }
      cb(this.suggestions);
    },
    handleSelectFrom(item, index, rows) {
      this.tableData[index].from = item.value;
      this.pacInput1[index].name = '';
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
        });
    },
    handleSelectTo(item, index, rows) {
      this.tableData[index].to = item.value;
      this.pacInput2[index].name = '';
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
        });
    },
    handleSelectContainerDestination(item, index, rows) {
      this.tableData[index].empty_container_destination = item.value;
      this.pacInput3[index].name = '';
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
          // eslint-disable-next-line prettier/prettier
          this.tableData[index].empty_return_location.coordinates = coordinatesArray;
          this.tableData[index].container_errand_type = 'empty_return';
        });
    },
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
      this.pacInput1.splice(index, 1);
      this.pacInput2.splice(index, 1);
      this.pacInput3.splice(index, 1);
    },
    onChange(event, index, row) {
      this.vendorName = row.name;
      this.tableData[index].id = this.vendor.id;
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
      this.pacInput3[0].name = '';
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
            coordinates: [36.799157, -1.299287],
          },
          to_location: {
            type: 'Point',
            coordinates: [39.671947, -4.056442],
          },
          empty_return_location: {
            type: 'Point',
            coordinates: [37.671947, -4.056444],
          },
          to: '',
          empty_container_destination: '',
          status: '',
          city: '',
          order_amount: 0,
          rider_amount: 0,
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
    search: _.debounce(function(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=geometry&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
        });
    }, 500),
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
</style>
