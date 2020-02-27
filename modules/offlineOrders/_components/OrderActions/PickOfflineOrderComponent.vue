<template>
  <div class="col-md-12">
    <div v-if="pickOrder" class="box box-primary user-main">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="ordernumber">Order Number</label>
          <input
            type="text"
            class="form-control"
            id="orderNumber"
            v-model="orderNumber"
            disabled
          />
        </div>
        <button
          type="button"
          @click="pickOfflineOrder"
          class="btn btn-primary offline-order--btn"
        >
          {{ this.buttonText }}
        </button>
      </form>
    </div>
    <div v-if="completeOrder">
      <CompleteOfflineOrderComponent />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import CompleteOfflineOrderComponent from './CompleteOfflineOrderComponent';

export default {
  name: 'PickOfflineOrderComponent',
  components: {
    CompleteOfflineOrderComponent,
  },
  data() {
    return {
      orderNumber: '',
      snNumber: '',
      partnerNumber: '',
      pickOrder: true,
      completeOrder: false,
      pending: false,
    };
  },
  computed: {
    ...mapGetters({
      getOrderNumber: 'getOrderNumber',
      getPartnerNumber: 'getPartnerNumber',
      getSnNumber: 'getSnNumber',
    }),
    buttonText() {
      if (this.pending) {
        return 'Picking Order...';
      } else {
        return 'Pick Order';
      }
    },
  },
  mounted() {
    this.orderNumber = this.getOrderNumber;
    this.snNumber = this.getSnNumber;
    this.partnerNumber = this.getPartnerNumber;
  },
  methods: {
    ...mapActions({
      pick_offline_order: 'pick_offline_order',
    }),
    async pickOfflineOrder() {
      this.pending = true;
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'rider_app_pick_up',
        apiKey: false,
        params: {
          order_no: this.orderNumber,
          sim_card_sn: '254716163362',
          rider_phone: '+254716163362',
          batch_no: '',
        },
      };
      try {
        const data = await this.pick_offline_order(payload);
        if (data.status) {
          this.pending = false;
          this.completeOrder = true;
          this.pickOrder = false;
        }
      } catch (error) {
        this.pending = false;
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
