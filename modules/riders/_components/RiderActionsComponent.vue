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
        <li class="nav-item" v-if="hasTransactionPermissions()">
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
        <li class="nav-item" v-if="hasTransactionPermissions()">
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

        <li class="nav-item" v-if="hasTransactionPermissions()">
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
        <li class="nav-item" v-if="hasTransactionPermissions()">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('top_up', riderID)"
            :id="`top_up_${riderID}`"
          >
            <span class="fa fa-fw fa-money"></span>
            Top Up
          </a>
        </li>
        <li class="nav-item" v-if="unblockPermission()">
          <a
            class="nav-link action-list dispatch-tab"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('unblockdispatch', riderID)"
            :id="`unblockdispatch_${riderID}`"
          >
            <span class="fa fa-fw fa-unlock"></span>
            Unblock Rider
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
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`top_up_${riderID}`"
            role="tabpanel"
            v-if="showTab === `top_up_${riderID}`"
          >
            <TopUpComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`unblockdispatch_${riderID}`"
            role="tabpanel"
            v-if="showTab === `unblockdispatch_${riderID}`"
          >
            <UnblockRiderComponent :user="user" :session="userData" />
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
    TopUpComponent: () => import('./RiderActions/TopUpComponent'),
    UnblockRiderComponent: () => import('./RiderActions/UnblockRiderComponent'),
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
      const splitName = this.user.rider_name.split(' ');
      const split_SName = splitName.length > 1 ? splitName[1] : null;
      const f_name = this.user.rider_name;
      const s_name = this.user.s_name;
      const id = this.user.rider_id;
      const userPhone = this.user.phone_no !== '' ? this.user.phone_no : '';

      const data = {
        id,
        title: `${userPhone} ( Rider)`,
        customer: {
          firstName: s_name.length > 1 ? f_name : splitName[0],
          lastName: s_name.length > 1 ? s_name : split_SName || '. ',
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
    unblockPermission() {
      let state = false;

      if (this.user.rider_stat === 3 && this.permissions.unblock_rider) {
        state = true;
      }
      return state;
    },

    hasTransactionPermissions() {
      const privileges = JSON.parse(this.userData.payload.data.privilege);
      if (
        Object.prototype.hasOwnProperty.call(
          privileges,
          'approve_rider_transaction',
        ) &&
        (privileges.approve_rider_transaction ||
          privileges.approve_rider_transaction_1 ||
          privileges.approve_rider_transaction_2 ||
          privileges.approve_rider_transaction_3)
      ) {
        return true;
      }
      return false;
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
.dispatch-tab {
  width: 100% !important;
}
</style>
