<template>
  <div class="row ml-2 mt-3  ">
    <span class="all mr-5 ">
      <input
        type="checkbox"
        class="mr-2 span-left"
        v-model="isCheckAll"
        @change="checkAll"
      />
      ALL
    </span>
    <span class="row pending mr-5">
      <input
        type="checkbox"
        value="pending"
        class="mr-2 span-left"
        v-model="status"
        @change="changeStatus"
      />
      PENDING
      <div class="ml-1 badge-total pending-total text-center ">
        {{ ordersMeta !== null ? this.ordersMeta.pendingOrders : 0 }}
      </div>
    </span>
    <span class="row confirmed mr-5">
      <input
        type="checkbox"
        value="confirmed"
        class="mr-2 span-left"
        v-model="status"
        @change="changeStatus"
      />
      CONFIRMED
      <div class="ml-1 badge-total confirmed-total text-center">
        {{ ordersMeta !== null ? this.ordersMeta.confirmedOrders : 0 }}
      </div>
    </span>
    <span class="row transit mr-5">
      <input
        type="checkbox"
        value="transit"
        class="mr-2 span-left"
        v-model="status"
        @change="changeStatus"
      />
      IN TRANSIT
      <div class="ml-1 badge-total transit-total text-center">
        {{ ordersMeta !== null ? this.ordersMeta.inTransitOrders : 0 }}
      </div>
    </span>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'TheStatusButtonBar',
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      status: [],
      isCheckAll: true,
      orderDetails: this.orders,
      pendingCount: 0,
      confirmedCount: 0,
      transitCount: 0,
      ordersMeta: null,
    };
  },
  computed: {
    allOrders() {
      const data = this.orderDetails;
      return data;
    },
  },
  async mounted() {
    this.ordersMeta = await this.requestOrdersMetaData();
  },

  methods: {
    ...mapActions('orders', ['requestOrdersMetaData']),
    ...mapMutations('orders', {
      updateOrderStatuses: 'setOrderStatuses',
    }),
    objectLength(obj) {
      let result = 0;
      for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          result++;
        }
      }
      return result;
    },
    checkAll() {
      this.status = this.isCheckAll ? ['pending', 'confirmed', 'transit'] : [];
      this.checkStatus();
    },
    changeStatus() {
      this.isCheckAll = false;
      this.checkStatus();
    },
    checkStatus() {
      this.updateOrderStatuses(this.status);
    },
  },
};
</script>

<style scoped>
.all {
  color: #527cbd;
}
.pending {
  color: #ce5642;
}
.confirmed {
  color: #e89f3c;
}
.transit {
  color: #4aa261;
}
.pending-total {
  background: #ce5642;
}
.confirmed-total {
  background: #e89f3c;
}
.transit-total {
  background: #4aa261;
}
.span-left {
  margin-top: 3px;
}
.badge-total {
  color: #fff;
  font-size: 10px;
  border-radius: 100%;
  padding: 2px 4px;
  font-weight: 600;
}
</style>
