<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          :id="`users_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="viewTab('users', orderNo)"
          >Users</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`time_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('time', orderNo)"
          >Time</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`notes_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('notes', orderNo)"
          >Notes</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`order_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('order', orderNo)"
          >Order</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`route_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('route', orderNo)"
          >Route</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`map_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('map', orderNo)"
          >Map</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`pricetiers_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('pricetiers', orderNo)"
          >Price Tiers</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`dispute_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('dispute', orderNo)"
          >Dispute</a
        >
      </li>
      <li class="nav-item" v-if="moreData.confirm_status === 0">
        <a
          class="nav-link"
          :id="`dispatchlist_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('dispatchlist', orderNo)"
          >Dispatch List</a
        >
      </li>
      <li
        class="nav-item"
        v-if="
          moreData.delivery_status === 3 &&
            (moreData.dispute_delivery_doc_status === 0) |
              (moreData.dispute_delivery_doc_status === 4)
        "
      >
        <a
          class="nav-link"
          :id="`deliverydetails_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('deliverydetails', orderNo)"
          >Delivery Details</a
        >
      </li>
      <li
        class="nav-item"
        v-if="
          moreData.delivery_status === 3 &&
            (moreData.dispute_delivery_doc_status === 2) |
              (moreData.dispute_delivery_doc_status === 3)
        "
      >
        <a
          class="nav-link"
          :id="`disputedeliverydocs_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('disputedeliverydocs', orderNo)"
          >Dispute Delivery Docs</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`quotes_${orderNo}`"
          v-if="
            isTruck(trucksArray, orderDetails.rider_details.vendor_type_id) &&
              moreData.confirm_status === 0
          "
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('quotes', orderNo)"
          >Quotes</a
        >
      </li>
      <li
        class="nav-item"
        v-if="
          moreData.delivery_status === 3 &&
            moreData.delivery_verification.physical_delivery_note_status
        "
      >
        <a
          class="nav-link"
          :id="`dnotes_${orderNo}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('dnotes', orderNo)"
          >D.Notes</a
        >
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
        <div
          :class="`tab-pane fade ${firstShow} ${firstActive}`"
          :id="`users_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `users_${orderNo}`"
        >
          <TheUsersComponent :order="orderDetails" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`time_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `time_${orderNo}`"
        >
          <TheTimeComponent :order="moreData" :eta="eta" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`notes_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `notes_${orderNo}`"
        >
          <TheNotesComponent
            :order="orderDetails.notes_log"
            :client="orderDetails.client_details.name"
          />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`order_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `order_${orderNo}`"
        >
          <TheOrderComponent :order="orderDetails" :rates="rates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`route_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `route_${orderNo}`"
        >
          <TheRouteComponent :order="orderDetails.paths" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`map_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `map_${orderNo}`"
        >
          <TheMapComponent :order="orderDetails" :eta="eta" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`pricetiers_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `pricetiers_${orderNo}`"
        >
          <ThePriceTiersComponent :order="orderDetails" :rates="rates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`dispute_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `dispute_${orderNo}`"
        >
          <TheDisputeComponent :order="orderDetails" :rates="rates" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`dispatchlist_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `dispatchlist_${orderNo}`"
        >
          <TheDispatchComponent :order="orderDetails" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`deliverydetails_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `deliverydetails_${orderNo}`"
        >
          <TheDeliveryDetailsComponent :order="orderDetails" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`dnotes_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `dnotes_${orderNo}`"
        >
          <TheDNotesComponent :order="orderDetails" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`quotes_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `quotes_${orderNo}`"
        >
          <TheQuotesComponent :order="orderDetails" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheOrderDetailsComponent',
  components: {
    TheUsersComponent: () => import('./OrderTabs/TheUsersComponent'),
    TheTimeComponent: () => import('./OrderTabs/TheTimeComponent'),
    TheNotesComponent: () => import('./OrderTabs/TheNotesComponent'),
    TheOrderComponent: () => import('./OrderTabs/TheOrderComponent'),
    TheRouteComponent: () => import('./OrderTabs/TheRouteComponent'),
    TheMapComponent: () => import('./OrderTabs/TheMapComponent'),
    ThePriceTiersComponent: () => import('./OrderTabs/ThePriceTiersComponent'),
    TheDisputeComponent: () => import('./OrderTabs/TheDisputeComponent'),
    TheDispatchComponent: () => import('./OrderTabs/TheDispatchListComponent'),
    TheDNotesComponent: () => import('./OrderTabs/TheDNotesComponent'),
    TheQuotesComponent: () => import('./OrderTabs/TheQuotesComponent'),

    TheDeliveryDetailsComponent: () =>
      import('./OrderTabs/TheDeliveryDetailsComponent'),
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
      moreData: this.order.order_details,
      showTab: `users_${this.order.order_details.order_no}`,
      orderNo: null,
      show: false,
      errors: [],
      active: false,
      activetab: null,
      firstShow: false,
      firstActive: false,
      conversionRates: this.rates,
      notification: null,
      eta: null,
    };
  },
  mounted() {
    this.firstShow = 'show';
    this.firstActive = 'active';
    this.orderNo = this.orderDetails.order_details.order_no;
    const vendorTypeID = this.orderDetails.rider_details.vendor_type_id;
    this.isTruck(this.trucksArray, vendorTypeID);
    this.requestETAs();
  },
  methods: {
    ...mapMutations({
      updateNotification: 'setNotification',
    }),
    ...mapActions({
      request_order_eta: '$_orders/request_order_eta',
    }),
    async requestETAs() {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'eta',
        apiKey: true,
        params: { order_no: this.orderNo },
      };
      const data = await this.request_order_eta(payload);
      if (typeof data.data === 'undefined') {
        this.notification = this.display_code_notification(data);
        this.updateNotification(this.notification);
      } else {
        return (this.eta = data.data);
      }
    },
    viewTab(tab, orderNo) {
      this.showTab = `${tab}_${orderNo}`;
      this.active = 'active';
      this.show = 'show';
    },
    isTruck(trucksArray, vendorTypeID) {
      return trucksArray.includes(vendorTypeID);
    },
  },
};
</script>
<style>
.container {
  max-width: 100%;
  margin: 0 auto;
  text-align: left;
  background: #ffff;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding-left: 0;
}
</style>
