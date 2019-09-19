<template>
  <td class="status-td">
    <span
      id="pending_count"
      class="label label-danger active-pending"
      @click="toggle_show('pending')"
    >
      <label id="pending_orders">
        {{ activeArray.includes('pending') ? objectLength(pendingOrders) : 0 }}
      </label>
      Pending
    </span>
    &nbsp;

    <span
      id="confirmed_count"
      class="label label-warning active-confirmed"
      @click="toggle_show('confirmed')"
    >
      <label id="confirmed_orders">
        {{
          activeArray.includes('confirmed') ? objectLength(confirmedOrders) : 0
        }}
      </label>
      Confirmed
    </span>
    &nbsp;

    <span
      id="transit_count"
      class="label label-success active-transit"
      @click="toggle_show('transit')"
    >
      <label id="transit_orders">
        {{ activeArray.includes('transit') ? objectLength(transitOrders) : 0 }}
      </label>
      In Transit
    </span>
  </td>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  name: 'TheStatusButtonsBar',
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      pending_show: 1,
      confirmed_show: 1,
      transit_show: 1,
      request_id_init: null,
      nnn: this.orders,
      activeArray: ['pending', 'confirmed', 'transit'],
    };
  },
  computed: {
    allOrders() {
      const data = this.orders;
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
  methods: {
    ...mapMutations({
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

    checkActive() {
      const element_pending = 'pending_count';
      const element_confirmed = 'confirmed_count';
      const element_transit = 'transit_count';
      const arr = [];
      const activeStatus = [];
      arr.push('pending');
      arr.push('confirmed');
      arr.push('transit');
      for (let m = 0; m < arr.length; m++) {
        if ($(`#${arr[m]}_count`).hasClass(`active-${arr[m]}`)) {
          activeStatus.push(arr[m]);
        }
      }
      this.activeArray = activeStatus;
      return activeStatus;
    },
    toggle_show(status) {
      const element = `${status}_count`;
      const css = `active-${status}`;
      $(`#${element}`).toggleClass(css);
      const active = this.checkActive();
      const selectedStatus = ['cancelled', 'delivered'];
      const activeStatuses = selectedStatus.concat(active);

      this.updateOrderStatuses(activeStatuses);
    },
  },
};
</script>
