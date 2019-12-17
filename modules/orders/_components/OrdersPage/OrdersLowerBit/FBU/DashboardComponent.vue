<template>
  <td
    colspan="9"
    class="order_view_lower_cell cell-override"
    :id="`order_view_lower${orderno}`"
    style="padding:0px; background-color: rgba(245, 245, 245, 0.56) !important; font-size: 13px;"
  >
    <div class="row" v-if="order === null">
      loading ....
    </div>
    <div v-else>
      <!-- <span class="badge badge-pill badge-primary rounded">Primary</span> -->
      <span class=""
        ><AssignedComponent :order="order" :rates="conversionRates"
      /></span>
      <span class=""
        ><CreateOrderComponent :order="order" :rates="conversionRates"
      /></span>
      <span class=""
        ><UnassignedComponent :order="order" :rates="conversionRates"
      /></span>
    </div>
  </td>
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
      order: null,
      errors: [],
      conversionRates: [],
      // showTab: `total_${order.order_details.order_no}`,
      show: false,
      active: false,
      activetab: null,
      firstShow: false,
      firstActive: false,
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

    this.firstShow = 'show';
    this.firstActive = 'active';
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
    viewTab(tab, orderNo) {
      this.showTab = `${tab}_${orderNo}`;
      this.active = 'active';
      this.show = 'show';
    },
    async singleOrderRequest() {
      try {
        const data = await this.request_single_order(this.orderno);
        console.log(data);
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
