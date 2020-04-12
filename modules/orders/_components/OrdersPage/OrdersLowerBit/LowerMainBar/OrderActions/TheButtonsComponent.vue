<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
      <li
        class="nav-item"
        v-if="order.order_details.order_status === 'pending'"
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('dispatch', orderNo)"
          :id="`dispatch_${orderNo}`"
        >
          <span class="fa fa-fw fa-wifi"></span>
          Dispatch
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status !== 'pending' &&
            permissions.reassign_orders &&
            order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'cancelled'
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('reallocate', orderNo)"
          :id="`reallocate_${orderNo}`"
        >
          <span class="fa fa-fw fa-link"></span>
          Re-Allocate
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'cancelled' &&
            userData['admin_type'] !== 1
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('cancel', orderNo)"
          :id="`cancel_${orderNo}`"
        >
          <span class="fa fa-fw fa-thumbs-down"></span>
          Cancel
        </a>
      </li>
      <li
        class="nav-item"
        v-if="order.order_details.order_status === 'pending'"
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('schedule', orderNo)"
          :id="`schedule_${orderNo}`"
        >
          <span class="fa fa-fw fa-calendar"></span>
          Schedule
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'cancelled' &&
            userData['admin_type'] !== 1
        "
      >
        <a
          class="force_blue"
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
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('sms', orderNo)"
          :id="`sms_${orderNo}`"
        >
          <span class="fa fa-fw fa-paste"></span>
          Sms Link
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status !== 'pending' &&
            order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'cancelled' &&
            permissions.location_proximity
        "
      >
        <a
          class="force_blue"
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
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('ticket', orderNo)"
          :id="`ticket_${orderNo}`"
        >
          <span class="fa fa-fw fa-envelope"></span>
          Ticket
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
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('tracker', orderNo)"
          :id="`tracker__${orderNo}`"
        >
          <span class="fa fa-fw fa-map-marker"></span>
          GPS-Tracker
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.order_status === 'pending' &&
            permissions.assign_orders
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded=" false"
          @click="viewTab('allocate', orderNo)"
          :id="`allocate__${orderNo}`"
        >
          <span class="fa fa-cloud-upload"></span>
          Allocate Orders
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          isTruck &&
            order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'cancelled' &&
            order.order_details.order_status !== 'pending' &&
            mm === 0 &&
            permissions.update_delivery_status
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('mark_in_transit', orderNo)"
          :id="`mark_in_transit_${orderNo}`"
        >
          <span class="fa fa-fw fa-truck"></span>
          Mark in Transit
        </a>
      </li>

      <li
        class="nav-item"
        v-if="
          order.order_details.order_status === 'in transit' &&
            permissions.complete_order
        "
      >
        <a
          class="force_blue"
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
          order.order_details.order_status !== 'delivered' &&
            order.order_details.order_status !== 'pending' &&
            order.order_details.order_status !== 'cancelled' &&
            permissions.freight_actions &&
            (order.rider_details.vendor_type_id === 20 ||
              order.rider_details.vendor_type_id === 25)
        "
      >
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('auxilliary_services', orderNo)"
          :id="`auxilliary_services_${orderNo}`"
        >
          <span class="fa fa-fw fa-check-square"></span>
          Finances
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
          <TheCancelComponent :order="order" />
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
          <TheReturnComponent :order="order" :rates="rates" />
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
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

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
</style>
