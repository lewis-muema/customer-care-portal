<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
      <li class="nav-item" v-if="showDispatch(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `dispatch_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('dispatch', orderNo)"
          :id="`dispatch_${orderNo}`"
        >
          <span class="fa fa-fw fa-wifi"></span>
          Dispatch
        </a>
      </li>
      <li class="nav-item" v-if="showReallocateBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `reallocate_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('reallocate', orderNo)"
          :id="`reallocate_${orderNo}`"
        >
          <span class="fa fa-fw fa-link"></span>
          Re-Allocate
        </a>
      </li>
      <li class="nav-item" v-if="showCancellationBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `cancel_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('cancel', orderNo)"
          :id="`cancel_${orderNo}`"
        >
          <span class="fa fa-fw fa-thumbs-down"></span>
          Cancel
        </a>
      </li>
      <li class="nav-item" v-if="showScheduleBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `schedule_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('schedule', orderNo)"
          :id="`schedule_${orderNo}`"
        >
          <span class="fa fa-fw fa-calendar"></span>
          Schedule
        </a>
      </li>
      <li class="nav-item" v-if="showReturnBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `return_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('return', orderNo)"
          :id="`return_${orderNo}`"
        >
          <span class="fa fa-fw fa-retweet"></span>
          Return
        </a>
      </li>
      <li
        class="nav-item"
        v-if="order.order_details.order_status !== 'cancelled'"
      >
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `sms_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('sms', orderNo)"
          :id="`sms_${orderNo}`"
        >
          <span class="fa fa-fw fa-paste"></span>
          Sms Link
        </a>
      </li>
      <li class="nav-item" v-if="showProximityBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `proximity_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('proximity', orderNo)"
          :id="`proximity_${orderNo}`"
        >
          <span class="fa fa-fw fa-envelope"></span>
          Proximity
        </a>
      </li>
      <li class="nav-item">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `ticket_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('ticket', orderNo)"
          :id="`ticket_${orderNo}`"
        >
          <span class="fa fa-fw fa-envelope"></span>
          Create Ticket
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          (order.order_details.confirm_status > 0 &&
            order.rider_details.vendor_type_id === 20) ||
            (order.order_details.confirm_status > 0 &&
              order.rider_details.vendor_type_id === 25)
        "
      >
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `tracker__${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('tracker', orderNo)"
          :id="`tracker__${orderNo}`"
        >
          <span class="fa fa-fw fa-map-marker"></span>
          GPS-Tracker
        </a>
      </li>
      <li class="nav-item" v-if="showAllocateOrdersBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `allocate__${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('allocate', orderNo)"
          :id="`allocate__${orderNo}`"
        >
          <span class="fa fa-cloud-upload"></span>
          Allocate Orders
        </a>
      </li>
      <li class="nav-item" v-if="showMarkInTransitBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `mark_in_transit_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('mark_in_transit', orderNo)"
          :id="`mark_in_transit_${orderNo}`"
        >
          <span class="fa fa-fw fa-truck"></span>
          Mark in Transit
        </a>
      </li>
      <li class="nav-item" v-if="showCompleteOrderBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `complete_order_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('complete_order', orderNo)"
          :id="`complete_order_${orderNo}`"
        >
          <span class="fa fa-fw fa-check-square"></span>
          Complete Order
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status === 'in transit' &&
            permissions.auxilliary_services_order &&
            [6, 10, 13, 14, 17, 18, 19, 20].includes(
              order.rider_details.vendor_type_id,
            )
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('auxilliary_services', orderNo)"
          :id="`auxilliary_services_${orderNo}`"
        >
          <span class="fa fa-fw fa-money blue-override"></span>
          Auxiliary Services
        </a>
      </li>
      <li class="nav-item" v-if="showUploadDnotesBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `upload_dnotes_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('upload_dnotes', orderNo)"
          :id="`upload_dnotes_${orderNo}`"
        >
          <span class="fa fa fa-upload"></span>
          Upload Dnotes
        </a>
      </li>
      <li class="nav-item" v-if="showDeliveryStatusBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `delivery_status_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('delivery_status', orderNo)"
          :id="`delivery_status_${orderNo}`"
        >
          <span class="fa fa fa-location-arrow"></span>
          Delivery status
        </a>
      </li>
      <li class="nav-item" v-if="showWeightOfOrderBtn(order)">
        <a
          class="force_blue"
          :class="{ activeLink: showTab === `weight_of_order_${orderNo}` }"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('weight_of_order', orderNo)"
          :id="`weight_of_order_${orderNo}`"
        >
          <span class="fa fa fa-cubes"></span>
          Weight of the order
        </a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
        <div
          v-if="actionErrors.length > 0"
          :class="`alert alert-${actionClass}`"
          :id="`error_holder_${orderNo}`"
        >
          <ul>
            <li v-for="error in actionErrors" :key="error.index">
              <b>{{ error }}</b>
            </li>
          </ul>
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`dispatch_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `dispatch_${orderNo}`"
        >
          <TheDispatchComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`reallocate_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `reallocate_${orderNo}`"
        >
          <TheReallocateComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`cancel_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `cancel_${orderNo}`"
        >
          <TheCancelComponent :order-details="orderDetails" :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`schedule_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `schedule_${orderNo}`"
        >
          <TheScheduleComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`proximity_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `proximity_${orderNo}`"
        >
          <TheProximityComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`return_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `return_${orderNo}`"
        >
          <TheReturnComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`sms_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `sms_${orderNo}`"
        >
          <TheSMSComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`ticket_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `ticket_${orderNo}`"
        >
          <TheTicketComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`allocate_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `allocate_${orderNo}`"
        >
          <AllocateComponent :order="order" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`tracker_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `tracker_${orderNo}`"
        >
          <TrackerComponent :order="order" />
        </div>
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`mark_in_transit_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `mark_in_transit_${orderNo}`"
      >
        <TheMarkInTransitComponent :order="order" />
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`complete_order_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `complete_order_${orderNo}`"
      >
        <TheCompleteOrderComponent :order="order" />
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`auxilliary_services_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `auxilliary_services_${orderNo}`"
      >
        <AuxilliaryServices :order="order" />
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`upload_dnotes_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `upload_dnotes_${orderNo}`"
      >
        <TheUploadDnoteComponent :order="order" />
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`delivery_status_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `delivery_status_${orderNo}`"
      >
        <TheDeliveryStatusComponent :order="order" />
      </div>
      <div
        :class="`tab-pane fade ${show} ${active}`"
        :id="`weight_of_order_${orderNo}`"
        role="tabpanel"
        v-if="showTab === `weight_of_order_${orderNo}`"
      >
        <TheInterCountyWeighingComponent :order="order" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'TheButtonsComponent',
  components: {
    TheDispatchComponent: () => import('./TheDispatchComponent'),
    TheReallocateComponent: () => import('./TheReallocateComponent'),
    TheCancelComponent: () => import('./TheCancelComponent'),
    TheReturnComponent: () => import('./TheReturnComponent'),
    TheScheduleComponent: () => import('./TheScheduleComponent'),
    TheProximityComponent: () => import('./TheProximityComponent'),
    TheSMSComponent: () => import('./TheSMSComponent'),
    TheTicketComponent: () => import('./TheTicketComponent'),
    AllocateComponent: () => import('./AllocateComponent'),
    TrackerComponent: () => import('./TrackerComponent'),
    TheMarkInTransitComponent: () => import('./TheMarkInTransitComponent'),
    TheCompleteOrderComponent: () => import('./TheCompleteOrderComponent'),
    AuxilliaryServices: () =>
      import('../../FBU/OrderActions/AuxilliaryServices'),
    TheUploadDnoteComponent: () => import('./TheUploadDnoteComponent'),
    TheDeliveryStatusComponent: () => import('./TheDeliveryStatusComponent'),
    TheInterCountyWeighingComponent: () =>
      import('./TheInterCountyWeighingComponent'),
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    orderDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: null,
      showTab: null,
      show: false,
      active: false,
      moreData: null,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
    vendorTypeID() {
      return this.order.rider_details.vendor_type_id;
    },
    confirmedStatus() {
      return this.order.order_details.confirm_status;
    },
    mm() {
      return this.order.order_details.delivery_status;
    },
    isTruck() {
      const nonTrucks = this.nonTrucks;
      return !nonTrucks.includes(this.vendorTypeID);
    },
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
  },
  mounted() {
    this.orderNo = this.order.order_details.order_no;
    this.moreData = this.order.order_details;
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    clearErrorMessages() {
      const notification = [];
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    viewTab(tab, orderNo) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${orderNo}`;
      this.active = 'active';
      this.show = 'show';
    },
    showDispatch(order) {
      return (
        order.order_details.order_status === 'pending' &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showReallocateBtn(order) {
      return (
        order.order_details.order_status !== 'pending' &&
        this.permissions.reassign_orders &&
        order.order_details.order_status !== 'delivered' &&
        order.order_details.order_status !== 'cancelled' &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showReturnBtn(order) {
      return (
        order.order_details.order_status !== 'delivered' &&
        order.order_details.order_status !== 'cancelled' &&
        this.userData['admin_type'] !== 1 &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showScheduleBtn(order) {
      return (
        (order.order_details.order_status === 'pending' ||
          order.order_details.order_status === 'confirmed') &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showProximityBtn(order) {
      const resp =
        order.order_details.order_status !== 'pending' &&
        order.order_details.order_status !== 'delivered' &&
        order.order_details.order_status !== 'cancelled' &&
        this.permissions.location_proximity &&
        order.rider_details.vendor_type_id !== 26;
      return resp;
    },
    showAllocateOrdersBtn(order) {
      return (
        order.order_details.order_status === 'pending' &&
        this.permissions.assign_orders &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showMarkInTransitBtn(order) {
      return (
        order.order_details.order_status !== 'delivered' &&
        order.order_details.order_status !== 'cancelled' &&
        order.order_details.order_status !== 'pending' &&
        this.mm === 0 &&
        this.permissions.update_delivery_status &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showCompleteOrderBtn(order) {
      return (
        order.order_details.order_status === 'in transit' &&
        this.permissions.complete_order &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showUploadDnotesBtn(order) {
      return (
        order.order_details.order_status === 'delivered' &&
        this.permissions.upload_dnotes &&
        order.rider_details.vendor_type_id !== 26
      );
    },
    showDeliveryStatusBtn(order) {
      return order.rider_details.vendor_type_id === 26;
    },
    showWeightOfOrderBtn(order) {
      let resp = false;
      if (order.rider_details.vendor_type_id === 26) {
        resp =
          order.order_details.inter_county_order_details.status === 'received';
      }
      return resp;
    },
    showCancellationBtn(order) {
      let resp = false;
      if (order.rider_details.vendor_type_id === 26) {
        if (
          Object.prototype.hasOwnProperty.call(
            order.order_details.inter_county_order_details,
            'cancellable',
          )
        ) {
          resp = order.order_details.inter_county_order_details.cancellable;
        }
      } else if (
        order.order_details.order_status !== 'delivered' &&
        order.order_details.order_status !== 'cancelled' &&
        this.userData['admin_type'] !== 1
      ) {
        resp = true;
      }
      return resp;
    },
  },
};
</script>
<style>
.buttons-tab {
  padding-bottom: 10px;
}
.nav-tabs > li {
  float: left;
  margin-bottom: -1px;
}
.nav > li {
  position: relative;
  display: block;
}
.fa-class {
  padding-right: 2px;
}
.force_blue {
  color: #3c8dbc !important;
  cursor: pointer;
}
.blue-override {
  color: #3c8dbc !important;
}
.vs__dropdown-toggle {
  padding: 6px 4px;
  color: #ccc;
  border: none;
  width: 100%;
}
.vs__dropdown-toggle ::placeholder {
  color: #666;
}
.form-control {
  font-size: 13px;
}
.vs__dropdown-menu {
  border-top: 1px solid #d3d7de;
}
.form-inline .form-control {
  width: 100%;
}
.form-inline .form-group {
  margin-bottom: 15px;
}
.order-input {
  padding: 19px 0.75rem;
}
.activeLink {
  background: #3c8dbc !important;
  cursor: pointer;
  color: white !important;
}
.nav-tabs .nav-item {
  margin-bottom: 15px;
}
</style>
