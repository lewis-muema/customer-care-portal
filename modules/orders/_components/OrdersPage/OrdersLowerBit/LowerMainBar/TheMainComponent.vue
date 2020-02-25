<template>
  <span v-if="freightContainer">
    <TheOrderDetailsComponent :order="order" :rates="conversionRates" />
  </span>
  <span v-else>
    <TheOrderActionsComponent :order="order" :rates="conversionRates" />
    <TheOrderDetailsComponent :order="order" :rates="conversionRates" />
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
  },
  data() {
    return {
      conversionRates: [],
    };
  },
  computed: {
    ...mapGetters({
      getExchangeRates: 'getExchangeRates',
    }),
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
  watch: {
    getExchangeRates(value) {
      return (this.conversionRates = value);
    },
  },
  mounted() {
    this.setExchangeRates();
  },
  methods: {
    ...mapActions({
      setExchangeRates: 'setExchangeRates',
    }),
  },
};
</script>
