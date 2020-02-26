<template>
  <div class="col-md-12">
    <div v-if="completeOrder" class="box box-primary user-main">
      <form style="padding:30px;">
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
          Complete Order
        </button>
      </form>
    </div>
    <div v-if="response" class="box box-primary user-main">Show response</div>
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
      pickup: '',
      dropoff: '',
      response: false,
      completeOrder: true,
    };
  },
  computed: {
    ...mapGetters({
      getOrderNumber: 'getOrderNumber',
      getPickup: 'getPickup',
      getDropoff: 'getDropoff',
    }),
  },
  mounted() {
    this.orderNumber = this.getOrderNumber;
    this.pickup = this.getPickup;
    this.dropoff = this.getDropoff;
  },
  methods: {
    ...mapActions({
      complete_offline_order: 'complete_offline_order',
    }),
    async completeOfflineOrder() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'rider_app_deliver',
        apiKey: false,
        params: {
          order_no: 'CF65GL345-FGF',
          sim_card_sn: '256700728472',
          rider_phone: '+256700728472',
          batch_no: '',
        },
      };
      try {
        const data = await this.complete_offline_order(payload);
        console.log('data-ddd', data);
        if (data.status) {
          this.completeOrder = false;
          this.response = true;
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
