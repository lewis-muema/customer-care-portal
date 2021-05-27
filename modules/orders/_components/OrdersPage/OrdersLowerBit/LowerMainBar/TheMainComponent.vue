<template>
  <span v-if="freightContainer">
    <TheOrderDetailsComponent :order="order" />
  </span>
  <span v-else>
    <TheOrderActionsComponent :order-details="orderDetails" :order="order" />
    <TheOrderDetailsComponent :order="order" />
  </span>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import TheOrderActionsComponent from './TheOrderActionsComponent';
import TheOrderDetailsComponent from './TheOrderDetailsComponent';

export default {
  name: 'TheMainComponent',
  components: {
    TheOrderActionsComponent,
    TheOrderDetailsComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    orderDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      conversionRates: [],
    };
  },
  computed: {
    freightContainer() {
      if (
        Object.prototype.hasOwnProperty.call(this.order, 'freight_details') &&
        this.order.freight_details &&
        this.order.order_details.parent_order_no !==
          this.order.order_details.order_no
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>
