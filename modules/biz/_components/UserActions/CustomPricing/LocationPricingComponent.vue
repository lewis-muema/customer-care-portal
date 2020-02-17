<template>
  <div>
    <div v-if="previewLocationPricing">
      <preview-location-pricing-component
        :configs="tableData"
        :user="user"
        @sectionUpdate="onSectionUpdate"
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
                v-model="pacInput1"
                :value="handleSelectFrom"
                :fetch-suggestions="querySearch"
                placeholder="Search location"
                :trigger-on-focus="false"
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
                v-model="pacInput2"
                :value="handleSelectTo"
                :fetch-suggestions="querySearch"
                placeholder="Search location"
                :trigger-on-focus="false"
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
                  v-for="vendor in vendorTypes"
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
      pacInput1: '',
      pacInput2: '',
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
          to: '',
          status: '',
          city: '',
          order_amount: 0,
          rider_amount: 0,
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
    pacInput1(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=geometry&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
        });
    },
    pacInput2(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
        });
    },
  },
  mounted() {
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    this.fetchVendorTypes(countryCode);
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
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
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
