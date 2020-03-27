<template>
  <div class="col-md-12">
    <div v-if="pickOrder" class="box box-primary user-main">
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
      isVisible: false,
      message: '',
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
    this.trackPickOrderPage();
  },
  methods: {
    ...mapActions({
      pick_offline_order: 'pick_offline_order',
    }),
    async pickOfflineOrder() {
      this.trackPickOrderButton();
      this.pending = true;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'rider_app_pick_up',
        apiKey: false,
        params: {
          order_no: this.orderNumber,
          sim_card_sn: this.snNumber,
          rider_phone: this.partnerNumber,
          batch_no: '',
        },
      };
      try {
        const data = await this.pick_offline_order(payload);
        if (data.status) {
          this.pending = false;
          this.completeOrder = true;
          this.pickOrder = false;
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
    trackPickOrderPage() {
      mixpanel.track('Pick order Page - PageView', {
        type: 'PageView',
      });
    },
    trackPickOrderButton() {
      mixpanel.track('Pick order button - ButtonClick', {
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
