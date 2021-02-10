<template>
  <div>
    <div class="pricing-container">
      <p class="daily-rate-title">Distance Pricing</p>
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
              <p class="pricing-input-labels">City</p>
              <template>
                <el-popover
                  placement="bottom"
                  width="Min width 150px"
                  v-model="visible"
                >
                  <div>
                    <div
                      class="single-suggestion"
                      v-for="suggestion in suggestions"
                      :key="suggestion.id"
                      @click="handleSelect(suggestion.description)"
                    >
                      {{ suggestion.description }}
                    </div>
                  </div>
                  <el-input
                    slot="reference"
                    size="large"
                    class="new-pricing-inputs"
                    placeholder="Search city"
                    v-model="city"
                    @focus="handleFocus($event.target.value)"
                  ></el-input>
                </el-popover>
              </template>
            </div>
            <div>
              <p class="pricing-input-labels">Vendor type</p>
              <template>
                <el-select
                  v-model="selectedVendor"
                  placeholder="Select Vendor"
                  size="large"
                  class="new-pricing-inputs"
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
                    :disabled="!secondaryCurrency || mode === 'allPricing'"
                  >
                    <el-option
                      :label="defaultCurrency"
                      :value="defaultCurrency"
                    >
                    </el-option>
                    <el-option
                      v-if="secondaryCurrency"
                      :label="secondaryCurrency"
                      :value="secondaryCurrency"
                    >
                    </el-option>
                  </el-select>
                </template>
              </div>
            </div>
          </div>
          <p class="pricing-input-section-titles">
            Base charges
          </p>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Base Fee</p>
              <el-input
                type="text"
                v-model="baseFee"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter amount"
                class="new-pricing-inputs"
                @input="calculateClientFee()"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Base KM</p>
              <el-input
                type="text"
                v-model="baseKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter KM"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template></el-input
              >
            </div>
          </div>
          <p class="pricing-input-section-titles">
            Additional charges
          </p>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Price per additional km</p>
              <el-input
                type="text"
                v-model="pricePerKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Waiting fee per hour</p>
              <el-input
                type="text"
                v-model="waitingFeePerHour"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Loading fee (per loader)</p>
              <el-input
                type="text"
                v-model="loadingFee"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Service charge</p>
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="serviceCharge"
                class="new-pricing-inputs"
                @input="calculateClientFee()"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Insurance fee</p>
              <el-input
                :disabled="true"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="insuranceFee"
                class="new-pricing-inputs"
                @input="calculateClientFee()"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Cancellation fee</p>
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="cancellationFee"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Sendy commission</p>
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="sendyCommission"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  %
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Price per additional dropoff</p>
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="pricePerAdditionalDropOff"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Client fee</p>
              <el-input
                :disabled="true"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="clientFee"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div v-if="mode === 'allPricing' && !editStatus">
          <div class="currency-selector">
            <div
              v-for="(currencies, i) in userCurrencies"
              :key="`${i}${currencies}`"
              class="currency-buttons"
              @click="activeCurrency = currencies"
              :class="activeCurrency === currencies ? 'active-currency' : ''"
            >
              {{ currencies }}
            </div>
          </div>
          <div class="bands-heading-row" v-if="filteredCurrencies.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">City</div>
            <div class="bands-col-3"></div>
          </div>
          <div v-for="(data, index) in filteredCurrencies" :key="index">
            <div class="pricing-body-row" @click="toggleRow(index)">
              <div class="bands-col-1 pricing-table-divider">
                {{ data.name }}
              </div>
              <div class="bands-col-2">
                {{ data.city }}
              </div>
              <div class="bands-col-3">
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
                <span class="" v-if="opened.includes(index)">
                  <i class="fa fa-chevron-circle-up all-pricing-arrow"></i>
                </span>
                <span class="" v-if="!opened.includes(index)">
                  <i class="fa fa-chevron-circle-down all-pricing-arrow"></i>
                </span>
              </div>
            </div>
            <div
              class="all-pricing-container pricing-row-spacer"
              v-if="opened.includes(index)"
            >
              <div
                class="all-pricing-dropdown-buttons"
                v-if="
                  getCustomPricingDetails[index].admin_id ===
                    parseInt(getSessionData.payload.data.admin_id) ||
                    JSON.parse(getSessionData.payload.data.privilege)
                      .modify_price_config
                "
              >
                <div
                  class="all-pricing-edit"
                  @click="editAllPricing(data.table_index)"
                >
                  edit
                </div>
                <div
                  v-if="data.status === 'Active'"
                  class="all-pricing-delete"
                  @click="
                    showDeleteDialogue(
                      'tablePricingData',
                      data.table_index,
                      data.name,
                    )
                  "
                >
                  delete
                </div>
              </div>
              <div class="all-pricing-details">
                <div class="all-pricing-column-left">
                  <p class="all-pricing-column-title">Base Charges</p>
                  <div>
                    <p class="all-pricing-column-label">Base Fee</p>
                    <p class="all-pricing-column-value">
                      {{ data.currency }} {{ data.base_cost }}
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Base Distance</p>
                    <p class="all-pricing-column-value">
                      {{ data.base_km }} KMS
                    </p>
                  </div>
                </div>
                <div class="all-pricing-column-right">
                  <p class="all-pricing-column-title">Additional Charges</p>
                  <div class="all-pricing-column-container">
                    <div class="all-pricing-column-divided">
                      <div>
                        <p class="all-pricing-column-label">
                          Price per addiional Km
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }}
                          {{ data.cost_per_km_above_base_km }}
                        </p>
                      </div>
                      <div>
                        <p class="all-pricing-column-label">
                          Waiting Fee per hour
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }}
                          {{ parseFloat(data.waiting_time_cost_per_min) }}
                        </p>
                      </div>
                      <div>
                        <p class="all-pricing-column-label">
                          Loading fee (per loader)
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }}
                          {{ data.loader_cost ? data.loader_cost : 0 }}
                        </p>
                      </div>
                      <div>
                        <p class="all-pricing-column-label">
                          Service Charge
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }} {{ data.service_fee }}
                        </p>
                      </div>
                    </div>
                    <div class="all-pricing-column-divided">
                      <div>
                        <p class="all-pricing-column-label">
                          Sendy commission
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.sendy_commission }}%
                        </p>
                      </div>
                      <div>
                        <p class="all-pricing-column-label">
                          Price per additional dropoff
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }}
                          {{ data.additional_location_cost }}
                        </p>
                      </div>
                      <div>
                        <p class="all-pricing-column-label">
                          Cancellation Fee
                        </p>
                        <p class="all-pricing-column-value">
                          {{ data.currency }} {{ data.cancellation_fee }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pricing-row-spacer" v-else />
          </div>
          <div v-if="filteredCurrencies.length === 0" class="no-configs-label">
            There are no {{ activeCurrency }} distance configs for
            {{ user.user_details.cop_name }}
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
            v-if="editStatus"
            class="edit-pricing-cancel-button new-pricing-input-buttons"
            @click="cancelEdit()"
          >
            cancel
          </button>
          <button
            v-if="editStatus"
            class="new-pricing-input-buttons"
            :class="
              saveBandStatus
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
              saveBandStatus && approver !== ''
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
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { Client } from '@googlemaps/google-maps-services-js';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';
import SessionMxn from '@/mixins/session_mixin';

export default {
  name: 'DistancePricingComponent',
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
      visible: false,
      searched: false,
      mode: 'newPricing',
      showDialogue: false,
      admin_list: [],
      suggestions: [],
      activeCurrency: '',
      city: '',
      approver: 0,
      approverMail: '',
      approverSelect: false,
      selectedVendor: 'Bike',
      baseKm: '',
      baseFee: '',
      pricePerKm: '',
      waitingFeePerHour: '',
      loadingFee: '',
      serviceCharge: '',
      insuranceFee: '',
      cancellationFee: '',
      sendyCommission: '',
      pricePerAdditionalDropOff: '',
      clientFee: '',
      currency: '',
      defaultCurrency: '',
      secondaryCurrency: '',
      editStatus: false,
      editedBandIndex: 0,
      deleteBand: {
        index: 0,
        vendor: 'Bike',
        table: 'tableData',
      },
      vendorTypes: [],
      opened: [],
      tablePricingData: [],
      service: '',
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      section: 'getSectionView',
      getSessionData: 'getSession',
      getTableData: 'getTableData',
      configuredDistancePricing: 'getConfiguredDistancePricing',
      configuredLocationPricing: 'getConfiguredLocationPricing',
      getCustomPricingDetails: 'getCustomPricingDetails',
    }),
    herokuKey() {
      return this.$env.HEROKU_GOOGLE_API_KEY;
    },
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.selectedVendor;
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
    assignments() {
      const assignments = {
        city: this.city,
        name: this.selectedVendor,
        currency: this.currency,
        base_cost: parseInt(this.baseFee, 10),
        base_km: parseInt(this.baseKm, 10),
        cost_per_km_above_base_km: parseInt(this.pricePerKm, 10),
        waiting_time_cost_per_min: this.waitingFeePerHour,
        loader_cost: parseInt(this.loadingFee, 10),
        service_fee: parseInt(this.serviceCharge, 10),
        insurance: parseInt(this.insuranceFee, 10),
        cancellation_fee: parseInt(this.cancellationFee, 10),
        sendy_commission: parseInt(this.sendyCommission, 10),
        additional_location_cost: parseInt(this.pricePerAdditionalDropOff, 10),
      };
      return assignments;
    },
    saveBandStatus() {
      if (
        this.city &&
        this.currency &&
        this.selectedVendor &&
        this.currency &&
        (this.baseFee || this.baseFee === 0) &&
        (this.baseKm || this.baseKm === 0) &&
        (this.pricePerKm || this.pricePerKm === 0) &&
        (this.waitingFeePerHour || this.waitingFeePerHour === 0) &&
        (this.loadingFee || this.loadingFee === 0) &&
        (this.serviceCharge || this.serviceCharge === 0) &&
        (this.insuranceFee || this.insuranceFee === 0) &&
        (this.serviceCharge || this.serviceCharge === 0) &&
        (this.sendyCommission || this.sendyCommission === 0) &&
        (this.pricePerAdditionalDropOff ||
          this.pricePerAdditionalDropOff === 0) &&
        (this.clientFee || this.clientFee === 0)
      ) {
        return true;
      }
      return false;
    },
    userCurrencies() {
      const currencies = [];
      this.tablePricingData.forEach(row => {
        if (!currencies.includes(row.currency)) {
          currencies.push(row.currency);
        }
      });
      return currencies;
    },
    filteredCurrencies() {
      const filtered = [];
      this.tablePricingData.forEach((row, i) => {
        if (row.currency === this.activeCurrency) {
          row.table_index = i;
          filtered.push(row);
        }
      });
      return filtered;
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
    city(val) {
      if (val && val.length > 2 && !this.searched) {
        this.search(val);
      }
    },
    selectedVendor(val) {
      if (this.vendor.insurance) {
        this.insuranceFee =
          this.baseKm < this.vendor.insurance.max_distance_km
            ? this.vendor.insurance.max_distance_cost
            : this.vendor.insurance.above_max_distance_cost;
      } else {
        this.insuranceFee = 0;
      }
    },
    baseKm(val) {
      if (this.vendor.insurance) {
        this.insuranceFee =
          this.baseKm < this.vendor.insurance.max_distance_km
            ? this.vendor.insurance.max_distance_cost
            : this.vendor.insurance.above_max_distance_cost;
      } else {
        this.insuranceFee = 0;
      }
    },
    activeCurrency(val) {
      this.opened = [];
    },
    currency(val) {
      this.triggerInsuranceCurrencyCheck(val);
    },
  },
  async mounted() {
    this.loadMapScript();
    await this.setAdmins();
    this.currency = this.user.user_details.default_currency;
    this.defaultCurrency = this.user.user_details.default_currency;
    this.secondaryCurrency = this.user.user_details.secondary_currency;
    const countryCode = this.user.user_details.country_code;
    await this.fetchVendorTypes(this.defaultCurrency);
    this.trackAddPricingDataPage();
    this.tablePricingData = this.configuredDistancePricing;
    if (this.userCurrencies.length > 0) {
      this.activeCurrency =
        this.defaultCurrency in this.userCurrencies
          ? this.defaultCurrency
          : this.userCurrencies[0];
    } else {
      this.userCurrencies.push(this.defaultCurrency);
      this.activeCurrency = this.defaultCurrency;
    }
  },
  methods: {
    ...mapMutations({
      updatePricing: 'updatePricing',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSection: 'setSectionView',
      modifyCustomPricingDetails: 'modifyCustomPricingDetails',
    }),
    ...mapActions({
      submit_custom_pricing: 'submit_custom_pricing',
      setAdmins: 'setAdmins',
      deactivate_distance_pricing_configs:
        'deactivate_distance_pricing_configs',
    }),
    loadMapScript() {
      if (window.google && window.google.maps) {
        setTimeout(() => {
          this.initMap();
        }, 180);
      } else {
        const script = document.createElement('script');
        script.onload = () => {
          this.initMap();
        };
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.herokuKey}`;
        document.head.appendChild(script);
      }
    },
    initMap() {
      this.service = new window.google.maps.places.AutocompleteService();
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.suggestions = [];
        this.visible = false;
        return;
      }
      this.suggestions = predictions;
      this.visible = true;
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      this.service.getPlacePredictions(
        {
          input: val,
          types: ['(cities)'],
        },
        this.displaySuggestions,
      );
    }, 500),
    async triggerInsuranceCurrencyCheck(val) {
      await this.fetchVendorTypes(val);
      if (this.vendor.insurance) {
        this.insuranceFee =
          this.baseKm < this.vendor.insurance.max_distance_km
            ? this.vendor.insurance.max_distance_cost
            : this.vendor.insurance.above_max_distance_cost;
      } else {
        this.insuranceFee = 0;
      }
    },
    calculateClientFee() {
      const orderAmount =
        parseInt(this.baseFee ? this.baseFee : 0, 10) +
        parseInt(this.serviceCharge ? this.serviceCharge : 0, 10) +
        parseInt(this.insuranceFee ? this.insuranceFee : 0, 10);
      this.clientFee = orderAmount;
    },
    handleSelect(item) {
      this.searched = true;
      this.city = item;
      this.visible = false;
      this.suggestions = [];
    },
    handleFocus(val) {
      this.searched = false;
      if (val) {
        this.search(val);
      }
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
    clearInputs() {
      this.city = '';
      this.selectedVendor = 'Bike';
      this.baseFee = '';
      this.baseKm = '';
      this.pricePerKm = '';
      this.waitingFeePerHour = '';
      this.loadingFee = '';
      this.serviceCharge = '';
      this.insuranceFee = '';
      this.cancellationFee = '';
      this.sendyCommission = '';
      this.pricePerAdditionalDropOff = '';
      this.clientFee = '';
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
    deleteSingleBand() {
      this.opened = [];
      this.modifySinglePriceConfig(
        this.tablePricingData[this.deleteBand.index],
        this.deleteBand.index,
        'delete',
      );
    },
    editAllPricing(i) {
      this.city = this.tablePricingData[i].city;
      this.selectedVendor = this.tablePricingData[i].name;
      this.currency = this.tablePricingData[i].currency;
      this.baseFee = this.tablePricingData[i].base_cost;
      this.baseKm = this.tablePricingData[i].base_km;
      this.pricePerKm = this.tablePricingData[i].cost_per_km_above_base_km;
      this.waitingFeePerHour = parseFloat(
        this.tablePricingData[i].waiting_time_cost_per_min,
      );
      this.loadingFee = this.tablePricingData[i].loader_cost
        ? this.tablePricingData[i].loader_cost
        : 0;
      this.serviceCharge = this.tablePricingData[i].service_fee;
      this.insuranceFee = this.tablePricingData[i].insurance;
      this.cancellationFee = this.tablePricingData[i].cancellation_fee;
      this.sendyCommission = this.tablePricingData[i].sendy_commission;
      this.pricePerAdditionalDropOff = this.tablePricingData[
        i
      ].additional_location_cost;
      this.clientFee =
        (this.tablePricingData[i].insurance
          ? this.tablePricingData[i].insurance
          : 0) +
        this.tablePricingData[i].service_fee +
        this.tablePricingData[i].base_cost;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveAllPricing() {
      Object.keys(this.assignments).forEach((row, i) => {
        this.modifyCustomPricingDetails({
          index: this.editedBandIndex,
          field: row,
          model: 'distance_pricing',
          value: Object.values(this.assignments)[i],
        });
      });
      this.modifySinglePriceConfig(
        this.tablePricingData[this.editedBandIndex],
        this.editedBandIndex,
        'edit',
      );
      this.editedBandIndex = 0;
      this.editStatus = false;
      this.clearInputs();
    },
    async modifySinglePriceConfig(row, index, action) {
      this.trackRemoveSingleConfigs();
      const clone = JSON.parse(JSON.stringify(this.getCustomPricingDetails));
      clone[index].distance_pricing.waiting_time_cost_per_min =
        parseFloat(clone[index].distance_pricing.waiting_time_cost_per_min) /
        60;
      const distancePricingTable = [clone[index]];
      const approvalParams = this.createPayload(distancePricingTable, action);
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/update_custom_distance_details',
        apiKey: false,
        params: approvalParams,
      };
      try {
        const data = await this.deactivate_distance_pricing_configs(payload);
        this.trackMixpanelIdentify();
        this.trackMixpanelPeople();
        this.fetchData();
        if (data.status) {
          this.trackResetConfigsSuccess();
          if (action === 'delete') {
            notification.push('Custom price configs deactivated successfully.');
            actionClass = this.display_order_action_notification(data.status);
            await this.logAction('Deactivate Distance pricing config', 36);
          } else {
            notification.push('Custom price configs edited successfully.');
            actionClass = this.display_order_action_notification(data.status);
            await this.logAction('Edit Distance pricing config', 36);
          }
        } else {
          this.trackResetConfigsFail();
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
          this.showDialogue = false;
        }
      } catch (error) {
        this.fetchData();
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
        this.showDialogue = false;
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
      setTimeout(() => {
        this.updateErrors([]);
      }, 5000);
    },
    async fetchData() {
      await this.fetchCustomDistancePricingData();
      this.tablePricingData = this.configuredDistancePricing;
      this.showDialogue = false;
    },
    createPayload(pricingApprovalData, action) {
      const distancePricingArray = [];
      for (let i = 0; i < pricingApprovalData.length; i += 1) {
        const distancePricingObject = {
          cop_id: this.copId,
          vendor_id: pricingApprovalData[i].id,
          custom_pricing_details: {
            id: pricingApprovalData[i].id,
            name: pricingApprovalData[i].name,
            currency: pricingApprovalData[i].currency,
            admin_id: pricingApprovalData[i].admin_id,
            distance_pricing: pricingApprovalData[i].distance_pricing,
          },
        };
        if (action === 'delete') {
          distancePricingObject.custom_pricing_details.distance_pricing.status =
            'Deactivated';
        }
        distancePricingArray.push(distancePricingObject);
      }
      return distancePricingArray;
    },
    createSumbitPayload() {
      const payload = [
        {
          cop_id: this.copId,
          cop_name: this.copName,
          custom_pricing_details: {
            id: this.vendor.id,
            name: this.vendor.name,
            currency: this.currency,
            admin_id: this.approver,
            distance_pricing: {
              status: 'Pending',
              name: this.vendor.name,
              base_km: parseInt(this.baseKm, 10),
              base_cost: parseInt(this.baseFee, 10),
              insurance: parseInt(this.insuranceFee, 10),
              cancellation_fee: parseInt(this.cancellationFee, 10),
              city: this.city,
              fixed_cost: this.vendor.id === 20 ? 1 : 0,
              loader_cost: parseInt(this.loadingFee, 10),
              cost_per_km_above_base_km: parseInt(this.pricePerKm, 10),
              additional_location_cost: parseInt(
                this.pricePerAdditionalDropOff,
                10,
              ),
              sendy_commission: parseInt(this.sendyCommission, 10),
              service_fee: parseInt(this.serviceCharge, 10),
              waiting_time_cost_per_min: parseFloat(
                this.waitingFeePerHour / 60,
              ),
            },
          },
        },
      ];
      return payload;
    },
    async submitConfigs() {
      this.trackPricingSubmit();
      const configParams = this.createSumbitPayload();
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/add_custom_distance_details',
        apiKey: false,
        params: configParams,
      };
      try {
        const data = await this.submit_custom_pricing(payload);
        if (data.status) {
          this.fetchData();
          this.clearInputs();
          this.trackPassedSubmission();
          this.trackMixpanelIdentify();
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
          await this.logAction('Add Distance pricing config', 36);
        } else {
          this.trackFailedSubmission();
          this.trackMixpanelIdentify();
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
      setTimeout(() => {
        this.updateErrors([]);
      }, 5000);
      this.trackMixpanelPeople();
    },
    submitNotification() {
      this.$emit('configSubmitted');
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
    trackPricingSubmitPage() {
      mixpanel.track('Submit distance pricing for approval Page - PageView', {
        type: 'PageView',
      });
    },
    trackPricingSubmit() {
      mixpanel.track('"Submit Request" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedSubmission() {
      mixpanel.track('Distance pricing saved - Success', {
        type: 'Success',
      });
    },
    trackFailedSubmission() {
      mixpanel.track('Distance pricing not saved - Fail', {
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
  margin-bottom: 20px;
}
.pricing-input-labels {
  margin: 5px;
}
.pricing-input-section-titles {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #1e7d11;
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
.pricing-monthly-rate-inputs {
  margin-top: 18px;
}
.pricing-radio-labels {
  margin: 10px 20px 5px 5px;
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
.bands-col-2 {
  width: 25%;
  padding-left: 15px;
  min-height: 50px;
  display: flex;
  align-items: center;
}
.bands-col-3 {
  width: 50%;
  justify-content: flex-end;
  display: flex;
  padding-right: 5%;
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
  padding: 2% 5% 5% 5%;
  background: rgba(191, 209, 227, 0.18);
  border-top: 1px solid #80808040;
  border-radius: 5px;
}
.all-pricing-details {
  display: flex;
}
.all-pricing-column-left {
  width: 35%;
}
.all-pricing-column-right {
  width: 65%;
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
  color: #43b634;
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
.single-suggestion {
  cursor: pointer;
  height: 25px;
  padding-right: 15px;
}
.status-tag {
  margin: 0px 15px 0px 0px !important;
}
.all-pricing-column-title {
  color: #0e4266;
  font-size: 15px;
  font-weight: 700;
}
.all-pricing-column-container {
  display: flex;
}
.all-pricing-column-divided {
  padding: 0px 25px 0 0px;
}
.currency-selector {
  display: flex;
  height: 40px;
  align-items: flex-end;
  border-bottom: 1px solid #ebebeb;
}
.currency-buttons {
  width: 100px;
  text-align: center;
  color: #8f9bb3;
  cursor: pointer;
  padding-bottom: 10px;
}
.active-currency {
  border-bottom: 3px solid #1b7fc3;
}
.no-configs-label {
  margin: 20px 0px 10px 0px;
}
</style>
