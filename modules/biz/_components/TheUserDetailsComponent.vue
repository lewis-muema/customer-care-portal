<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          :id="`deliveries_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="viewTab('deliveries', copID)"
          >Deliveries</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`statement_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('statement', copID)"
          >Statement</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`riders_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('riders', copID)"
          >Riders</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`invoice_receiver_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('invoice_receiver', copID)"
          >Invoice Receivers</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`invoice_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('invoice', copID)"
          >Invoice</a
        >
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
        <div
          :class="`tab-pane fade ${firstShow} ${firstActive}`"
          :id="`deliveries_${copID}`"
          role="tabpanel"
          v-if="showTab === `deliveries_${copID}`"
        >
          <TheDeliveriesComponent :deliveries="deliveries" :user="copID" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`statement_${copID}`"
          role="tabpanel"
          v-if="showTab === `statement_${copID}`"
        >
          <TheStatementComponent
            :payments="payments"
            :user="copID"
            :currency="currency"
          />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`riders_${copID}`"
          role="tabpanel"
          v-if="showTab === `riders_${copID}`"
        >
          <TheRidersComponent :riders="riderDetails" :user="copID" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`users_${copID}`"
          role="tabpanel"
          v-if="showTab === `users_${copID}`"
        >
          users_
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`invoice_receiver_${copID}`"
          role="tabpanel"
          v-if="showTab === `invoice_receiver_${copID}`"
        >
          <TheInvoiceComponent :receivers="invoiceReceivers" :user="copID" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`invoice_${copID}`"
          role="tabpanel"
          v-if="showTab === `invoice_${copID}`"
        >
          <TheInvoiceLogsComponent :user="copID" :currency="currency" />
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
    TheRidersComponent: () => import('./UserTabs/TheRidersComponent'),
    TheInvoiceComponent: () => import('./UserTabs/TheInvoiceComponent'),
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
      copID: null,
      showTab: `deliveries_${this.user.user_details.cop_id}`,
      deliveryList: null,
      payments: null,
      riderDetails: null,
    };
  },

  computed: {
    deliveries() {
      return this.user.delivery_list;
    },
    userDetails() {
      return this.user.user_details;
    },
    currency() {
      return this.userDetails.default_currency
        ? this.userDetails.default_currency
        : '';
    },
    invoiceReceivers() {
      const arr = [];
      return this.user.invoice_receivers ? this.user.invoice_receivers : arr;
    },
  },
  mounted() {
    this.firstShow = 'show';
    this.firstActive = 'active';
    this.copID = this.user.user_details.cop_id;
    this.deliveryList = this.user.delivey_list;
    this.payments = this.user.payments;
    this.riderDetails = this.user.rider_list;
  },
  methods: {
    viewTab(tab, copID) {
      this.showTab = `${tab}_${copID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
