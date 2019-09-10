<template>
  <div class="col-md-8">
    <TheOrderActionsComponent :order="order" :rates="conversionRates" />
    <TheOrderDetailsComponent :order="order" :rates="conversionRates" />
  </div>
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
