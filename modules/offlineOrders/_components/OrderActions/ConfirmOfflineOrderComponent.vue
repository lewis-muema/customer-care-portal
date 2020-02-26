<template>
  <div class="col-md-12">
    <div v-if="confirmOrder" class="box box-primary user-main">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="orderamount">Order Amount</label>
          <input
            type="text"
            class="form-control"
            id="orderamount"
            v-model="orderAmount"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="pickup">Pick Up</label>
          <input
            type="text"
            class="form-control"
            id="pickup"
            v-model="pickup"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="destination">Destination</label>
          <input
            type="text"
            class="form-control"
            id="destination"
            v-model="dropoff"
            disabled
          />
        </div>
        <button
          type="button"
          @click="confirmOfflineOrder"
          class="btn btn-primary offline-order--btn"
        >
          Confirm Order
        </button>
      </form>
    </div>
    <div v-if="pairOrder">
      <UpdatePartnerInfoComponent />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import UpdatePartnerInfoComponent from './UpdatePartnerInfoComponent';

export default {
  name: 'ConfirmOfflineOrderComponent',
  components: {
    UpdatePartnerInfoComponent,
  },
  data() {
    return {
      amount: '',
      pickup: '',
      dropoff: '',
      currency: '',
      pricingId: '',
      pickOrder: false,
      confirmOrder: true,
    };
  },
  computed: {
    orderAmount() {
      return `${this.currency} ${this.amount}`;
    },
    ...mapGetters({
      getOrderAmount: 'getOrderAmount',
      getOrderCurrency: 'getOrderCurrency',
      getPricingId: 'getPricingId',
      getPickup: 'getPickup',
      getDropoff: 'getDropoff',
    }),
  },
  mounted() {
    this.currency = this.getOrderCurrency;
    this.amount = this.getOrderAmount;
    this.pricingId = this.getPricingId;
    this.pickup = this.getPickup;
    this.dropoff = this.getDropoff;
  },
  methods: {
    ...mapActions({
      confirm_offline_order: 'confirm_offline_order',
    }),
    async confirmOfflineOrder() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'v2/deliveryconfirm',
        apiKey: false,
        params: {
          amount: 0,
          approval_status: false,
          approve_data: {
            approver_email: null,
            approver_name: null,
            approver_phone: null,
          },
          card_token: '',
          carrier_type: 2,
          cash_status: false,
          customer_token: '',
          date_time: '{{timestampBody}}',
          delivery_points: 1,
          destination_paid_status: false,
          insurance_amount: 10,
          insurance_id: 1,
          insurance_status: true,
          note: '',
          note_status: false,
          pricing_uuid: this.pricingId,
          package_details: {
            additional_loader: false,
            customer_min_amount: 0,
            delivery_item: '',
            load_units: 'tonnes',
            load_weight: 0,
            max_temperature: 4,
            no_of_loaders: 1,
          },
          package_img: '',
          package_img_status: false,
          package_img_type: '',
          pay_method: 0,
          payment_mode: 0,
          promo_code: '',
          promo_code_amount: '',
          promo_code_status: false,
          promotion_order: false,
          ref_no: '',
          return: false,
          tier_name: 'Express',
          tier_tag: 'express_tier',
        },
      };
      try {
        const data = await this.confirm_offline_order(payload);
        console.log('data-ddd', data);
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
