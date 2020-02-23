<template>
  <td
    colspan="9"
    class="order_view_lower_cell cell-override"
    :id="`order_view_lower${orderno}`"
  >
    <div class="blinder" v-if="blinderActive">
      <div class="driver-details-popup">
        <img
          src="https://images.sendyit.com/web_platform/orders/OrderConfirmation.svg"
          class="add-driver-prompt-photo"
        />
        <p class="add-driver-prompt-par">
          Looks like we have a new driver :)
        </p>
        <p class="save-driver-prompt-par">
          Would you like to save the driver’s details?
        </p>
        <button class="save-driver-prompt-button" @click="promptAllocation()">
          Yes! Save Details
        </button>
        <p class="ignore-driver-prompt-par" @click="blinderActive = false">
          Nah, don’t save
        </p>
      </div>
    </div>
    <div class="row" v-if="order === null">
      loading ....
    </div>
    <div
      class="row"
      v-else-if="
        order.freight_details &&
          order.order_details.order_no !== order.order_details.parent_order_no
      "
    >
      <span class=""
        ><LowerSlideComponent :orderno="order" :rates="conversionRates"
      /></span>
    </div>
    <div v-else>
      <span class=""
        ><TheLowerSlideComponent :orderno="orderno" :rates="conversionRates"
      /></span>
    </div>
  </td>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import LowerSlideComponent from './LowerSlideComponent';
import TheLowerSlideComponent from '../TheLowerSlideComponent';

export default {
  name: 'DashboardComponent',
  components: {
    LowerSlideComponent,
    TheLowerSlideComponent,
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
      show: false,
      active: false,
      activetab: null,
      firstShow: false,
      firstActive: false,
      blinderActive: false,
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
  beforeDestroy() {
    this.$root.$off(`Save Driver ${this.orderno}`);
  },
  mounted() {
    this.setExchangeRates();
    this.rootListener();
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
    rootListener() {
      this.$root.$on(`Save Driver ${this.orderno}`, arg => {
        this.blinderActive = arg;
      });
    },
    promptAllocation() {
      this.blinderActive = false;
      this.$root.$emit(`Allocate Driver ${this.orderno}`);
    },
    async singleOrderRequest() {
      try {
        const data = await this.request_single_order(this.orderno);
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
