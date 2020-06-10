<template>
  <div>
    <div class="pricing-container">
      <p class="daily-rate-title">Daily Rate Pricing</p>
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
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Monthly Rate</p>
              <el-input
                type="text"
                v-model="monthlyRate"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">No of working days per month</p>
              <el-input
                type="text"
                v-model="daysWorked"
                placeholder="Enter days"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
              >
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Daily rate</p>
              <el-input
                :disabled="true"
                type="text"
                v-model="dailyRateValue"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                class="new-pricing-inputs"
              >
                <template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div v-if="timeRangeVisibility">
              <p class="pricing-input-labels">Hours worked</p>
              <div class="new-pricing-tab-rows">
                <div>
                  <p class="pricing-time-input-labels">Between X hours</p>
                  <el-time-picker
                    arrow-control
                    v-model="fromTime"
                    :picker-options="{
                      selectableRange: timeRange,
                    }"
                    placeholder="X hours"
                    class="new-pricing-inputs"
                  >
                  </el-time-picker>
                </div>
                <div>
                  <p class="pricing-time-input-labels">and Y hours</p>
                  <el-time-picker
                    arrow-control
                    v-model="toTime"
                    :picker-options="{
                      selectableRange: timeRange,
                    }"
                    placeholder="Y hours"
                    class="new-pricing-inputs"
                  >
                  </el-time-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Sendy take</p>
              <el-input
                :disabled="true"
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="sendyTake"
                class="new-pricing-inputs"
              >
                <template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Partner take</p>
              <div class="pricing-radio-input-labels">
                <input
                  type="radio"
                  v-model="partnerRate"
                  value="daily rate"
                  id="dailyRate"
                />
                <label for="dailyRate" class="pricing-radio-labels"
                  >Daily Rate
                </label>
                <input
                  type="radio"
                  v-model="partnerRate"
                  value="monthly rate"
                  id="monthlyRate"
                />
                <label for="monthlyRate" class="pricing-radio-labels"
                  >Monthly Rate
                </label>
              </div>
            </div>
            <div>
              <p class="pricing-input-labels">Partner take(Amount)</p>
              <el-input
                type="text"
                placeholder="Enter Amount"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                v-model="partnerTake"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template>
              </el-input>
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
          <p class="pricing-input-section-titles">
            Maximum KM Charges
          </p>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Maximum KM</p>
              <el-input
                type="text"
                v-model="maxDistance"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter distance"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Rate per additional KM</p>
              <el-input
                type="text"
                v-model="ratePerAdditionalKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter amount"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Partner Take per additional KM</p>
              <el-input
                type="text"
                v-model="maxPartnerTakePerAdditionalKm"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="Enter amount"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  {{ currency }}
                </template></el-input
              >
            </div>
          </div>
          <p class="pricing-input-section-note">
            Note: All charges are VAT exclusive
          </p>
        </div>
        <div v-if="mode === 'newPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tableData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">Monthly Rate</div>
            <div class="bands-col-3">Daily Rate</div>
            <div class="bands-col-4">Max distance</div>
            <div class="bands-col-5"></div>
          </div>
          <div
            v-for="(data, index) in tableData"
            :key="index"
            class="bands-body-row"
          >
            <div class="bands-col-1 pricing-table-divider">
              {{ data.vendor }}
            </div>
            <div class="bands-col-2 pricing-table-divider">
              {{ currency }} {{ data.monthly_rate }}
            </div>
            <div class="bands-col-3">{{ currency }} {{ data.daily_rate }}</div>
            <div class="bands-col-4">{{ data.maximum_distance }} KMS</div>
            <div class="bands-col-5">
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
        </div>
        <div v-if="mode === 'allPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tablePricingData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">Monthly Rate</div>
            <div class="bands-col-3">Daily Rate</div>
            <div class="bands-col-4">Max distance</div>
            <div class="bands-col-5"></div>
          </div>
          <div v-for="(data, index) in tablePricingData" :key="index">
            <div class="pricing-body-row" @click="toggleRow(index)">
              <div class="bands-col-1 pricing-table-divider">
                {{ data.name }}
              </div>
              <div class="bands-col-2 pricing-table-divider">
                {{ currency }} {{ data.monthly_rate }}
              </div>
              <div class="bands-col-3 pricing-table-divider">
                {{ currency }} {{ data.daily_rate }}
              </div>
              <div class="bands-col-4">{{ data.maximum_km }} KMS</div>
              <div class="bands-col-5">
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
            <div class="all-pricing-container" v-if="opened.includes(index)">
              <div class="pricing-input-titles">
                <span class="pricing-input-container-title">
                  Pricing
                </span>
                <span
                  class="pricing-input-container-buttons"
                  v-if="
                    data.approved_by ===
                      parseInt(getSessionData.payload.data.admin_id) ||
                      JSON.parse(getSessionData.payload.data.privilege)
                        .modify_price_config
                  "
                >
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
                      Monthly Rate:
                      <span class="all-pricing-card-values"
                        >{{ data.currency }} {{ data.monthly_rate }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      No. of working days:
                      <span class="all-pricing-card-values">{{
                        data.no_of_working_days
                      }}</span>
                    </p>
                    <p class="all-pricing-card-text">
                      Daily Rate:
                      <span class="all-pricing-card-values"
                        >{{ data.currency }} {{ data.daily_rate }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Sendy Take:
                      <span class="all-pricing-card-values"
                        >{{ currency }} {{ data.sendy_take }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Partner Take (Daily):
                      <span class="all-pricing-card-values"
                        >{{ data.currency }} {{ data.partner_daily_rate }}</span
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
                    Minimum & Maximum KM
                  </p>
                  <div class="all-pricing-card">
                    <p class="all-pricing-card-text">
                      Maximum KMs:
                      <span class="all-pricing-card-values"
                        >{{ data.maximum_km }} KMS</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Rate per additonal KM:
                      <span class="all-pricing-card-values">
                        {{ data.currency }}
                        {{ data.rate_per_additional_km }}</span
                      >
                    </p>
                    <p class="all-pricing-card-text">
                      Partner take <br />per additional KM:
                      <span class="all-pricing-card-values"
                        >{{ data.currency }}
                        {{ data.partner_rate_per_additional_km }}</span
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="pricing-row-spacer" v-else />
          </div>
          <div v-if="tablePricingData.length === 0">
            There are no daily rate configs for {{ user.user_details.cop_name }}
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
  name: 'DailyRatePricingComponent',
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
      timeRange: '06:00:00 - 18:00:00',
      fromTime: '',
      toTime: '',
      daysWorked: '',
      preview: false,
      selectedVendor: 'Bike',
      maxDistance: '',
      ratePerAdditionalKm: '',
      maxPartnerTakePerAdditionalKm: '',
      dailyRateValue: '',
      timeRangeVisibility: false,
      monthlyRate: '',
      sendyTake: '',
      partnerTake: '',
      currency: '',
      vendorName: '',
      fuelInclusivity: true,
      partnerRate: 'daily rate',
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
    assignments() {
      const vendor_id = this.vendorTypes.find(op => {
        return op.name === this.selectedVendor;
      });
      const assignments = {
        id: vendor_id.id,
        name: this.selectedVendor,
        currency: this.currency,
        maximum_km: parseInt(this.maxDistance, 10),
        daily_rate: parseInt(this.dailyRateValue, 10),
        no_of_working_days: parseInt(this.daysWorked, 10),
        monthly_rate: parseInt(this.monthlyRate, 10),
        rate_per_additional_km: parseInt(this.ratePerAdditionalKm, 10),
        partner_rate_per_additional_km: parseInt(
          this.maxPartnerTakePerAdditionalKm,
          10,
        ),
        sendy_take: parseInt(this.sendyTake, 10),
        fuel_inclusive: JSON.parse(this.fuelInclusivity),
        partner_price_type: this.partnerRate,
        partner_daily_rate:
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10)
            : parseInt(this.partnerTake, 10) / parseInt(this.daysWorked, 10),
        partner_monthly_rate:
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10)
            : parseInt(this.partnerTake, 10) * parseInt(this.daysWorked, 10),
      };
      return assignments;
    },
    addBandStatus() {
      if (
        this.monthlyRate &&
        this.daysWorked &&
        this.maxDistance &&
        this.sendyTake &&
        this.partnerTake &&
        this.ratePerAdditionalKm &&
        this.maxPartnerTakePerAdditionalKm
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
    dailyRateData() {
      const data = [];
      this.configuredDedicatedPricing.forEach((row, i) => {
        if (row.price_type === 'daily_rate') {
          row.index = i;
          data.push(row);
        }
      });
      return data;
    },
  },
  watch: {
    mode(val) {
      this.editStatus = false;
      this.clearInputs();
      this.opened = [];
      this.editedBandIndex = 0;
    },
    daysWorked(val) {
      if (val && this.monthlyRate) {
        this.dailyRateValue = Math.floor(
          parseInt(this.monthlyRate, 10) / parseInt(this.daysWorked, 10),
        );
      }
      if (val && this.partnerTake && this.monthlyRate) {
        const partnerTakeVal =
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10) * parseInt(this.daysWorked)
            : parseInt(this.partnerTake, 10);
        this.sendyTake = Math.floor(
          parseInt(this.monthlyRate, 10) - partnerTakeVal,
        );
      }
    },
    monthlyRate(val) {
      if (val && this.daysWorked) {
        this.dailyRateValue = Math.floor(
          parseInt(this.monthlyRate, 10) / parseInt(this.daysWorked, 10),
        );
      }
      if (val && this.partnerTake && this.daysWorked) {
        const partnerTakeVal =
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10) * parseInt(this.daysWorked)
            : parseInt(this.partnerTake, 10);
        this.sendyTake = Math.floor(
          parseInt(this.monthlyRate, 10) - partnerTakeVal,
        );
      }
    },
    partnerTake(val) {
      if (val && this.monthlyRate && this.daysWorked) {
        const partnerTakeVal =
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10) * parseInt(this.daysWorked)
            : parseInt(this.partnerTake, 10);
        this.sendyTake = Math.floor(
          parseInt(this.monthlyRate, 10) - partnerTakeVal,
        );
      }
    },
    partnerRate(val) {
      if (val && this.monthlyRate && this.daysWorked) {
        const partnerTakeVal =
          this.partnerRate === 'daily rate'
            ? parseInt(this.partnerTake, 10) * parseInt(this.daysWorked)
            : parseInt(this.partnerTake, 10);
        this.sendyTake = Math.floor(
          parseInt(this.monthlyRate, 10) - partnerTakeVal,
        );
      }
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
    this.tablePricingData = this.dailyRateData;
    this.selectedVendor = this.filterdVendors[0].name;
    this.trackAddPricingDataPage();
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
        maximum_distance: this.maxDistance,
        days_worked: this.daysWorked,
        monthly_rate: this.monthlyRate,
        daily_rate: this.dailyRateValue,
        sendy_take: this.sendyTake,
        fuel_inclusive: this.fuelInclusivity,
        partner_rate: this.partnerRate,
        partner_amount: this.partnerTake,
        rate_per_additional_km: this.ratePerAdditionalKm,
        max_partner_take_per_additional_km: this.maxPartnerTakePerAdditionalKm,
      });
      this.clearInputs();
    },
    clearInputs() {
      this.selectedVendor =
        this.filterdVendors.length > 0 ? this.filterdVendors[0].name : 'Bike';
      this.maxDistance = '';
      this.daysWorked = '';
      this.monthlyRate = '';
      this.dailyRateValue = '';
      this.ratePerAdditionalKm = '';
      this.sendyTake = '';
      this.fuelInclusivity = true;
      this.maxPartnerTakePerAdditionalKm = '';
      this.partnerRate = 'daily rate';
      this.partnerTake = '';
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
      this.maxDistance = this.tableData[i].maximum_distance;
      this.daysWorked = this.tableData[i].days_worked;
      this.monthlyRate = this.tableData[i].monthly_rate;
      this.dailyRateValue = this.tableData[i].daily_rate;
      this.ratePerAdditionalKm = this.tableData[i].rate_per_additional_km;
      this.maxPartnerTakePerAdditionalKm = this.tableData[
        i
      ].max_partner_take_per_additional_km;
      this.sendyTake = this.tableData[i].sendy_take;
      this.fuelInclusivity = this.tableData[i].fuel_inclusive;
      this.partnerRate = this.tableData[i].partner_rate;
      this.partnerTake = this.tableData[i].partner_amount;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveBand() {
      this.tableData[this.editedBandIndex].vendor = this.selectedVendor;
      this.tableData[this.editedBandIndex].currency = this.currency;
      this.tableData[this.editedBandIndex].maximum_distance = this.maxDistance;
      this.tableData[this.editedBandIndex].daily_rate = this.dailyRateValue;
      this.tableData[this.editedBandIndex].days_worked = this.daysWorked;
      this.tableData[this.editedBandIndex].monthly_rate = this.monthlyRate;
      this.tableData[
        this.editedBandIndex
      ].rate_per_additional_km = this.ratePerAdditionalKm;
      this.tableData[
        this.editedBandIndex
      ].max_partner_take_per_additional_km = this.maxPartnerTakePerAdditionalKm;
      this.tableData[this.editedBandIndex].sendy_take = this.sendyTake;
      this.tableData[
        this.editedBandIndex
      ].fuel_inclusive = this.fuelInclusivity;
      this.tableData[this.editedBandIndex].partner_rate = this.partnerRate;
      this.tableData[this.editedBandIndex].partner_amount = this.partnerTake;
      this.editStatus = false;
      this.editedBandIndex = 0;
      this.clearInputs();
    },
    editAllPricing(i) {
      this.selectedVendor = this.tablePricingData[i].name;
      this.currency = this.tablePricingData[i].currency;
      this.maxDistance = this.tablePricingData[i].maximum_km;
      this.daysWorked = this.tablePricingData[i].no_of_working_days;
      this.dailyRateValue = this.tablePricingData[i].daily_rate;
      this.monthlyRate = this.tablePricingData[i].monthly_rate;
      this.ratePerAdditionalKm = this.tablePricingData[
        i
      ].rate_per_additional_km;
      this.maxPartnerTakePerAdditionalKm = this.tablePricingData[
        i
      ].partner_rate_per_additional_km;
      this.sendyTake = this.tablePricingData[i].sendy_take;
      this.fuelInclusivity = this.tablePricingData[i].fuel_inclusive;
      this.partnerRate = this.tablePricingData[i].partner_price_type;
      this.partnerTake =
        this.tablePricingData[i].partner_price_type === 'daily rate'
          ? this.tablePricingData[i].partner_daily_rate
          : this.tablePricingData[i].partner_monthly_rate;
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
      this.tablePricingData = this.dailyRateData;
      this.selectedVendor = this.filterdVendors[0].name;
      this.showDialogue = false;
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
        const partnerMonthlyRate =
          row.partner_rate === 'daily rate'
            ? parseInt(row.partner_amount, 10) * parseInt(row.days_worked, 10)
            : parseInt(row.partner_amount, 10);
        const partnerDailyRate =
          row.partner_rate === 'monthly rate'
            ? parseInt(row.partner_amount, 10) / parseInt(row.days_worked, 10)
            : parseInt(row.partner_amount, 10);
        const payloadData = {
          id: vendor_id.id,
          name: row.vendor,
          currency: row.currency,
          price_type: 'daily_rate',
          daily_rate: parseInt(row.daily_rate, 10),
          sendy_take: parseInt(row.sendy_take, 10),
          monthly_rate: parseInt(row.monthly_rate, 10),
          maximum_km: parseInt(row.maximum_distance, 10),
          rate_per_additional_km: parseInt(row.rate_per_additional_km, 10),
          partner_rate_per_additional_km: parseInt(
            row.max_partner_take_per_additional_km,
            10,
          ),
          fuel_inclusive: JSON.parse(row.fuel_inclusive),
          partner_price_type: row.partner_rate,
          partner_monthly_rate: Math.floor(partnerMonthlyRate),
          partner_daily_rate: Math.floor(partnerDailyRate),
          no_of_working_days: parseInt(row.days_worked, 10),
          created_by: parseInt(this.getSessionData.payload.data.admin_id),
          approved_by: this.admin.admin_id,
          date_approved: '',
          date_created: moment().format('YYYY-MM-DD HH:mm:ss'),
          status: 'Pending',
        };
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
        endpoint: 'price_config/add_daily_rate_pricing',
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
        endpoint: 'price_config/update_daily_rate_pricing',
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
      mixpanel.track('Add Daily rate Pricing data Page - PageView', {
        type: 'PageView',
      });
    },
    trackSaveAndPreview() {
      mixpanel.track(
        'Save and Preview Daily rate Pricing button - ButtonClick',
        {
          type: 'Click',
        },
      );
    },
    trackPricingSubmitPage() {
      mixpanel.track('Submit Daily rate pricing for approval Page - PageView', {
        type: 'PageView',
      });
    },
    trackPricingSubmit() {
      mixpanel.track('"Submit Request" Button - ButtonClick', {
        type: 'Click',
      });
    },
    trackPassedSubmission() {
      mixpanel.track('Daily rate pricing saved - Success', {
        type: 'Success',
      });
    },
    trackFailedSubmission() {
      mixpanel.track('Daily rate pricing not saved - Fail', {
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
  color: #f28226;
  font-size: 14px;
  font-weight: 600;
}
.pricing-input-section-subtitles {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #1871ac;
  font-size: 12px;
  font-weight: 600;
}
.pricing-input-section-note {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #7e1419;
  font-size: 13px;
  font-weight: 600;
  font-style: italic;
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
.bands-col-2,
.bands-col-3,
.bands-col-4 {
  width: 20%;
  padding-left: 15px;
  height: 50px;
  display: flex;
  align-items: center;
}
.bands-col-5 {
  width: 20%;
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
  right: 10px;
  width: 85px;
}
.pricing-input-container-title {
  color: #8f9bb3;
  font-size: 18px;
  margin: 0px;
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
</style>
