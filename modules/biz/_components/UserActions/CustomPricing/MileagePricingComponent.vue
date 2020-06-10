<template>
  <div>
    <div class="pricing-container">
      <p class="daily-rate-title">Mileage Pricing</p>
      <div class="daily-rate-pricing-tabs">
        <div
          class="daily-rate-pricing-tabs-titles"
          :class="mode === 'newPricing' ? 'active-pricing-tab' : ''"
          @click="mode = 'newPricing'"
        >
          New pricing
        </div>
        <div
          class="daily-rate-pricing-tabs-titles"
          :class="mode === 'allPricing' ? 'active-pricing-tab' : ''"
          @click="mode = 'allPricing'"
        >
          All pricings
        </div>
      </div>
      <div class="new-pricing-tab">
        <div v-if="displayInputs">
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Vendor type</p>
              <template>
                <el-select
                  :disabled="mode === 'allPricing'"
                  v-model="selectedVendor"
                  placeholder="Select Vendor"
                  size="large"
                  class="new-pricing-inputs"
                >
                  <el-option
                    v-for="vendor in filterdVendors"
                    :key="vendor.id"
                    :label="vendor.name"
                    :value="vendor.name"
                  >
                  </el-option>
                </el-select>
              </template>
            </div>
            <div>
              <p class="pricing-input-labels">Currency</p>
              <div>
                <template>
                  <el-select
                    v-model="currency"
                    placeholder="Select Currency"
                    size="large"
                    class="new-pricing-inputs"
                    disabled
                  >
                    <el-option :label="currency" :value="currency"> </el-option>
                  </el-select>
                </template>
              </div>
            </div>
            <div v-if="mode === 'newPricing'">
              <p class="pricing-input-labels">Price type</p>
              <p class="no-margin">
                <input
                  type="radio"
                  v-model="partnerPriceType"
                  value="per_km_band"
                  id="exclusive"
                />
                <label for="exclusive">per km band </label>
              </p>
              <p class="no-margin">
                <input
                  type="radio"
                  v-model="partnerPriceType"
                  value="standard_rate_per_km"
                  id="inclusive"
                />
                <label for="inclusive">Standard rate per km </label>
              </p>
            </div>
          </div>
          <p
            class="pricing-input-section-titles"
            v-if="partnerPriceType === 'per_km_band'"
          >
            KM Bands
          </p>
          <div v-if="partnerPriceType === 'per_km_band'">
            <div
              class="new-pricing-tab-rows"
              v-for="(band, index) in kmBands"
              :key="index"
            >
              <div>
                <p class="pricing-input-labels">Enter KM range</p>
                <div class="new-pricing-tab-rows">
                  <div>
                    <p class="pricing-time-input-labels">Between</p>
                    <el-input
                      type="text"
                      v-model="band.lowerLimitKm"
                      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                      placeholder="Between X km"
                      class="new-pricing-inputs-from-kms"
                      @blur="setLowerLimit(index)"
                    >
                    </el-input>
                  </div>
                  <div>
                    <p class="pricing-time-input-labels">and</p>
                    <el-input
                      type="text"
                      v-model="band.upperLimitKm"
                      onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                      placeholder="and Y km"
                      class="new-pricing-inputs-to-kms"
                      @blur="setUpperLimit(index)"
                    >
                      <template class="pricing-prepend" slot="append">
                        KMS
                      </template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="pricing-monthly-rate-inputs">
                <p class="pricing-input-labels">Customer Rate (per KM)</p>
                <el-input
                  type="text"
                  v-model="band.customerRatePerKm"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  class="new-pricing-inputs-rates"
                  ><template class="pricing-prepend" slot="append">
                    {{ currency }}
                  </template>
                </el-input>
              </div>
              <div class="pricing-monthly-rate-inputs">
                <i
                  v-if="index > 0"
                  @click="removeBandRow(index)"
                  class="el-icon-close remove-band-button"
                />
                <p class="pricing-input-labels">Partner Rate (per KM)</p>
                <el-input
                  type="text"
                  v-model="band.partnerRatePerKm"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  class="new-pricing-inputs-rates"
                  ><template class="pricing-prepend" slot="append">
                    {{ currency }}
                  </template>
                </el-input>
              </div>
            </div>
            <p class="add-band-button" @click="addBandRow()">+ Add band</p>
          </div>
          <p
            class="pricing-input-section-titles"
            v-if="partnerPriceType === 'standard_rate_per_km'"
          >
            Standard rate per km
          </p>
          <div
            class="new-pricing-tab-rows"
            v-if="partnerPriceType === 'standard_rate_per_km'"
          >
            <div>
              <p class="pricing-input-labels">Cost per Km</p>
              <el-input
                type="text"
                v-model="costPerKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Parter cost per Km</p>
              <el-input
                type="text"
                v-model="partnerCostPerKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Minimum distance (KM)</p>
              <el-input
                type="text"
                v-model="minDistance"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Customer Rate</p>
              <el-input
                type="text"
                v-model="customerRate"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter amount"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Partner Rate</p>
              <el-input
                type="text"
                v-model="partnerRate"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter amount"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Fuel Cost</p>
              <input
                type="radio"
                v-model="fuelInclusivity"
                value="true"
                id="inclusive"
              />
              <label for="inclusive" class="pricing-radio-labels"
                >Inclusive
              </label>
              <input
                type="radio"
                v-model="fuelInclusivity"
                value="false"
                id="exclusive"
              />
              <label for="exclusive" class="pricing-radio-labels"
                >Non Inclusive
              </label>
            </div>
          </div>
        </div>
        <div class="bands-table" v-if="mode === 'newPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tableData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">KM Band</div>
            <div class="bands-col-3">Minimum Distance</div>
            <div class="bands-col-4"></div>
          </div>
          <div
            v-for="(data, index) in tableData"
            :key="index"
            class="bands-body-row"
          >
            <div class="bands-col-1">
              {{ data.vendor }}
            </div>
            <div class="bands-col-2 pricing-table-divider">
              <div
                class="bands-km-col"
                v-if="data.partner_price_type === 'per_km_band'"
              >
                <div v-for="(singleBand, x) in data.km_bands" :key="x">
                  <!-- eslint-disable-next-line prettier/prettier -->
                {{ singleBand.lowerLimitKm }}KM - {{ singleBand.upperLimitKm }}KM
                </div>
              </div>
              <div class="bands-km-col" v-else>
                Standard rate per Km
              </div>
            </div>
            <div class="bands-col-3">{{ data.minimum_distance }} KMS</div>
            <div class="bands-col-4">
              <span
                class="new-pricing-delete"
                @click="showDeleteDialogue('tableData', index, data.vendor)"
              >
                delete
              </span>
              <span class="new-pricing-edit" @click="editBand(index)">
                edit
              </span>
            </div>
          </div>
          <p class="pricing-input-section-note">
            Note: All charges are VAT exclusive
          </p>
        </div>
        <div class="bands-table" v-if="mode === 'allPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tablePricingData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">KM Band</div>
            <div class="bands-col-3">Minimum Distance</div>
            <div class="bands-col-4"></div>
          </div>
          <div v-for="(data, index) in tablePricingData" :key="index">
            <div class="pricing-body-row" @click="toggleRow(index)">
              <div class="bands-col-1 pricing-table-divider">
                {{ data.name }}
              </div>
              <div class="bands-col-2 pricing-table-divider">
                <div
                  class="bands-km-col"
                  v-if="data.partner_price_type === 'per_km_band'"
                >
                  <div v-for="(singleBand, x) in data.cost_band" :key="x">
                    <!-- eslint-disable-next-line prettier/prettier -->
                {{ singleBand.min_km }}KM - {{ singleBand.max_km }}KM
                  </div>
                </div>
                <div class="bands-km-col" v-else>
                  Standard rate per Km
                </div>
              </div>
              <div class="bands-col-3">{{ data.minimum_distance }} KMS</div>
              <div class="bands-col-4">
                <div class="all-pricing-dropdown-buttons">
                  <span>
                    <p
                      v-if="data.status === 'Active'"
                      class="active-status-tag pricing-status-button status-tag"
                    >
                      Active
                    </p>
                    <p
                      v-else
                      class="waiting-status-tag pricing-status-button status-tag"
                    >
                      Awaiting approval
                    </p>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="all-pricing-container pricing-row-spacer"
              v-if="opened.includes(index)"
            >
              <div class="pricing-input-titles">
                <span class="pricing-input-container-title">
                  Pricing
                </span>
                <span class="pricing-input-container-buttons">
                  <div
                    class="all-pricing-delete"
                    @click="
                      showDeleteDialogue('tablePricingData', index, data.name)
                    "
                    v-if="data.status === 'Active'"
                  >
                    delete
                  </div>
                  <div class="all-pricing-edit" @click="editAllPricing(index)">
                    edit
                  </div>
                </span>
              </div>
              <div class="all-pricing-details">
                <div class="all-pricing-column">
                  <p class="pricing-input-section-titles">
                    Rates
                  </p>
                  <div class="all-pricing-card">
                    <p class="all-pricing-card-text">
                      Customer Rate:
                      <span class="all-pricing-card-values"
                        >{{ currency }} {{ data.minimum_customer_rate }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Partner Rate:
                      <span class="all-pricing-card-values"
                        >{{ currency }} {{ data.minimum_partner_rate }}</span
                      >
                    </p>
                    <p
                      class="all-pricing-card-text"
                      v-if="data.partner_price_type === 'standard_rate_per_km'"
                    >
                      Cost per KM:
                      <span class="all-pricing-card-values"
                        >{{ currency }} {{ data.cost_per_km }}</span
                      >
                    </p>
                    <p
                      class="all-pricing-card-text"
                      v-if="data.partner_price_type === 'standard_rate_per_km'"
                    >
                      Partner cost per KM:
                      <span class="all-pricing-card-values"
                        >{{ currency }} {{ data.partner_cost_per_km }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Fuel cost:
                      <span class="all-pricing-card-values">{{
                        data.fuel_inclusive === true
                          ? 'Inclusive'
                          : 'Non-inclusive'
                      }}</span>
                    </p>
                  </div>
                </div>
                <div class="all-pricing-column">
                  <p class="pricing-input-section-titles">
                    Minimum KM
                  </p>
                  <div class="all-pricing-card">
                    <p class="all-pricing-card-text">
                      Minimum KMs:
                      <span class="all-pricing-card-values"
                        >{{ data.minimum_distance }} KMs</span
                      >
                    </p>
                  </div>
                  <p
                    class="pricing-input-section-titles"
                    v-if="data.partner_price_type === 'per_km_band'"
                  >
                    KM bands
                  </p>
                  <div
                    class="all-pricing-card"
                    v-for="(band, index) in data.cost_band"
                    :key="index"
                  >
                    <p class="all-pricing-card-text">
                      Band:
                      <span class="all-pricing-card-values card-values-override"
                        >{{ band.min_km }}KMs - {{ band.max_km }}KMs</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Customer rate per km:
                      <span class="all-pricing-card-values"
                        >{{ data.currency }} {{ band.customer_rate }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Partner rate per km:
                      <span class="all-pricing-card-values"
                        >{{ data.currency }} {{ band.partner_rate }}</span
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="pricing-row-spacer" v-else />
          </div>
          <div v-if="tablePricingData.length === 0">
            There are no mileage configs for {{ user.user_details.cop_name }}
          </div>
        </div>
        <div
          class="pricing-approvers-container"
          v-if="displayInputs && !editStatus"
        >
          <template>
            <div class="pricing-approver-select">
              <div class="approver-title">
                Select the manager to approve
              </div>
              <el-select
                v-model="approver"
                size="small"
                class="el-input--small"
                filterable
                placeholder="Select manager"
              >
                <el-option
                  v-for="admin in admin_list"
                  :key="admin.admin_id"
                  :label="admin.name"
                  :value="admin.admin_id"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </div>
        <div
          v-if="displayInputs"
          class="new-pricing-tab-rows new-pricing-buttons"
        >
          <button
            v-if="!editStatus"
            class="new-pricing-input-buttons"
            :class="
              addBandStatus
                ? 'new-pricing-add-band-button'
                : 'inactive-add-band-button'
            "
            @click="addBand()"
          >
            Add vendor type
          </button>
          <button
            v-if="editStatus"
            class="edit-pricing-cancel-button new-pricing-input-buttons"
            @click="cancelEdit()"
          >
            cancel
          </button>
          <button
            v-if="editStatus && mode === 'newPricing'"
            class="new-pricing-input-buttons"
            :class="
              addBandStatus
                ? 'new-pricing-submit-button'
                : 'inactive-submit-approval-button'
            "
            @click="saveBand()"
          >
            Save
          </button>
          <button
            v-if="editStatus && mode === 'allPricing'"
            class="new-pricing-input-buttons"
            :class="
              addBandStatus
                ? 'new-pricing-submit-button'
                : 'inactive-submit-approval-button'
            "
            @click="saveAllPricing()"
          >
            Save
          </button>
          <button
            v-if="!editStatus"
            class="new-pricing-input-buttons"
            :class="
              submitApprovalStatus && approver !== ''
                ? 'new-pricing-submit-button'
                : 'inactive-submit-approval-button'
            "
            @click="submitConfigs()"
          >
            Submit for approval
          </button>
        </div>
        <div class="pricing-popup-dialogue" v-if="showDialogue">
          <div class="pricing-popup-dialogue-box">
            <p class="pricing-popup-dialogue-title">
              Are you sure you want to delete this price configuration for
              {{ deleteBand.vendor }} vendor type?
            </p>
            <button
              class="pricing-popup-dialogue-buttons delete-button"
              @click="deleteSingleBand()"
            >
              Yes, Delete
            </button>
            <button
              class="pricing-popup-dialogue-buttons cancel-button"
              @click="showDialogue = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button @click="goBack()" class="pricing-back-text">
        Previous page
      </button>
    </div>
    <div>
      <preview-container-pricing-component v-if="preview" />
    </div>
  </div>
</template>
<script>
import Mixpanel from 'mixpanel';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';
import SessionMxn from '@/mixins/session_mixin';

const mixpanel = Mixpanel.init('b36c8592008057290bf5e1186135ca2f');
export default {
  name: 'MileagePricingComponent',
  mixins: [PricingConfigsMxn, SessionMxn],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      copName: this.user.user_details.cop_name,
      copId: this.user.user_details.cop_id,
      mode: 'newPricing',
      showDialogue: false,
      admin_list: [],
      approver: 0,
      approverMail: '',
      approverSelect: false,
      kmBands: [
        {
          lowerLimitKm: '',
          upperLimitKm: '',
          customerRatePerKm: '',
          partnerRatePerKm: '',
        },
      ],
      lowerLimitKm: '',
      upperLimitKm: '',
      preview: false,
      selectedVendor: '',
      minDistance: '',
      costPerKm: '',
      partnerCostPerKm: '',
      customerRatePerKm: '',
      partnerRatePerKm: '',
      customerRate: '',
      partnerRate: '',
      partnerPriceType: 'per_km_band',
      currency: '',
      vendorName: '',
      fuelInclusivity: true,
      editStatus: false,
      editedBandIndex: 0,
      deleteBand: {
        index: 0,
        vendor: 'Bike',
        table: 'tableData',
      },
      vendorTypes: [],
      opened: [],
      tableData: [],
      tablePricingData: [],
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      section: 'getSectionView',
      getSessionData: 'getSession',
      configuredDedicatedPricing: 'getConfiguredDedicatedPricing',
    }),
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.vendorName;
      });
    },
    admin() {
      return this.admin_list.find(op => {
        return op.admin_id === this.approver;
      });
    },
    displayInputs() {
      if (
        this.mode === 'newPricing' ||
        (this.mode === 'allPricing' && this.editStatus)
      ) {
        return true;
      }
      return false;
    },
    filterdVendors() {
      const vendors = [];
      const enabledVendors = [];
      this.configuredDedicatedPricing.forEach(row => {
        vendors.push(row.name);
      });
      this.vendorTypes.forEach(row => {
        if (!vendors.includes(row.name)) {
          enabledVendors.push(row);
        }
      });
      return enabledVendors;
    },
    MileageData() {
      const data = [];
      this.configuredDedicatedPricing.forEach((row, i) => {
        if (
          row.price_type === 'standard_rate_per_km' ||
          row.price_type === 'per_km_band'
        ) {
          row.index = i;
          data.push(row);
        }
      });
      return data;
    },
    assignments() {
      const vendor_id = this.vendorTypes.find(op => {
        return op.name === this.selectedVendor;
      });
      const assignments = {
        id: vendor_id.id,
        name: this.selectedVendor,
        currency: this.currency,
        minimum_distance: parseInt(this.minDistance, 10),
        minimum_customer_rate: parseInt(this.customerRate, 10),
        minimum_partner_rate: parseInt(this.partnerRate, 10),
        fuel_inclusive: JSON.parse(this.fuelInclusivity),
        partner_price_type: this.partnerPriceType,
      };
      if (this.partnerPriceType === 'per_km_band') {
        assignments.cost_band = this.modifyCostBand(this.kmBands);
      } else {
        assignments.cost_per_km = parseInt(this.costPerKm, 10);
        assignments.partner_cost_per_km = parseInt(this.partnerCostPerKm, 10);
      }
      return assignments;
    },
    addBandStatus() {
      if (
        this.minDistance &&
        this.kmBands[0].customerRatePerKm &&
        this.kmBands[0].partnerRatePerKm &&
        this.customerRate &&
        this.partnerRate &&
        this.kmBands[0].lowerLimitKm &&
        this.kmBands[0].upperLimitKm &&
        this.partnerPriceType === 'per_km_band'
      ) {
        return true;
      } else if (
        this.minDistance &&
        this.customerRate &&
        this.partnerRate &&
        this.costPerKm &&
        this.partnerCostPerKm &&
        this.partnerPriceType === 'standard_rate_per_km'
      ) {
        return true;
      }
      return false;
    },
    submitApprovalStatus() {
      if (this.tableData.length > 0) {
        return true;
      }
      return false;
    },
  },
  watch: {
    mode(val) {
      this.editStatus = false;
      this.clearInputs();
      this.opened = [];
      this.editedBandIndex = 0;
    },
    getAdmins(admins) {
      return (this.admin_list = admins);
    },
  },
  async mounted() {
    await this.setAdmins();
    this.currency = this.user.user_details.default_currency;
    const countryCode = this.user.user_details.country_code;
    await this.fetchVendorTypes(countryCode);
    this.trackAddPricingDataPage();
    this.tablePricingData = this.MileageData;
    this.selectedVendor = this.filterdVendors[0].name;
  },
  methods: {
    ...mapMutations({
      updatePricing: 'updatePricing',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSection: 'setSectionView',
      modifyDedicatedDetails: 'modifyDedicatedDetails',
    }),
    ...mapActions({
      submit_custom_pricing: 'submit_custom_pricing',
      approve_pricing_configs: 'approve_pricing_configs',
      setAdmins: 'setAdmins',
    }),
    addBandRow() {
      this.kmBands.push({
        lowerLimitKm: '',
        upperLimitKm: '',
        customerRatePerKm: '',
        partnerRatePerKm: '',
      });
    },
    setLowerLimit(i) {
      if (
        i > 0 &&
        this.kmBands[i - 1].upperLimitKm &&
        this.kmBands[i].lowerLimitKm
      ) {
        this.kmBands[i].lowerLimitKm =
          parseInt(this.kmBands[i].lowerLimitKm) >
          parseInt(this.kmBands[i - 1].upperLimitKm)
            ? this.kmBands[i].lowerLimitKm
            : this.kmBands[i - 1].upperLimitKm;
      }
    },
    setUpperLimit(i) {
      if (this.kmBands[i].upperLimitKm && this.kmBands[i].lowerLimitKm) {
        this.kmBands[i].upperLimitKm =
          parseInt(this.kmBands[i].lowerLimitKm) >
          parseInt(this.kmBands[i].upperLimitKm)
            ? parseInt(this.kmBands[i].lowerLimitKm) + 1
            : this.kmBands[i].upperLimitKm;
      }
    },
    removeBandRow(i) {
      this.kmBands.splice(i, 1);
    },
    goBack() {
      this.updateSection(1);
      this.$emit('sectionUpdate', false);
    },
    toggleRow(i) {
      if (this.opened.includes(i)) {
        const index = this.opened.indexOf(i);
        this.opened.splice(index, 1);
      } else {
        this.opened.push(i);
      }
    },
    addBand() {
      this.tableData.push({
        vendor: this.selectedVendor,
        currency: this.currency,
        minimum_distance: this.minDistance,
        customer_rate: this.customerRate,
        partner_rate: this.partnerRate,
        km_bands: this.kmBands,
        cost_per_km: this.costPerKm,
        partner_cost_per_km: this.partnerCostPerKm,
        fuel_inclusive: this.fuelInclusivity,
        partner_price_type: this.partnerPriceType,
      });
      this.clearInputs();
    },
    clearInputs() {
      this.selectedVendor =
        this.filterdVendors.length > 0 ? this.filterdVendors[0].name : 'Bike';
      this.minDistance = '';
      this.customerRate = '';
      this.partnerRate = '';
      this.kmBands = [
        {
          lowerLimitKm: '',
          upperLimitKm: '',
          customerRatePerKm: '',
          partnerRatePerKm: '',
        },
      ];
      this.costPerKm = '';
      this.partnerCostPerKm = '';
      this.fuelInclusivity = true;
      this.partnerPriceType = 'per_km_band';
    },
    cancelEdit() {
      this.editStatus = false;
      this.clearInputs();
      this.editedBandIndex = 0;
    },
    showDeleteDialogue(table, index, vendor) {
      this.deleteBand = {
        index,
        table,
        vendor,
      };
      this.showDialogue = true;
    },
    async deleteSingleBand() {
      this.opened = [];
      if (this.deleteBand.table === 'tableData') {
        this.tableData.splice(this.deleteBand.index, 1);
      } else {
        const notification = [];
        let actionClass = '';
        const payload = {
          app: 'PRICING_SERVICE',
          endpoint: 'price_config/review_dedicated_price_configs',
          apiKey: false,
          params: {
            cop_id: this.copId,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            approval_info: [
              {
                vendor_id: this.tablePricingData[this.deleteBand.index].id,
                message: 'Approved',
                approved_by: parseInt(this.adminId, 10),
                status: 'DeActivated',
              },
            ],
          },
        };
        try {
          const data = await this.approve_pricing_configs(payload);
          if (data.status) {
            this.fetchData();
            this.trackMixpanelPeople();
            notification.push(data.message);
            actionClass = this.display_order_action_notification(data.status);
            this.updateSuccess(false);
          } else {
            this.trackMixpanelPeople();
            notification.push(data.error);
            actionClass = this.display_order_action_notification(data.status);
          }
        } catch (error) {
          notification.push('Something went wrong. Please try again.');
          actionClass = 'danger';
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
      this.showDialogue = false;
    },
    editBand(i) {
      this.selectedVendor = this.tableData[i].vendor;
      this.currency = this.tableData[i].currency;
      this.minDistance = this.tableData[i].minimum_distance;
      this.customerRate = this.tableData[i].customer_rate;
      this.partnerRate = this.tableData[i].partner_rate;
      this.partnerPriceType = this.tableData[i].partner_price_type;
      this.costPerKm = this.tableData[i].cost_per_km;
      this.partnerCostPerKm = this.tableData[i].partner_cost_per_km;
      this.kmBands = this.tableData[i].km_bands;
      this.fuelInclusivity = this.tableData[i].fuel_inclusive;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveBand() {
      this.tableData[this.editedBandIndex].vendor = this.selectedVendor;
      this.tableData[this.editedBandIndex].currency = this.currency;
      this.tableData[this.editedBandIndex].minimum_distance = this.minDistance;
      this.tableData[this.editedBandIndex].customer_rate = this.customerRate;
      this.tableData[this.editedBandIndex].partner_rate = this.partnerRate;
      this.tableData[
        this.editedBandIndex
      ].partner_price_type = this.partnerPriceType;
      this.tableData[this.editedBandIndex].cost_per_km = this.costPerKm;
      this.tableData[
        this.editedBandIndex
      ].partner_cost_per_km = this.partnerCostPerKm;
      this.tableData[this.editedBandIndex].km_bands = this.kmBands;
      this.tableData[
        this.editedBandIndex
      ].partner_price_type = this.partnerPriceType;
      this.tableData[
        this.editedBandIndex
      ].fuel_inclusive = this.fuelInclusivity;
      this.editStatus = false;
      this.editedBandIndex = 0;
      this.clearInputs();
    },
    editAllPricing(i) {
      this.selectedVendor = this.tablePricingData[i].name;
      this.currency = this.tablePricingData[i].currency;
      this.minDistance = this.tablePricingData[i].minimum_distance;
      this.customerRate = this.tablePricingData[i].minimum_customer_rate;
      this.partnerRate = this.tablePricingData[i].minimum_partner_rate;
      this.partnerPriceType = this.tablePricingData[i].partner_price_type;
      this.costPerKm = Object.prototype.hasOwnProperty.call(
        this.tablePricingData[i],
        'cost_per_km',
      )
        ? this.tablePricingData[i].cost_per_km
        : '';
      this.partnerCostPerKm = Object.prototype.hasOwnProperty.call(
        this.tablePricingData[i],
        'partner_cost_per_km',
      )
        ? this.tablePricingData[i].partner_cost_per_km
        : '';
      this.kmBands = Object.prototype.hasOwnProperty.call(
        this.tablePricingData[i],
        'cost_band',
      )
        ? this.revertCostBand(this.tablePricingData[i].cost_band)
        : [
            {
              lowerLimitKm: '',
              upperLimitKm: '',
              customerRatePerKm: '',
              partnerRatePerKm: '',
            },
          ];
      this.fuelInclusivity = this.tablePricingData[i].fuel_inclusive;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveAllPricing() {
      Object.keys(this.assignments).forEach((row, i) => {
        this.modifyDedicatedDetails({
          index: this.tablePricingData[this.editedBandIndex].index,
          field: row,
          value: Object.values(this.assignments)[i],
        });
      });
      this.editConfigs(this.tablePricingData[this.editedBandIndex].index);
    },
    async fetchData() {
      await this.fetchDedicatedPricingData();
      this.tablePricingData = this.MileageData;
      this.selectedVendor = this.filterdVendors[0].name;
      this.showDialogue = false;
    },
    modifyCostBand(bands) {
      const allbands = [];
      bands.forEach(row => {
        allbands.push({
          min_km: parseInt(row.lowerLimitKm, 10),
          max_km: parseInt(row.upperLimitKm, 10),
          customer_rate: parseInt(row.customerRatePerKm, 10),
          partner_rate: parseInt(row.partnerRatePerKm, 10),
        });
      });
      return allbands;
    },
    revertCostBand(bands) {
      const allbands = [];
      bands.forEach(row => {
        allbands.push({
          lowerLimitKm: parseInt(row.min_km, 10),
          upperLimitKm: parseInt(row.max_km, 10),
          customerRatePerKm: parseInt(row.customer_rate, 10),
          partnerRatePerKm: parseInt(row.partner_rate, 10),
        });
      });
      return allbands;
    },
    createSubmitPayload() {
      const payload = {
        cop_id: this.copId,
        cop_name: this.copName,
        vendors: [],
      };
      this.tableData.forEach(row => {
        const vendor_id = this.vendorTypes.find(op => {
          return op.name === row.vendor;
        });
        const payloadData = {
          id: vendor_id.id,
          name: row.vendor,
          currency: row.currency,
          price_type: row.partner_price_type,
          fuel_inclusive: JSON.parse(row.fuel_inclusive),
          minimum_distance: parseInt(row.minimum_distance, 10),
          partner_price_type: row.partner_price_type,
          minimum_customer_rate: parseInt(row.customer_rate, 10),
          minimum_partner_rate: parseInt(row.partner_rate, 10),
          created_by: parseInt(this.getSessionData.payload.data.admin_id),
          approved_by: this.admin.admin_id,
          date_approved: '',
          date_created: moment().format('YYYY-MM-DD HH:mm:ss'),
          status: 'Pending',
        };
        if (row.partner_price_type === 'per_km_band') {
          payloadData.cost_band = this.modifyCostBand(row.km_bands);
        } else {
          payloadData.cost_per_km = parseInt(row.cost_per_km, 10);
          payloadData.partner_cost_per_km = parseInt(
            row.partner_cost_per_km,
            10,
          );
        }
        payload.vendors.push(payloadData);
      });
      return payload;
    },
    async submitConfigs() {
      this.trackPricingSubmit();
      const configParams = this.createSubmitPayload();
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/add_mileage_pricing',
        apiKey: false,
        params: configParams,
      };
      try {
        const data = await this.submit_custom_pricing(payload);
        if (data.status) {
          this.tableData = [];
          this.fetchData();
          this.clearInputs();
          this.trackPassedSubmission();
          this.trackMixpanelPeople();
          this.submitNotification();
          notification.push(
            'You have successfully created the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.updateSuccess(false);
          this.sendEmailNotification(
            this.admin.email,
            this.admin.name,
            'created',
          );
          this.approver = 0;
        } else {
          this.trackFailedSubmission();
          this.trackMixpanelPeople();
          notification.push(`${data.message}, ${data.errors}`);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
      setTimeout(() => {
        this.updateErrors([]);
      }, 5000);
      this.trackMixpanelPeople();
    },
    async editConfigs(index) {
      delete this.configuredDedicatedPricing[index].index;
      const configParams = {
        cop_id: this.copId,
        cop_name: this.copName,
        vendors: [this.configuredDedicatedPricing[index]],
      };
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/update_mileage_pricing',
        apiKey: false,
        params: configParams,
      };
      try {
        const data = await this.submit_custom_pricing(payload);
        if (data.status) {
          this.editStatus = false;
          this.editedBandIndex = 0;
          this.clearInputs();
          this.fetchData();
          notification.push(
            'You have successfully edited the custom pricing config!',
          );
          actionClass = this.display_order_action_notification(data.status);
          this.approver = this.configuredDedicatedPricing[index].approved_by;
          this.sendEmailNotification(
            this.admin.email,
            this.admin.name,
            'edited',
          );
          this.approver = 0;
          this.updateSuccess(false);
        } else {
          notification.push(`${data.message}, ${data.errors}`);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
      setTimeout(() => {
        this.updateErrors([]);
      }, 5000);
      this.trackMixpanelPeople();
    },
    submitNotification() {
      this.$emit('configSubmitted');
    },
    trackAddPricingDataPage() {
      mixpanel.track('Add Mileage Pricing data Page - PageView', {
        type: 'PageView',
      });
    },
    trackSaveAndPreview() {
      mixpanel.track('Save and Preview Mileage Pricing button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPricingSubmitPage() {
      mixpanel.track('Submit mileage pricing for approval Page - PageView', {
        type: 'PageView',
      });
    },
    trackPricingSubmit() {
      mixpanel.track('"Submit Request" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedSubmission() {
      mixpanel.track('Mileage pricing saved - Success', {
        type: 'Success',
      });
    },
    trackFailedSubmission() {
      mixpanel.track('Mileage pricing not saved - Fail', {
        type: 'Fail',
      });
    },
    trackViewDetailsPage() {
      mixpanel.track('View Details Link - PageView', {
        type: 'PageView',
      });
    },
    trackResetConfigs() {
      mixpanel.track('"Reset Pricing" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackRemoveSingleConfigs() {
      mixpanel.track('"Remove Single Pricing" Icon - ButtonClick', {
        type: 'Click',
      });
    },
    trackResetConfigsSuccess() {
      mixpanel.track('Reset successful - Success', {
        type: 'Success',
      });
    },
    trackResetConfigsFail() {
      mixpanel.track('Reset failed - Fail', {
        type: 'Fail',
      });
    },
    trackMixpanelIdentify() {
      mixpanel.identify('Approver', {
        email: this.getSessionData.payload.data.email,
        admin_id: this.getSessionData.payload.data.admin_id,
      });
    },
    trackMixpanelPeople() {
      mixpanel.people.set({
        'User Type': 'Approver',
        $email: this.getSessionData.payload.data.email,
        $name: this.getSessionData.payload.data.name,
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
.single-suggestion {
  cursor: pointer;
  height: 25px;
  padding-right: 15px;
}

.daily-rate-title {
  color: #1871ac;
  font-size: 20px;
  font-weight: 500;
}
.daily-rate-pricing-tabs {
  display: flex;
  margin-bottom: -1px;
}
.daily-rate-pricing-tabs-titles {
  padding: 15px;
  color: #1b7fc3;
  font-size: 14px;
}
.active-pricing-tab {
  border-top: 2px solid #1b7fc3;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  border-bottom: 1px solid white;
}
.new-pricing-tab {
  border: 1px solid #ebebeb;
  padding: 30px;
}
.new-pricing-tab-rows {
  display: flex;
  margin-bottom: 5px;
}
.pricing-input-labels {
  margin: 5px;
}
.pricing-input-section-titles {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #f28226;
  font-size: 14px;
  font-weight: 600;
}
.pricing-time-input-labels {
  margin: 0px;
  color: #2197e5;
}
.new-pricing-inputs {
  height: 40px;
  width: 200px;
  margin-right: 20px;
}
.new-pricing-inputs-from-kms {
  height: 40px;
  width: 120px;
}
.new-pricing-inputs-to-kms {
  height: 40px;
  width: 170px;
  margin-right: 20px;
}
.new-pricing-inputs-rates {
  height: 40px;
  width: 150px;
  margin-right: 20px;
}
.pricing-monthly-rate-inputs {
  margin-top: 18px;
}
.pricing-radio-labels {
  margin: 10px 15px 5px 5px;
}
.new-pricing-input-buttons {
  height: 40px;
  width: 165px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-right: 10px;
  border: 0px solid;
}
.new-pricing-buttons {
  justify-content: flex-end;
}
.new-pricing-add-band-button {
  background: #f28226;
  border-color: #f28226;
}
.new-pricing-submit-button {
  background: #1b7fc3;
  border-color: #1b7fc3;
}
.inactive-add-band-button {
  background: #f282268c;
  border-color: #f282268c;
  pointer-events: none;
}
.inactive-submit-approval-button {
  background: #1b7fc37a;
  border-color: #1b7fc37a;
  pointer-events: none;
}
.bands-col-1,
.bands-col-2,
.bands-col-3 {
  width: 25%;
  padding-left: 15px;
  height: max-content;
  display: flex;
  align-items: center;
}
.bands-col-4 {
  width: 25%;
  justify-content: flex-end;
  display: flex;
  padding-right: 5%;
}
.bands-km-col {
  min-height: 50px;
  display: grid;
  align-items: center;
}
.bands-heading-row,
.bands-body-row {
  display: flex;
}
.bands-heading-row {
  color: #1871ac;
}
.bands-body-row {
  color: #8f9bb3;
  background-color: rgba(191, 209, 227, 0.18);
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 15px;
  margin-bottom: 15px;
}
.pricing-body-row {
  color: #8f9bb3;
  background-color: rgba(191, 209, 227, 0.18);
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 15px;
}
.pricing-row-spacer {
  margin-bottom: 15px;
}
.pricing-table-divider {
  border-right: 1px solid #80808040;
  border-left: 1px solid #80808040;
}
.new-pricing-edit,
.new-pricing-delete {
  font-size: 12px;
  text-align: right;
  margin: 0px 25px 0px 0px;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
}
.new-pricing-edit {
  color: #d2212a;
}
.new-pricing-delete {
  color: #0e4266;
}
.all-pricing-arrow {
  color: #1871ac;
  font-size: 20px;
}
.all-pricing-dropdown-buttons {
  display: flex;
  justify-content: flex-end;
}
.all-pricing-container {
  padding: 2% 2% 2% 2%;
  border-top: 1px solid #80808040;
  border-radius: 5px;
}
.all-pricing-details {
  display: flex;
}
.all-pricing-column {
  width: 50%;
}
.all-pricing-column-label {
  color: #1871ac;
  margin: 0px;
  font-size: 14px;
}
.all-pricing-column-value {
  margin: 5px 0px 15px 0px;
  font-size: 15px;
  color: #848484;
}
.all-pricing-edit {
  color: #0e4266;
  text-decoration: underline;
  padding: 0 15px 0 0px;
  cursor: pointer;
}
.all-pricing-delete {
  color: #d2212a;
  text-decoration: underline;
  padding: 0 15px 0 0px;
  cursor: pointer;
}
.edit-pricing-cancel-button {
  background: #c5cee0;
  border-color: #c5cee0;
}
.pricing-container {
  position: relative;
}
.pricing-popup-dialogue {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  margin-left: -30px;
  background: #10142673;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pricing-popup-dialogue-box {
  background: white;
  padding: 5%;
  border-radius: 10px;
}
.pricing-popup-dialogue-buttons {
  display: block;
  margin: auto;
  padding: 10px;
  border-radius: 5px;
  color: white;
  width: 100px;
  margin-bottom: 10px;
  border: 0px solid;
}
.pricing-popup-dialogue-title {
  width: 240px;
  margin: 20px;
  text-align: center;
}
.delete-button {
  background: #d2212a;
  border-color: #d2212a;
}
.cancel-button {
  background: #6ec763;
  border-color: #6ec763;
}
.pricing-approvers-container {
  width: 200px;
  margin-left: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.pricing-radio-input-labels {
  width: max-content;
  padding: 0px 10px 0px 0px;
}
.all-pricing-card {
  margin: 0px 15px 15px 0px;
  padding: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}
.all-pricing-card-text {
  margin-bottom: 5px;
  font-size: 14px;
}
.all-pricing-card-values {
  position: absolute;
  right: 30px;
  width: 85px;
}
.pricing-input-container-title {
  color: #8f9bb3;
  font-size: 18px;
  margin: 0px;
}
.pricing-input-section-note {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #7e1419;
  font-size: 13px;
  font-weight: 600;
  font-style: italic;
}
.pricing-input-titles {
  display: flex;
  position: relative;
}
.pricing-input-container-buttons {
  position: absolute;
  right: 0;
  display: flex;
  margin-right: 20px;
}
.add-band-button {
  text-align: right;
  padding-right: 20px;
  color: #43a4e9;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.remove-band-button {
  text-align: right;
  padding-right: 20px;
  color: #d2212a;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  position: absolute;
  right: 0;
}
.card-values-override {
  width: max-content !important;
}
</style>
