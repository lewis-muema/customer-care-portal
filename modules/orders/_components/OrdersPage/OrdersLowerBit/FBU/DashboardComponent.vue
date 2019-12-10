<template>
  <div>
    <span class="badge badge-pill badge-primary rounded">Primary</span>
    <span class="badge badge-pill badge-secondary"
      ><AssignedComponent :order="order" :rates="conversionRates"
    /></span>
    <span class="badge badge-pill badge-success"
      ><UnassignedComponent :order="order" :rates="conversionRates"
    /></span>
    <span class="badge badge-pill badge-danger"
      ><CreateOrderComponent :order="order" :rates="conversionRates"
    /></span>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import AssignedComponent from './AssignedComponent';
import UnassignedComponent from './UnassignedComponent';
import CreateOrderComponent from './CreateOrderComponent';

export default {
  name: 'DashboardComponent',
  components: {
    AssignedComponent,
    UnassignedComponent,
    CreateOrderComponent,
  },
  props: {
    orderno: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.orderno,
      order: null,
      errors: [],
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
  created() {
    this.singleOrderRequest();
  },
  mounted() {
    this.setExchangeRates();

    const notification = [];
    const actionClass = '';
    this.updateClass(actionClass);
    this.updateOrderErrors(notification);

    this.updateErrors(notification);
    this.updateNotification(actionClass);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setErrors',
      updateNotification: 'setNotification',
      updateClass: 'setActionClass',
      updateOrderErrors: 'setActionErrors',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
      setExchangeRates: 'setExchangeRates',
    }),
    async singleOrderRequest() {
      try {
        const data = await this.request_single_order(this.orderNo);
        return (this.order = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
  },
};
</script>
