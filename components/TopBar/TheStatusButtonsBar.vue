<template>
  <div class="row ml-2 mt-3  ">
    <span class="all mr-5 ">
      <input
        type="checkbox"
        class="mr-2 span-left"
        v-model="isCheckAll"
        @change="checkAll"
        :disabled="getDisabledStatus"
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
        :disabled="getDisabledStatus"
      />
      PENDING
      <div class="ml-1 badge-total pending-total text-center ">
        {{ pendingCount + objectLength(pendingOrders) }}
      </div>
    </span>
    <span class="row confirmed mr-5">
      <input
        type="checkbox"
        value="confirmed"
        class="mr-2 span-left"
        v-model="status"
        @change="changeStatus"
        :disabled="getDisabledStatus"
      />
      CONFIRMED
      <div class="ml-1 badge-total confirmed-total text-center">
        {{ confirmedCount + objectLength(confirmedOrders) }}
      </div>
    </span>
    <span class="row transit mr-5">
      <input
        type="checkbox"
        value="transit"
        class="mr-2 span-left"
        v-model="status"
        @change="changeStatus"
        :disabled="getDisabledStatus"
      />
      IN TRANSIT
      <div class="ml-1 badge-total transit-total text-center">
        {{ transitCount + objectLength(transitOrders) }}
      </div>
    </span>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'statusBar',
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
      count: null,
      pendingCount: 0,
      confirmedCount: 0,
      transitCount: 0,
    };
  },
  computed: {
    ...mapGetters(['getOrderCount', 'getDisabledStatus']),
    allOrders() {
      const data = this.orderDetails;
      return data;
    },
    pendingOrders() {
      return this.allOrders.filter(el => {
        return el.order_status.toLowerCase() === 'pending';
      });
    },
    confirmedOrders() {
      return this.allOrders.filter(el => {
        return el.order_status.toLowerCase() === 'confirmed';
      });
    },
    transitOrders() {
      return this.allOrders.filter(el => {
        return el.order_status.toLowerCase() === 'in transit';
      });
    },
  },
  watch: {
    getOrderCount(count) {
      this.pendingCount = count !== null ? count.pending : this.pendingCount;
      this.confirmedCount =
        count !== null ? count.confirmed : this.confirmedCount;
      this.transitCount = count !== null ? count.transit : this.transitCount;
      return (this.count = count);
    },
  },
  methods: {
    ...mapMutations({
      updateOrderStatuses: 'setOrderStatuses',
      setDisabledStatus: 'setDisabledStatus',
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
      this.setDisabledStatus(true);
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
  height: 16px;
  width: 16px;
}
</style>
