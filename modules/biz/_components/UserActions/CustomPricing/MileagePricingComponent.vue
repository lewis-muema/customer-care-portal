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
                    disabled
                  >
                    <el-option :label="currency" :value="currency"> </el-option>
                  </el-select>
                </template>
              </div>
            </div>
          </div>
          <p class="pricing-input-section-titles">
            KM Bands
          </p>
          <div class="new-pricing-tab-rows">
            <div>
              <p class="pricing-input-labels">Minimum distance (KM)</p>
              <el-input
                type="text"
                v-model="minDistance"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="< 40"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template></el-input
              >
            </div>
            <div>
              <p class="pricing-input-labels">Cost</p>
              <el-input
                type="text"
                v-model="cost"
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
              <p class="pricing-input-labels">Enter KM range</p>
              <div class="new-pricing-tab-rows">
                <div>
                  <p class="pricing-time-input-labels">Between</p>
                  <el-input
                    type="text"
                    v-model="lowerLimitKm"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                    placeholder="Between X km"
                    class="new-pricing-inputs"
                  >
                    <template class="pricing-prepend" slot="append">
                      KMS
                    </template>
                  </el-input>
                </div>
                <div>
                  <p class="pricing-time-input-labels">and</p>
                  <el-input
                    type="text"
                    v-model="upperLimitKm"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                    placeholder="and Y km"
                    class="new-pricing-inputs"
                  >
                    <template class="pricing-prepend" slot="append">
                      KMS
                    </template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="pricing-monthly-rate-inputs">
              <p class="pricing-input-labels">Cost per KM</p>
              <el-input
                type="text"
                v-model="costPerKm"
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
              <p class="pricing-input-labels">Sendy take</p>
              <el-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                placeholder="% commission"
                v-model="sendyTake"
                class="new-pricing-inputs"
                ><template class="pricing-prepend" slot="append">
                  %
                </template>
              </el-input>
            </div>
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
            Partner Take
          </p>
          <div>
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
              value="Rate per KM"
              id="ratePerKm"
            />
            <label for="ratePerKm" class="pricing-radio-labels"
              >Rate per KM
            </label>
          </div>
          <div class="new-pricing-tab-rows">
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
        <div v-if="mode === 'newPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tableData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">Minimum Distance</div>
            <div class="bands-col-3">KM Band</div>
            <div class="bands-col-4"></div>
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
              {{ data.minimum_distance }} KMS
            </div>
            <div class="bands-col-3">
              {{ data.lower_limit_km }}KM - {{ data.upper_limit_km }}KM
            </div>
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
        </div>
        <div v-if="mode === 'allPricing' && !editStatus">
          <div class="bands-heading-row" v-if="tablePricingData.length > 0">
            <div class="bands-col-1">Vendor Type</div>
            <div class="bands-col-2">Minimum Distance</div>
            <div class="bands-col-3">KM Band</div>
            <div class="bands-col-4"></div>
          </div>
          <div v-for="(data, index) in tablePricingData" :key="index">
            <div class="pricing-body-row" @click="toggleRow(index)">
              <div class="bands-col-1 pricing-table-divider">
                {{ data.vendor }}
              </div>
              <div class="bands-col-2 pricing-table-divider">
                {{ data.minimum_distance }} KMS
              </div>
              <div class="bands-col-3">
                {{ data.lower_limit_km }}KM - {{ data.upper_limit_km }}KM
              </div>
              <div class="bands-col-4">
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
              <div class="all-pricing-dropdown-buttons">
                <div class="all-pricing-edit" @click="editAllPricing(index)">
                  edit
                </div>
                <div
                  class="all-pricing-delete"
                  @click="
                    showDeleteDialogue('tablePricingData', index, data.vendor)
                  "
                >
                  delete
                </div>
              </div>
              <div class="all-pricing-details">
                <div class="all-pricing-column">
                  <div>
                    <p class="all-pricing-column-label">Vendor Type</p>
                    <p class="all-pricing-column-value">{{ data.vendor }}</p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Sendy Commission</p>
                    <p class="all-pricing-column-value">
                      {{ data.sendy_take }} %
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Fuel Cost</p>
                    <p class="all-pricing-column-value">
                      {{ data.fuelInclusivity ? 'Inclusive' : 'Non Inclusive' }}
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Partner Rate</p>
                    <p class="all-pricing-column-value">
                      {{ currency }} {{ data.partner_amount }}
                      {{
                        data.partner_rate === 'daily rate'
                          ? 'per day'
                          : 'per km'
                      }}
                    </p>
                  </div>
                </div>
                <div class="all-pricing-column">
                  <div>
                    <p class="all-pricing-column-label">Minimum Distance</p>
                    <p class="all-pricing-column-value">
                      {{ data.minimum_distance }} KMS
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Cost</p>
                    <p class="all-pricing-column-value">
                      {{ currency }} {{ data.cost }}
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Distance Band</p>
                    <p class="all-pricing-column-value">
                      {{ data.lower_limit_km }}KM - {{ data.upper_limit_km }}KM
                    </p>
                  </div>
                  <div>
                    <p class="all-pricing-column-label">Cost per KM</p>
                    <p class="all-pricing-column-value">
                      {{ data.cost_per_km }} {{ currency }}
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
            Add band
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
      mode: 'newPricing',
      showDialogue: false,
      admin_list: [],
      approver: 0,
      approverMail: '',
      approverSelect: false,
      lowerLimitKm: '',
      upperLimitKm: '',
      preview: false,
      selectedVendor: 'Bike',
      minDistance: '',
      cost: '',
      costPerKm: '',
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
      tablePricingData: [
        {
          vendor: 'Bike',
          currency: 'KES',
          minimum_distance: '20',
          cost: '20',
          cost_per_km: '20',
          lower_limit_km: '20',
          upper_limit_km: '30',
          sendy_take: '20',
          fuel_inclusivity: true,
          partner_rate: 'daily rate',
          partner_amount: '20',
        },
        {
          vendor: 'Bike',
          currency: 'KES',
          minimum_distance: '30',
          cost: '30',
          cost_per_km: '30',
          lower_limit_km: '40',
          upper_limit_km: '50',
          sendy_take: '30',
          fuel_inclusivity: 'false',
          partner_rate: 'Rate per KM',
          partner_amount: '30',
        },
        {
          vendor: 'Bike',
          currency: 'KES',
          minimum_distance: '40',
          cost: '40',
          cost_per_km: '40',
          lower_limit_km: '60',
          upper_limit_km: '70',
          sendy_take: '40',
          fuel_inclusivity: 'false',
          partner_rate: 'daily rate',
          partner_amount: '40',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getAdmins: 'getAdmins',
      section: 'getSectionView',
      getSessionData: 'getSession',
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
    addBandStatus() {
      if (
        this.minDistance &&
        this.cost &&
        this.costPerKm &&
        this.lowerLimitKm &&
        this.upperLimitKm &&
        this.sendyTake &&
        this.partnerTake
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
  },
  methods: {
    ...mapMutations({
      updatePricing: 'updatePricing',
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSection: 'setSectionView',
    }),
    ...mapActions({
      submit_custom_pricing: 'submit_custom_pricing',
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
        minimum_distance: this.minDistance,
        cost: this.cost,
        cost_per_km: this.costPerKm,
        lower_limit_km: this.lowerLimitKm,
        upper_limit_km: this.upperLimitKm,
        sendy_take: this.sendyTake,
        fuel_inclusivity: this.fuelInclusivity,
        partner_rate: this.partnerRate,
        partner_amount: this.partnerTake,
      });
      this.clearInputs();
    },
    clearInputs() {
      this.selectedVendor = 'Bike';
      this.minDistance = '';
      this.cost = '';
      this.costPerKm = '';
      this.lowerLimitKm = '';
      this.upperLimitKm = '';
      this.sendyTake = '';
      this.fuelInclusivity = true;
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
    deleteSingleBand() {
      this.opened = [];
      if (this.deleteBand.table === 'tableData') {
        this.tableData.splice(this.deleteBand.index, 1);
      } else {
        this.tablePricingData.splice(this.deleteBand.index, 1);
      }
      this.showDialogue = false;
    },
    editBand(i) {
      this.selectedVendor = this.tableData[i].vendor;
      this.currency = this.tableData[i].currency;
      this.minDistance = this.tableData[i].minimum_distance;
      this.cost = this.tableData[i].cost;
      this.costPerKm = this.tableData[i].cost_per_km;
      this.lowerLimitKm = this.tableData[i].lower_limit_km;
      this.upperLimitKm = this.tableData[i].upper_limit_km;
      this.sendyTake = this.tableData[i].sendy_take;
      this.fuelInclusivity = this.tableData[i].fuel_inclusivity;
      this.partnerRate = this.tableData[i].partner_rate;
      this.partnerTake = this.tableData[i].partner_amount;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveBand() {
      this.tableData[this.editedBandIndex].vendor = this.selectedVendor;
      this.tableData[this.editedBandIndex].currency = this.currency;
      this.tableData[this.editedBandIndex].minimum_distance = this.minDistance;
      this.tableData[this.editedBandIndex].cost = this.cost;
      this.tableData[this.editedBandIndex].cost_per_km = this.costPerKm;
      this.tableData[this.editedBandIndex].lower_limit_km = this.lowerLimitKm;
      this.tableData[this.editedBandIndex].upper_limit_km = this.upperLimitKm;
      this.tableData[this.editedBandIndex].sendy_take = this.sendyTake;
      this.tableData[
        this.editedBandIndex
      ].fuel_inclusivity = this.fuelInclusivity;
      this.tableData[this.editedBandIndex].partner_rate = this.partnerRate;
      this.tableData[this.editedBandIndex].partner_amount = this.partnerTake;
      this.editStatus = false;
      this.editedBandIndex = 0;
      this.clearInputs();
    },
    editAllPricing(i) {
      this.selectedVendor = this.tablePricingData[i].vendor;
      this.currency = this.tablePricingData[i].currency;
      this.minDistance = this.tablePricingData[i].minimum_distance;
      this.cost = this.tablePricingData[i].cost;
      this.costPerKm = this.tablePricingData[i].cost_per_km;
      this.lowerLimitKm = this.tablePricingData[i].lower_limit_km;
      this.upperLimitKm = this.tablePricingData[i].upper_limit_km;
      this.sendyTake = this.tablePricingData[i].sendy_take;
      this.fuelInclusivity = this.tablePricingData[i].fuel_inclusivity;
      this.partnerRate = this.tablePricingData[i].partner_rate;
      this.partnerTake = this.tablePricingData[i].partner_amount;
      this.editStatus = true;
      this.editedBandIndex = i;
    },
    saveAllPricing() {
      this.tablePricingData[this.editedBandIndex].vendor = this.selectedVendor;
      this.tablePricingData[this.editedBandIndex].currency = this.currency;
      this.tablePricingData[
        this.editedBandIndex
      ].minimum_distance = this.minDistance;
      this.tablePricingData[this.editedBandIndex].cost = this.cost;
      this.tablePricingData[this.editedBandIndex].cost_per_km = this.costPerKm;
      this.tablePricingData[
        this.editedBandIndex
      ].lower_limit_km = this.lowerLimitKm;
      this.tablePricingData[
        this.editedBandIndex
      ].upper_limit_km = this.upperLimitKm;
      this.tablePricingData[this.editedBandIndex].sendy_take = this.sendyTake;
      this.tablePricingData[
        this.editedBandIndex
      ].fuel_inclusivity = this.fuelInclusivity;
      this.tablePricingData[
        this.editedBandIndex
      ].partner_rate = this.partnerRate;
      this.tablePricingData[
        this.editedBandIndex
      ].partner_amount = this.partnerTake;
      this.editedBandIndex = 0;
      this.editStatus = false;
      this.clearInputs();
    },
    trackAddPricingDataPage() {
      mixpanel.track('Add Container Pricing data Page - PageView', {
        type: 'PageView',
      });
    },
    trackSaveAndPreview() {
      mixpanel.track(
        'Save and Preview Container Pricing button - ButtonClick',
        {
          type: 'Click',
        },
      );
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
.bands-col-3 {
  width: 25%;
  padding-left: 15px;
  height: 50px;
  display: flex;
  align-items: center;
}
.bands-col-4 {
  width: 25%;
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
</style>
