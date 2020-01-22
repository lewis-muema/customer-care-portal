<template>
  <span v-if="vendortype === 25">
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
    vendortype() {
      return this.order.rider_details.vendor_type_id;
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
