<template>
  <div>
    <div v-if="previewDistancePricing">
      <preview-distance-pricing-component
        :configs="tableData"
        :user="user"
        @sectionUpdate="onSectionUpdate"
      ></preview-distance-pricing-component>
    </div>
    <div v-else>
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
          <el-table-column prop="city" label="City" width="335">
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
          <el-table-column prop="base_cost" label="Partner Amount" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="number"
                style="text-align:center"
                v-model.number="scope.row.base_cost"
                @change="calculateClientFee(scope.$index, scope.row)"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="service_fee" label="Service Fee" width="200">
            <template slot-scope="scope">
              <el-input
                size="small"
                type="number"
                style="text-align:center"
                v-model.number="scope.row.service_fee"
                @change="calculateClientFee(scope.$index, scope.row)"
                ><template class="pricing-prepend" slot="prepend">{{
                  currency
                }}</template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sendy_commission"
            label="Sendy Commission"
            width="200"
          >
            <template slot-scope="scope">
              <el-input
                size="small"
                type="number"
                style="text-align:center"
                v-model.number="scope.row.sendy_commission"
                @change="calculateClientFee(scope.$index, scope.row)"
              >
                <template class="pricing-prepend" slot="append"
                  >%
                </template></el-input
              >
            </template>
          </el-table-column>
          <el-table-column prop="client_fee" label="Client Fee" width="200">
            <template slot-scope="scope">
              <el-input
                :disabled="true"
                size="small"
                type="number"
                style="text-align:center"
                v-model.number="scope.row.client_fee"
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
                type="number"
                style="text-align:center"
                v-model.number="scope.row.base_km"
              >
                <template class="pricing-prepend" slot="prepend"
                  >KM
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
                type="number"
                size="small"
                style="text-align:center"
                v-model.number="scope.row.cost_per_km_above_base_km"
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
                type="number"
                style="text-align:center"
                v-model.number="scope.row.additional_location_cost"
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
                type="number"
                style="text-align:center"
                v-model.number="scope.row.waiting_time_cost_per_min"
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
                type="number"
                style="text-align:center"
                v-model.number="scope.row.loader_cost"
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
                type="number"
                style="text-align:center"
                v-model.number="scope.row.cancellation_fee"
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
        <el-button class="pricing-save-btn btn-primary" @click="previewConfig"
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
      pacInput: '',
      currency: '',
      vendorName: '',
      suggestions: [],
      vendorTypes: [],
      tableData: [
        {
          city: '',
          name: '',
          base_cost: '280',
          base_km: '20',
          cost_per_km_above_base_km: '2160',
          additional_location_cost: '108',
          waiting_time_cost_per_min: '18',
          loader_cost: '100',
          service_fee: '40',
          sendy_commission: '20',
          client_fee: '500',
          cancellation_fee: '40',
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
  },
  watch: {
    pacInput(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&key=AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
        });
    },
    calculateClientFee(val) {},
  },
  mounted() {
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    this.fetchVendorTypes(countryCode);
    this.trackMixpanelPage();
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
      this.previewDistancePricing = true;
    },
    onChange(event, index, row) {
      this.vendorName = row.name;
      this.tableData[index].id = this.vendor.id;
    },
    calculateClientFee(index, row) {
      const partnerAmount = parseInt(row.base_cost, 10);
      const serviceFee = parseInt(row.service_fee, 10);
      const sendyCommission = parseInt(row.sendy_commission, 10);
      const orderAmount =
        partnerAmount + serviceFee + (sendyCommission / 100) * partnerAmount;
      return (this.tableData[index].client_fee = orderAmount);
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
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
    },
    onSectionUpdate(value) {
      this.previewDistancePricing = value;
    },
    trackMixpanelPage() {
      mixpanel.track('New Distance Pricing Config Page Loaded');
    },
  },
};
</script>
