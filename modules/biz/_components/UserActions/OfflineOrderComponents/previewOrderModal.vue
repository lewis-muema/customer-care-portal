<template>
  <el-dialog
    :visible.sync="showDialog"
    width="976px"
    :modal="false"
    :show-close="false"
    :close-on-click-modal="false"
    top="2Vh"
  >
    <template slot="title">
      <span class="azureTransporter30" @click="$emit('close', true)">
        <i class="fa fa-arrow-left mr-2" aria-hidden="true"></i>
        Go Back and Edit
      </span>
    </template>
    <div class="mt-n3">
      <span class="title">Review and Submit</span>
    </div>
    <hr />
    <el-alert
      :title="message"
      :type="actionClass"
      effect="dark"
      class="mt-5"
      v-if="message"
      @close="message = null"
    >
    </el-alert>
    <div>
      <span class="title"> Billing Period </span>
      <div class="row mt-3">
        <div class="form-group col-md-4 user-input">
          <label class="small-font"> From </label>
          <div>
            <span> {{ formatDateMonthyear(propObject.start_date) }} </span>
          </div>
        </div>

        <div class="form-group user-input">
          <label class="small-font"> To</label>
          <div>
            <span> {{ formatDateMonthyear(propObject.end_date) }} </span>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div>
      <span class="title"> Partner Details</span>
      <div class="mt-3">
        <span class="muted-text" v-if="!checked">
          No Partners added
        </span>
        <div class=" row" v-for="(element, key) in elements" :key="key" v-else>
          <div class="col-3">
            <span class="small-font" v-if="key === 0"> Partner Account</span>
            <div class="mt-1">
              <span class="">
                {{ element.riderDisplay }}
              </span>
            </div>
          </div>
          <div class="col">
            <span class="small-font" v-if="key === 0">Vendor Type</span>
            <div class="mt-1">
              <span class="">
                {{
                  !element.vendor_type
                    ? '0 Tonnes'
                    : getVendorType(element.vendor_type)
                }}
              </span>
            </div>
          </div>
          <div class="col text-right">
            <span class="small-font" v-if="key === 0">Partner Earnings</span>
            <div class="mt-1">
              <span> {{ propObject.currency }}</span>
              <span> {{ element.amount }}</span>
            </div>
          </div>
          <div class="col text-right">
            <span class="small-font" v-if="key === 0">No. of Days worked</span>
            <div class="mt-1">
              <span>{{ element.days }}</span>
            </div>
          </div>

          <div class="col text-right">
            <span class="small-font" v-if="key === 0">No. of Orders</span>
            <div class="mt-1">
              <span>{{ element.orders }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr />
    <div>
      <span class="title">Customer Billing Details</span>
      <div class="mt-3 row">
        <div class="mb-3 col-4">
          <label for="invoice" class="form-label small-font">
            Invoice Notes
          </label>
          <div>
            <span class="muted-text" v-if="!propObject.notes"> Empty </span>
            <span v-html="propObject.notes" v-else></span>
          </div>
        </div>

        <div class="col-3 text-right">
          <span class="small-font">Amount Billed (before VAT)</span>
          <div class="mt-2">
            <span> {{ propObject.currency }}</span>
            <span> {{ propObject.billingAmount }}</span>
          </div>
        </div>

        <div class="col pl-0">
          <div class="d-flex ">
            <div class="cost-preview">
              <div class="mt-3 ml-2">
                <span class="mt-3 cost-text">
                  Total Partner Cost
                </span>
              </div>
              <div class="total-cost mt-2">
                <span>
                  {{ propObject.currency }}
                  {{ CommaSeperator(propObject.calculatedAmount) }}
                </span>
              </div>
            </div>
            <div class="cost-preview ml-1">
              <div class="mt-3 ml-2">
                <span class="mt-3 cost-text">
                  Sendy Take Home
                </span>
              </div>
              <div class="total-cost mt-2">
                <span>
                  {{ propObject.currency }}
                  {{ CommaSeperator(propObject.sendyTakeHome) }}
                </span>
              </div>
            </div>
          </div>
          <div class="cost-preview mt-2">
            <div class="ml-2 pt-3">
              <div>
                <span class="cost-text">
                  {{ propObject.determineVAT }}
                </span>
                <span class="float-right total-cost">
                  {{ propObject.currency }}
                  {{ CommaSeperator(propObject.vatAmount) }}
                </span>
              </div>

              <div class="mt-3">
                <span class="cost-text">
                  Total Charge to Customer
                </span>
                <span class="float-right total-cost">
                  {{ propObject.currency }}
                  {{ CommaSeperator(propObject.totalAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <button class="btn primary-btn" @click="offlineOrderSubmit">
        Submit
      </button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import offlineOrderMxn from '@/mixins/offline_order_mixin';

export default {
  name: 'previwOrderModal',
  mixins: [offlineOrderMxn],
  props: ['checked', 'elements', 'propObject', 'showDialog', 'payloadDraft'],
  data() {
    return {
      actionClass: 'success',
      message: '',
    };
  },
  methods: {
    ...mapActions({
      perform_user_action: 'perform_user_action',
    }),
    getVendorType(id) {
      const filtered = this.propObject.vendorTypes.filter(
        el => el.id === parseInt(id),
      );
      return filtered[0].name;
    },
    cleanPartnerData(data) {
      data.forEach(element => {
        delete element.vendor_type;
        delete element.riderDisplay;
      });
      return data;
    },
    async offlineOrderSubmit() {
      const payload = this.payloadDraft;
      const partners = this.cleanPartnerData(this.elements);
      if (!this.checked) {
        payload.params.action_data.partners = [];
        payload.params.action_data.charge_commission = false;
        payload.params.action_data.commission_rate = '0';
      } else {
        payload.params.action_data.partners = partners;
        payload.params.action_data.charge_commission = this.propObject.charge_commission;
        payload.params.action_data.commission_rate = this.propObject.commission_rate;
      }

      if (this.propObject.isChargeEntity) {
        payload.params.action_data.entity_id = 1;
      }
      const data = await this.perform_user_action(payload);
      this.actionClass = data.status ? 'success' : 'error';
      if (data.status) {
        this.$emit('close', false);
      } else {
        this.message = Object.prototype.hasOwnProperty.call(data, 'message')
          ? data.message
          : data.reason;
      }
    },
  },
};
</script>
