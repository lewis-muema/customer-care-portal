<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          :id="`deliveries_${userID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="viewTab('deliveries', userID)"
          >Deliveries</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`statement_${userID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('statement', userID)"
          >Statement</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`invoice_${userID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('invoice', userID)"
          >Invoice</a
        >
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
        <div
          :class="`tab-pane fade ${firstShow} ${firstActive}`"
          :id="`deliveries_${userID}`"
          role="tabpanel"
          v-if="showTab === `deliveries_${userID}`"
        >
          <TheDeliveriesComponent
            :deliveries="deliveryList"
            :user="userID"
            :currency="currency"
          />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`statement_${userID}`"
          role="tabpanel"
          v-if="showTab === `statement_${userID}`"
        >
          <TheStatementComponent
            :payments="payments"
            :user="userID"
            :currency="currency"
          />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`invoice_${userID}`"
          role="tabpanel"
          v-if="showTab === `invoice_${userID}`"
        >
          <TheInvoiceLogsComponent :user="userID" :currency="currency" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheUserDetailsComponent',
  components: {
    TheDeliveriesComponent: () => import('./UserTabs/TheDeliveriesComponent'),
    TheStatementComponent: () => import('./UserTabs/TheStatementComponent'),
    TheInvoiceLogsComponent: () => import('./UserTabs/TheInvoiceLogsComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      active: false,
      activetab: null,
      firstShow: false,
      firstActive: false,
      userID: null,
      payments: null,
      showTab: `deliveries_${this.user.user_details.user_id}`,
    };
  },
  computed: {
    deliveryList() {
      return this.user.delivery_list;
    },
    details() {
      return this.user.user_details;
    },
    currency() {
      return this.details.default_currency ? this.details.default_currency : '';
    },
  },
  mounted() {
    this.firstShow = 'show';
    this.firstActive = 'active';
    this.userID = this.user.user_details.user_id;
    this.payments = this.user.payments;
  },
  methods: {
    viewTab(tab, userID) {
      this.showTab = `${tab}_${userID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
