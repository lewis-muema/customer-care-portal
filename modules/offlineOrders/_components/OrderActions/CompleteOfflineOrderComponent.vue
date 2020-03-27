<template>
  <div class="col-md-12">
    <div v-if="completeOrder" class="box box-primary user-main">
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
          <label for="ordernumber">Order Number</label>
          <input
            type="text"
            class="form-control"
            id="ordernumber"
            v-model="orderNumber"
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
          @click="completeOfflineOrder"
          class="btn btn-primary offline-order--btn"
        >
          {{ this.buttonText }}
        </button>
      </form>
    </div>
    <div v-if="response" class="box box-primary user-main success-text">
      Order {{ this.orderNumber }} Successully Completed!
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'CompleteOfflineOrderComponent',
  data() {
    return {
      orderNumber: '',
      partnerNumber: '',
      snNumber: '',
      pickup: '',
      dropoff: '',
      response: false,
      completeOrder: true,
      pending: false,
      isVisible: false,
      message: '',
    };
  },
  computed: {
    ...mapGetters({
      getOrderNumber: 'getOrderNumber',
      getPickup: 'getPickup',
      getDropoff: 'getDropoff',
      getPartnerNumber: 'getPartnerNumber',
      getSnNumber: 'getSnNumber',
    }),
    buttonText() {
      if (this.pending) {
        return 'Completing Order...';
      } else {
        return 'Complete Order';
      }
    },
  },
  mounted() {
    this.orderNumber = this.getOrderNumber;
    this.pickup = this.getPickup;
    this.dropoff = this.getDropoff;
    this.snNumber = this.getSnNumber;
    this.partnerNumber = this.getPartnerNumber;
    this.trackCompleteOrderPage();
  },
  methods: {
    ...mapActions({
      complete_offline_order: 'complete_offline_order',
    }),
    async completeOfflineOrder() {
      this.trackCompleteOrderButton();
      this.pending = true;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'rider_app_deliver',
        apiKey: false,
        params: {
          order_no: this.orderNumber,
          sim_card_sn: this.snNumber,
          rider_phone: this.partnerNumber,
          batch_no: '',
        },
      };
      try {
        const data = await this.complete_offline_order(payload);
        if (data.status) {
          this.pending = false;
          this.completeOrder = false;
          this.response = true;
        } else {
          this.pending = false;
          this.isVisible = true;
          this.message = data.reason;
        }
      } catch (error) {
        this.pending = false;
        this.isVisible = true;
        this.message = 'Something went wrong. Please try again.';
      }
    },
    trackCompleteOrderPage() {
      mixpanel.track('Complete order Page - PageView', {
        type: 'PageView',
      });
    },
    trackCompleteOrderButton() {
      mixpanel.track('Complete order button - ButtonClick', {
        type: 'Click',
      });
    },
  },
};
</script>
<style scoped>
.user-main {
  border-top: 3px solid #3c8dbc;
}
.form-inline .input-group {
  width: 100%;
}
.input-group-icon {
  padding: 8px 12px;
}
.success-text {
  height: 200px;
  text-align: center;
  color: #3c8dbc;
  font-size: 20px;
  font-weight: 600;
  padding: 4rem;
}
.form-style {
  padding: 30px !important;
}
</style>
