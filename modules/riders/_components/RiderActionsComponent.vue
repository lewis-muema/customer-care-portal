<template>
  <div class="body-box user_button_view">
    <div id="tabs" class="container custom_more">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item" v-if="permissions.approve_rider_billing">
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
        <li class="nav-item" v-if="permissions.approve_rider_transaction">
          <a
            class="nav-link action-list repay-loan"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('repayloan', riderID)"
            :id="`repayloan_${riderID}`"
          >
            <span class="fa fa-fw fa-book"></span>
            Repay Loan
          </a>
        </li>
        <li class="nav-item" v-if="permissions.approve_rider_transaction">
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
        <li class="nav-item" v-if="permissions.approve_rider_payment">
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

        <li class="nav-item" v-if="permissions.approve_rider_transaction">
          <a
            class="nav-link action-list new-loan"
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
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('ticket', riderID)"
            :id="`ticket_${riderID}`"
          >
            <span class="fa fa-fw fa-envelope"></span>
            Ticket
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
            <BillRiderComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`repayloan_${riderID}`"
            role="tabpanel"
            v-if="showTab === `repayloan_${riderID}`"
          >
            <RepayLoanComponent :user="user" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`transfer_${riderID}`"
            role="tabpanel"
            v-if="showTab === `transfer_${riderID}`"
          >
            <TransferComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payrider_${riderID}`"
            role="tabpanel"
            v-if="showTab === `payrider_${riderID}`"
          >
            <PayRiderComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`newloan_${riderID}`"
            role="tabpanel"
            v-if="showTab === `newloan_${riderID}`"
          >
            <NewLoanComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`edit_${riderID}`"
            role="tabpanel"
            v-if="showTab === `edit_${riderID}`"
          >
            <EditComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`ticket_${riderID}`"
            role="tabpanel"
            v-if="showTab === `ticket_${riderID}`"
          >
            <TheTicketComponent
              :order="user"
              :category="category"
              :ticket="ticketData"
            />
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
    BillRiderComponent: () => import('./RiderActions/BillRiderComponent'),
    RepayLoanComponent: () => import('./RiderActions/RepayLoanComponent'),
    TransferComponent: () => import('./RiderActions/TransferComponent'),
    PayRiderComponent: () => import('./RiderActions/PayRiderComponent'),
    NewLoanComponent: () => import('./RiderActions/NewLoanComponent'),
    EditComponent: () => import('./RiderActions/EditComponent'),
    TheTicketComponent: () => import('~/components/UI/TheTicketComponent'),
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
      category: 'rider',
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    currency() {
      const currency = this.user.user_details.default_currency
        ? this.user.user_details.default_currency
        : 'KES';
      return currency;
    },
    ticketData() {
      const userName = this.user.rider_name.split(' ');
      const id = this.user.rider_id;
      const userPhone = this.user.phone_no !== '' ? this.user.phone_no : '';

      const data = {
        id,
        title: `${userPhone} ( Rider)`,
        customer: {
          firstName: userName[0],
          lastName: userName.length > 1 ? userName[1] : '. ',
          email: this.user.email === null ? '' : this.user.email,
          phone: userPhone,
        },
      };
      return data;
    },
  },
  mounted() {
    this.riderID = this.user.rider_id;
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
<style>
.fa .fa-fw .fa-book {
  width: 100%;
}
.nav-link .action-list .repay-loan {
  width: max-content;
}
.nav-link .action-list .new-loan {
  width: max-content;
}
</style>
