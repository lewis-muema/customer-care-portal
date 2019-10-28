<template>
  <div id="tabs" class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          :id="`info${riderID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="viewTab('info', riderID)"
          >Info</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`statement_${riderID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('statement', riderID)"
          >Statement</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`savings_${riderID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('savings', riderID)"
          >Savings</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :id="`loans_${riderID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('loans', riderID)"
          >Loans</a
        >
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="body-box">
        <div
          :class="`tab-pane fade ${firstShow} ${firstActive}`"
          :id="`info_${riderID}`"
          role="tabpanel"
          v-if="showTab === `info_${riderID}`"
        >
          <InfoComponent :user="user" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`statement_${riderID}`"
          role="tabpanel"
          v-if="showTab === `statement_${riderID}`"
        >
          <StatementComponent :user="user" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`savings_${riderID}`"
          role="tabpanel"
          v-if="showTab === `savings_${riderID}`"
        >
          <SavingsComponent :user="user" />
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`loans_${riderID}`"
          role="tabpanel"
          v-if="showTab === `loans_${riderID}`"
        >
          <LoansComponent :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RiderDetailsComponent',
  components: {
    InfoComponent: () => import('./RiderTabs/InfoComponent'),
    StatementComponent: () => import('./RiderTabs/StatementComponent'),
    SavingsComponent: () => import('./RiderTabs/SavingsComponent'),
    LoansComponent: () => import('./RiderTabs/LoansComponent'),
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
      riderID: null,
      showTab: `info_${this.user.rider_id}`,
      deliveryList: null,
      payments: null,
      riderDetails: null,
    };
  },

  mounted() {
    this.firstShow = 'show';
    this.firstActive = 'active';
    this.riderID = this.user.rider_id;
    this.deliveryList = this.user.delivery_detail;
  },
  methods: {
    viewTab(tab, riderID) {
      this.showTab = `${tab}_${riderID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
