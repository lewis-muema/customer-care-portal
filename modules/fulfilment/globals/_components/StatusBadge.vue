<template>
  <div class="order-status" :class="activeClass">
    {{ statusText }}
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeClass: 'pending',
      statusText: 'Processing',
    };
  },
  computed: {
    ...mapGetters({
      getStatusMapping: 'fulfilment/getStatusMapping',
    }),
  },
  mounted() {
    this.orderStatusColor();
  },
  methods: {
    orderStatusColor() {
      const transformedStatus = this.status;

      const filteredStatus = this.getStatusMapping.filter(
        event => event.value === this.status,
      );
      // eslint-disable-next-line prettier/prettier
      const label = filteredStatus.length > 0 ? filteredStatus[0].label : 'Pending';

      this.activeClass = label.replace(/\s+/g, '-').toLowerCase();
      this.statusText = label;
    },
  },
};
</script>
<style scoped>
.order-status {
  text-align: center;
  width: 70%;
  border-radius: 20px;
  text-transform: capitalize;
  font-weight: 700;
  font-size: 10.5378px;
  line-height: 24px;
}
.order-status.pending {
  background-color: #ffe9d8;
  color: #b71f25;
}

.order-status.confirmed,
.order-status.received,
.order-status.processing {
  background-color: #fddb97;
  color: #9d5004;
}
.order-status.in-transit {
  background-color: #defad2;
  color: #064a23;
}
.order-status.completed,
.order-status.composition {
  background-color: #324ba833;
  color: #324ba8;
}
.order-status.failed {
  background-color: #dd4b39;
  color: #fff;
}
.order-status.cancelled {
  background-color: black;
  color: #fff;
}
</style>
