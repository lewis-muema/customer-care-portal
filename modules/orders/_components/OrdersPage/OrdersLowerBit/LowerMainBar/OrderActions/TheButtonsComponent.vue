<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
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
      <li class="nav-item">
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
      <li class="nav-item">
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
      <li class="nav-item">
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
          <TheDispatchComponent />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`reallocate_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `reallocate_${orderNo}`"
        >
          <TheReallocateComponent />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`cancel_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `cancel_${orderNo}`"
        >
          <TheCancelComponent />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`return_${orderNo}`"
          role="tabpanel"
          v-if="showTab === `return_${orderNo}`"
        >
          <TheReturnComponent />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
    };
  },
  mounted() {
    this.orderNo = this.order.order_details.order_no;
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
<style scoped>
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
a:not([href]):not([tabindex]) {
  color: #3c8dbc;
  cursor: pointer;
  /* text-decoration: none; */
}
</style>
