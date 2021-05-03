<template>
  <td
    colspan="9"
    class="order_view_lower_cell"
    :id="`order_view_lower${orderNo}`"
    style="padding:0px; background-color: rgba(245, 245, 245, 0.56) !important; font-size: 13px;"
  >
    <TheNotificationsComponent :errors="errors" />
    <div class="lower_slide_bit" :id="`bumba_${orderNo}`">
      <div class="row" v-if="order === null">
        loading ....
      </div>
      <div class="row" v-else>
        <div class="col-md-4">
          <TheSideComponent :order="order" />
        </div>
        <div class="col-md-8">
          <TheMainComponent :order-details="orderDetails" :order="order" />
        </div>
      </div>
    </div>
  </td>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import TheSideComponent from './LowerSideBar/TheSideComponent';
import TheMainComponent from './LowerMainBar/TheMainComponent';
import TheNotificationsComponent from '~/components/UI/TheNotificationsComponent';

export default {
  name: 'TheLowerSlideComponent',
  components: {
    TheSideComponent,
    TheMainComponent,
    TheNotificationsComponent,
  },
  props: {
    fullOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.fullOrder.order_no,
      order: null,
      errors: [],
      orderDetails: {},
    };
  },
  created() {
    this.singleOrderRequest();
    this.getOrderDetails();
  },
  mounted() {
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
    }),
    getOrderDetails() {
      const countryCode = this.fullOrder.country_code
        ? this.fullOrder.country_code
        : this.fullOrder.orderCountryCode[0];
      this.orderDetails = {
        countryCode,
        vendorID: this.fullOrder.vendor_type_id,
        orderStatus: this.fullOrder.order_status,
      };
    },
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
