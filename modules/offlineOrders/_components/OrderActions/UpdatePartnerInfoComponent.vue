<template>
  <div class="col-md-12">
    <div v-if="pairOrder" class="box box-primary user-main">
      <form class="form-style">
        <div
          v-show="isVisible"
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <slot>{{ message }}</slot>
          <button
            @click="isVisible = false"
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="form-group col-md-6">
          <label for="orderamount">Order Amount</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="orderamount"
                placeholder="order amount"
                v-model="orderAmount"
              />
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="partneramount">Partner Amount</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="partneramount"
                placeholder="partner amount"
                v-model="partnerAmount"
              />
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="partnerphone">Partner Phone Number</label>
          <vue-tel-input
            v-model="partnerPhone"
            class="form-control"
            :preferred-countries="['ke', 'ug', 'tz']"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="snNumber">Sim Card Serial Number</label>
          <div class="input-group-btn">
            <input
              type="text"
              class="form-control"
              id="snNumber"
              placeholder="serial number"
              v-model="simCardSn"
            />
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="snNumber">Version Code</label>
          <div class="input-group-btn">
            <input
              type="text"
              class="form-control"
              id="versionCode"
              placeholder="version code"
              v-model="versionCode"
            />
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="sendycomission">Sendy Commission</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="sendycomission"
                placeholder="sendy comission"
                v-model="sendyComission"
              />
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="sendycomission">Service Fee</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="serviceFee"
                placeholder="service fee"
                v-model="serviceFee"
              />
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="insuranceamount">Insurance Amount</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="insuranceamount"
                placeholder="insurance amount"
                v-model="insuranceAmount"
              />
            </div>
          </div>
        </div>
        <div class="form-group col-md-6">
          <label for="vatamount">VAT Amount</label>
          <div class="input-group-btn">
            <div class="input-group-prepend">
              <span class="input-group-text">{{ this.currency }}</span>
              <input
                type="text"
                class="form-control"
                id="vatamount"
                placeholder="vat amount"
                v-model="vatAmount"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="pairOfflineOrder"
          class="btn btn-primary offline-order--btn"
        >
          {{ this.buttonText }}
        </button>
      </form>
    </div>
    <div v-if="pickOrder">
      <PickOfflineOrderComponent />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import PickOfflineOrderComponent from './PickOfflineOrderComponent';

export default {
  name: 'UpdatePartnerInfoComponent',
  components: {
    'vue-tel-input': VueTelInput,
    PickOfflineOrderComponent,
  },
  data() {
    return {
      orderAmount: 0,
      partnerAmount: 0,
      partnerPhone: '',
      sendyComission: 0,
      serviceFee: 0,
      insuranceAmount: 0,
      versionCode: 0,
      currency: '',
      vatAmount: 0,
      orderNumber: '',
      simCardSn: '',
      pairOrder: true,
      pickOrder: false,
      pending: false,
      isVisible: false,
      message: '',
    };
  },
  computed: {
    ...mapGetters({
      getOrderAmount: 'getOrderAmount',
      getOrderNumber: 'getOrderNumber',
      getVat: 'getVat',
      getOrderCurrency: 'getOrderCurrency',
    }),
    buttonText() {
      if (this.pending) {
        return 'Pairing Order...';
      } else {
        return 'Pair Order';
      }
    },
  },
  mounted() {
    this.currency = this.getOrderCurrency;
    this.orderAmount = this.getOrderAmount;
    this.orderNumber = this.getOrderNumber;
    this.vatAmount = this.getVat;
    this.trackPairOrderPage();
  },
  methods: {
    ...mapActions({
      pair_offline_order: 'pair_offline_order',
    }),
    ...mapMutations({
      updatePartnerPhone: 'setPartnerPhone',
      updatePartnerSn: 'setPartnerSn',
    }),
    async pairOfflineOrder() {
      this.trackPairOrderButton();
      this.pending = true;
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'back_dated_order_confirm',
        apiKey: false,
        params: {
          order_no: this.orderNumber,
          sim_card_sn: this.simCardSn,
          rider_phone: this.partnerPhone.replace(/\s/g, ''),
          version_code: parseInt(this.versionCode, 10),
          order_amount: parseInt(this.orderAmount, 10),
          rider_amount: parseInt(this.partnerAmount, 10),
          vat_amount: parseInt(this.vatAmount, 10),
          service_fee: parseInt(this.serviceFee, 10),
          sendy_commission: parseInt(this.sendyComission, 10),
          insurance: parseInt(this.insuranceAmount, 10),
        },
      };
      try {
        const data = await this.pair_offline_order(payload);
        if (data.status) {
          this.pending = false;
          this.pairOrder = false;
          this.pickOrder = true;
          this.updatePartnerSn(this.simCardSn);
          this.updatePartnerPhone(this.partnerPhone.replace(/\s/g, ''));
        } else {
          this.pending = false;
          this.isVisible = true;
          this.message = data.message;
        }
      } catch (error) {
        this.pending = false;
        this.isVisible = true;
        this.message = 'Something went wrong. Please try again.';
      }
    },
    trackPairOrderPage() {
      mixpanel.track('Pair order Page - PageView', {
        type: 'PageView',
      });
    },
    trackPairOrderButton() {
      mixpanel.track('Pair order button - ButtonClick', {
        type: 'Click',
      });
    },
  },
};
</script>
<style>
.user-main {
  border-top: 3px solid #3c8dbc;
}
.form-inline .input-group {
  width: 100%;
}
.input-group-icon {
  padding: 8px 12px;
}
.form-style {
  padding: 30px !important;
}
</style>
