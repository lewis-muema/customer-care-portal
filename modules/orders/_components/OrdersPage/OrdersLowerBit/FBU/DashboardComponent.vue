<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          :id="`total_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="viewTab('total', orderNo)"
          >Total</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`assigned_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('assigned', orderNo)"
          >Assigned</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`unassigned_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('unassigned', orderNo)"
          >Unassigned</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`create_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('create', orderNo)"
          >Create</a
        >
      </li>
    </ul>
    <div>
      <div>
        <div
          :class="`tab-pane fade ${firstShow} ${firstActive}`"
          :id="`total_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `total_${orderNo}`"
        >
          <AssignedComponent :order="order" :rates="conversionRates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`assigned_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `assigned_${orderNo}`"
        >
          <AssignedComponent :order="order" :rates="conversionRates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`unassigned_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `unassigned_${orderNo}`"
        >
          <UnassignedComponent :order="order" :rates="conversionRates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`create_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `create_${orderNo}`"
        >
          <CreateOrderComponent :order="order" :rates="conversionRates" />
        </div>
      </div>
    </div>
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
      orderNo: '',
      order: null,
      errors: [],
      conversionRates: [],
      showTab: `total_${this.order.order_details.order_no}`,
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
    this.orderNo = this.order.order_details.order_no;
    const vendorTypeID = this.order.rider_details.vendor_type_id;
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
        const data = await this.request_single_order(this.orderNo);
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
