<template>
  <div class="col-md-12">
    <div v-if="pairOrder" class="box box-primary user-main">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="orderamount">Order Amount</label>
          <input
            type="text"
            class="form-control"
            id="orderamount"
            placeholder="order amount"
            v-model="amount"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="partneramount">Partner Amount</label>
          <input
            type="text"
            class="form-control"
            id="partneramount"
            placeholder="partner amount"
            v-model="partnerAmount"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="partnerphone">Partner Phone Number</label>
          <input
            type="text"
            class="form-control"
            id="partnerphone"
            placeholder="+25471000000"
            v-model="partnerPhone"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="sendycomission">Sendy Commission</label>
          <input
            type="text"
            class="form-control"
            id="sendycomission"
            placeholder="sendy comission"
            v-model="commission"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="insuranceamount">Insurance Amount</label>
          <input
            type="text"
            class="form-control"
            id="insuranceamount"
            placeholder="insurance amount"
            v-model="insurance"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="vatamount">VAT Amount</label>
          <input
            type="text"
            class="form-control"
            id="vatamount"
            placeholder="vat amount"
            v-model="vat"
            disabled
          />
        </div>
        <button
          type="button"
          @click="pairOfflineOrder"
          class="btn btn-primary offline-order--btn"
        >
          Pair Order
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
import PickOfflineOrderComponent from './PickOfflineOrderComponent';

export default {
  name: 'UpdatePartnerInfoComponent',
  components: {
    PickOfflineOrderComponent,
  },
  data() {
    return {
      orderAmount: 0,
      partnerTakehome: 0,
      partnerPhone: '',
      sendyComission: 0,
      insuranceAmount: 0,
      currency: '',
      vatAmount: 0,
      pairOrder: true,
      pickOrder: false,
    };
  },
  computed: {
    amount() {
      return `${this.currency} ${this.orderAmount}`;
    },
    vat() {
      return `${this.currency} ${this.vatAmount}`;
    },
    partnerAmount() {
      return `${this.currency} ${this.partnerTakehome}`;
    },
    insurance() {
      return `${this.currency} ${this.insuranceAmount}`;
    },
    commission() {
      return `${this.currency} ${this.sendyComission}`;
    },
    ...mapGetters({
      getOrderAmount: 'getOrderAmount',
      getVat: 'getVat',
      getOrderCurrency: 'getOrderCurrency',
    }),
  },
  mounted() {
    this.currency = this.getOrderCurrency;
    this.orderAmount = this.getOrderAmount;
    this.vatAmount = this.getVat;
  },
  methods: {
    ...mapActions({
      pair_offline_order: 'pair_offline_order',
    }),
    async pairOfflineOrder() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'back_dated_order_confirm',
        apiKey: false,
        params: {
          order_no: 'CF64CV399-UA5',
          sim_card_sn: '256772509474',
          rider_phone: '+256772509474',
          version_code: 684,
          order_amount: 5485543,
          rider_amount: 4583333,
          vat_amount: 836778,
          service_fee: 55432,
          sendy_commission: 4,
          insurance: 10000,
        },
      };
      try {
        const data = await this.pair_offline_order(payload);
        console.log('data-ddd', data);
        if (data.status) {
          this.pairOrder = false;
          this.pickOrder = true;
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
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
</style>
