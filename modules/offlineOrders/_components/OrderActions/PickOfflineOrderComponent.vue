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
          Pick-Up Order
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
      // pickOrder: true,
      // completeOrder: false,

      // test

      pickOrder: false,
      completeOrder: true,
    };
  },
  computed: {
    ...mapGetters({
      getOrderNumber: 'getOrderNumber',
    }),
  },
  mounted() {
    this.orderNumber = this.getOrderNumber;
  },
  methods: {
    ...mapActions({
      pick_offline_order: 'pick_offline_order',
    }),
    async pickOfflineOrder() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_ORDERS',
        endpoint: 'rider_app_pick_up',
        apiKey: false,
        params: {
          order_no: 'CF65GL345-FGF',
          sim_card_sn: '256700728472',
          rider_phone: '+256700728472',
          batch_no: '',
        },
      };
      try {
        const data = await this.pick_offline_order(payload);
        console.log('data-ddd', data);
        if (data.status) {
          this.completeOrder = true;
          this.pickOrder = false;
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
