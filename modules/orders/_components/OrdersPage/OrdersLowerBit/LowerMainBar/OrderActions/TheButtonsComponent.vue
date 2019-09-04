<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
      <li class="nav-item">
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
          order.order_details.delivery_status < 1 &&
            userData.privilege.reassign_orders
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
          order.order_details.delivery_status < 3 &&
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
      <li class="nav-item">
        <a
          class="force_blue"
          data-toggle="tab"
          aria-expanded="false"
          @click="viewTab('schedule', orderNo)"
          :id="`schedule_${orderNo}`"
        >
          <span class="fa fa-fw fa-thumbs-calendar"></span>
          Schedule
        </a>
      </li>
      <li
        class="nav-item"
        v-if="
          order.order_details.delivery_status < 3 &&
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
      <li class="nav-item">
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
      <li class="">
        <a class="force_blue" data-toggle="tab" aria-expanded="false">
          <span class="fa fa-fw fa-rss"></span>
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

      <!------------- closed endpoints ----->
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
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
          :id="`return_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `return_${orderNo}`"
        >
          <TheReturnComponent :order="order" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TheButtonsComponent',
  components: {
    TheDispatchComponent: () => import('./TheDispatchComponent'),
    TheReallocateComponent: () => import('./TheReallocateComponent'),
    TheCancelComponent: () => import('./TheCancelComponent'),
    TheReturnComponent: () => import('./TheReturnComponent'),
  },
  props: {
    order: {
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
    ...mapState(['userData']),
  },
  mounted() {
    this.orderNo = this.order.order_details.order_no;
    this.moreData = this.order.order_details;
  },
  methods: {
    viewTab(tab, orderNo) {
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
  /* text-decoration: none; */
}
/* .space_tab {
  padding: 16px;
} */
.vs__dropdown-toggle {
  padding: 6px 4px !important;
  color: #ccc;
}
.vs__dropdown-toggle ::placeholder {
  /* padding: 6px 4px !important; */
  color: #666;
}
.form-control {
  font-size: 13px;
}
.vs__dropdown-menu {
  border-top: 1px solid #d3d7de;
}
</style>
