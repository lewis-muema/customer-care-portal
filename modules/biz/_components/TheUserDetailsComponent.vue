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
          :id="`users_${copID}`"
          data-toggle="tab"
          role="tab"
          aria-selected="false"
          @click="viewTab('users', copID)"
          >Users</a
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
          deliveries
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`statement_${copID}`"
          role="tabpanel"
          v-if="showTab === `statement_${copID}`"
        >
          statement
        </div>
        <div
          :class="`tab-pane fade ${show} ${active}`"
          :id="`riders_${copID}`"
          role="tabpanel"
          v-if="showTab === `riders_${copID}`"
        >
          riders
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
          :id="`invoice_${copID}`"
          role="tabpanel"
          v-if="showTab === `invoice_${copID}`"
        >
          invoice_
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheUserDetailsComponent',
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
    };
  },
  mounted() {
    this.firstShow = 'show';
    this.firstActive = 'active';
    this.copID = this.user.user_details.cop_id;
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
