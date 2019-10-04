<template>
  <div class="body-box user_button_view">
    <div id="tabs" class="container custom_more">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('billrider', riderID)"
            :id="`billrider_${riderID}`"
          >
            <span class="fa fa-fw fa-dollar"></span>
            Bill Rider
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('repayloan', riderID)"
            :id="`repayloan_${riderID}`"
          >
            <span class="fa fa-fw fa-book"></span>
            Repay Loan
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('transfer', riderID)"
            :id="`transfer_${riderID}`"
          >
            <span class="fa fa-fw fa-exchange"></span>
            Transfer
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('payrider', riderID)"
            :id="`payrider_${riderID}`"
          >
            <span class="fa fa-fw fa-bank"></span>
            Pay Rider
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('newloan', riderID)"
            :id="`newloan_${riderID}`"
          >
            <span class="fa fa-fw fa-book"></span>
            New Loan
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('edit', riderID)"
            :id="`edit_${riderID}`"
          >
            <span class="fa fa-fw fa-edit"></span>
            Edit
          </a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="body-box">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
            :id="`error_holder_${riderID}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`billrider_${riderID}`"
            role="tabpanel"
            v-if="showTab === `billrider_${riderID}`"
          >
            <PaymentsComponent :user="riderID" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`repayloan_${riderID}`"
            role="tabpanel"
            v-if="showTab === `repayloan_${riderID}`"
          >
            <LoansComponent :user="riderID" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`transfer_${riderID}`"
            role="tabpanel"
            v-if="showTab === `transfer_${riderID}`"
          >
            <PaymentsComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payrider_${riderID}`"
            role="tabpanel"
            v-if="showTab === `payrider_${riderID}`"
          >
            <PaymentsComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`newloan_${riderID}`"
            role="tabpanel"
            v-if="showTab === `newloan_${riderID}`"
          >
            <LoansComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`edit_${riderID}`"
            role="tabpanel"
            v-if="showTab === `edit_${riderID}`"
          >
            <EditComponent :user="user" :session="userData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'RiderActionsComponent',
  components: {
    LoansComponent: () => import('./RiderActions/LoansComponent'),
    EditComponent: () => import('./RiderActions/EditComponent'),
    PaymentsComponent: () => import('./RiderActions/PaymentsComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      riderID: null,
      showTab: null,
      show: false,
      active: false,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
  },
  mounted() {
    this.riderID = this.riders_data.rider_id;
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

    viewTab(tab, riderID) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${riderID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
