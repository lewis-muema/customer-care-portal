<template>
  <div class="body-box user_button_view_peer">
    <div id="tabs" class="container custom_more">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item" v-if="permissions.approve_payment">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('payment', userID)"
            :id="`payment_${userID}`"
          >
            <span class="fa fa-fw fa-ruble"></span>
            Payment
          </a>
        </li>
        <li class="nav-item" v-if="permissions.approve_prepay_billing">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('bill', userID)"
            :id="`bill_${userID}`"
          >
            <span class="fa fa-fw fa-bitcoin"></span>
            Bill
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('ticket', userID)"
            :id="`ticket_${userID}`"
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
            :id="`error_holder_${userID}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error.index">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payment_${userID}`"
            role="tabpanel"
            v-if="showTab === `payment_${userID}`"
          >
            <ThePaymentComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`bill_${userID}`"
            role="tabpanel"
            v-if="showTab === `bill_${userID}`"
          >
            <TheBillingComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active} col-md-10`"
            :id="`ticket_${userID}`"
            role="tabpanel"
            v-if="showTab === `ticket_${userID}`"
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
  name: 'TheUserActionsComponent',
  components: {
    ThePaymentComponent: () => import('./UserActions/ThePaymentComponent'),
    TheBillingComponent: () => import('./UserActions/TheBillingComponent'),
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
      userID: null,
      showTab: null,
      show: false,
      active: false,
      category: 'peer',
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
      const userName = this.user.user_details.user_name;

      const id = this.user.user_details.user_id;
      const userPhone =
        this.user.user_details.user_phone !== ''
          ? this.user.user_details.user_phone
          : '';

      const data = {
        id,
        title: `${userPhone} ( Peer User)`,
        customer: {
          firstName: userName,
          lastName: '.',
          email: this.user.user_details.user_email,
          phone: this.user.user_details.user_phone,
        },
      };
      return data;
    },
  },
  mounted() {
    this.clearErrorMessages();
    this.userID = this.user.user_details.user_id;
  },
  methods: {
    viewTab(tab, userID) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${userID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
<style>
.user_button_view_peer {
  min-height: 10px;
  padding: 0px 0px 9px 0px;
  background: #f9f9f9;
}
.buttons-tab {
  padding: 10px;
}
.actions .v-select .vs__dropdown-menu {
  margin-right: 16px;
  width: 100%;
  top: calc(100% - -3px);
}
.actions .v-select {
  margin-left: 0;
  border: none;
  padding: 0;
}

.user-table tr:hover {
  background: none !important;
}
.user-table td {
  border: none;
}
.input-group-area {
  width: 86%;
  border-radius: 0 0.25rem 0.25rem 0;
}
.input-group-icon {
  padding: 9px 12px;
  border-radius: 0.25rem 0 0 0.25rem;
}
.table td {
  padding: 0 5px;
}
.input-group .invalid-feedback {
  border: none;
}
</style>
