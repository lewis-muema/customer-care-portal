<template>
  <div class="order-status" :class="activeClass">
    {{ status }}
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
    };
  },
  mounted() {
    this.orderStatusColor();
  },
  methods: {
    orderStatusColor() {
      const transformedStatus = this.status.toLowerCase();
      switch (transformedStatus) {
        case 'confirmed':
          this.activeClass = 'confirmed';
          break;
        case 'received':
          this.activeClass = 'received';
          break;
        case 'pending':
          this.activeClass = 'pending';
          break;
        case 'in transit':
          this.activeClass = 'in-transit';
          break;
        default:
          this.activeClass = 'confirmed';
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
