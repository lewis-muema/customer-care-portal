<template>
  <div class="order-status" :class="activeClass">
    {{ statusText }}
  </div>
</template>
<script>
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
  mounted() {
    this.orderStatusColor();
  },
  methods: {
    orderStatusColor() {
      const transformedStatus = this.status.toLowerCase();
      switch (transformedStatus) {
        case 'order_completed':
          this.activeClass = 'confirmed';
          this.statusText = 'Confirmed';
          break;
        case 'order_received':
          this.activeClass = 'received';
          this.statusText = 'Received';
          break;
        case 'order_in_processing':
          this.activeClass = 'pending';
          this.statusText = 'Processing';
          break;
        case 'order_in_transit':
          this.activeClass = 'in-transit';
          this.statusText = 'In transit';
          break;
        default:
          this.activeClass = 'pending';
      }
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
  background-color: #fddb97;
  color: #9d5004;
}
.order-status.confirmed,
.order-status.received {
  background-color: #324ba833;
  color: #324ba8;
}
.order-status.in-transit {
  background-color: #defad2;
  color: #064a23;
}
</style>
