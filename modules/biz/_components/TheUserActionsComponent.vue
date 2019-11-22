<template>
  <div class="body-box user_button_view">
    <div id="tabs" class="container custom_more">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('edit', copID)"
            :id="`edit_${copID}`"
          >
            <span class="fa fa-fw  fa-pencil"></span>
            Edit
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('payment', copID)"
            :id="`payment_${copID}`"
          >
            <span class="fa fa-fw fa-ruble"></span>
            Payment
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('billing', copID)"
            :id="`billing_${copID}`"
          >
            <span class="fa fa-fw fa-btc"></span>
            Bill
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('rider', copID)"
            :id="`rider_${copID}`"
          >
            <span class="fa fa-fw fa-list-alt"></span>
            Rider
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('invoice', copID)"
            :id="`invoice_${copID}`"
          >
            <span class="fa fa-fw fa-usd"></span>
            Invoice
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('pricing', copID)"
            :id="`pricing_${copID}`"
          >
            <span class="fa fa-fw fa-gbp"></span>
            Pricing
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('approval', copID)"
            :id="`approval_${copID}`"
          >
            <span class="fa fa-fw fa-check"></span>
            Approvals
          </a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="body-box">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
            :id="`error_holder_${copID}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`edit_${copID}`"
            role="tabpanel"
            v-if="showTab === `edit_${copID}`"
          >
            <TheEditComponent
              :user="user"
              :permissions="permissions"
              :categories="cop_type_list"
              :admins="admin_list"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payment_${copID}`"
            role="tabpanel"
            v-if="showTab === `payment_${copID}`"
          >
            <ThePaymentComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`billing_${copID}`"
            role="tabpanel"
            v-if="showTab === `billing_${copID}`"
          >
            <TheBillingComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`rider_${copID}`"
            role="tabpanel"
            v-if="showTab === `rider_${copID}`"
          >
            <TheRiderComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`invoice_${copID}`"
            role="tabpanel"
            v-if="showTab === `invoice_${copID}`"
          >
            <TheInvoiceComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`pricing_${copID}`"
            role="tabpanel"
            v-if="showTab === `pricing_${copID}`"
          >
            <TheAddNewPricingComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`approval_${copID}`"
            role="tabpanel"
            v-if="showTab === `approval_${copID}`"
          >
            <ThePricingApprovalComponent :user="user" :session="userData" />
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
    TheEditComponent: () => import('./UserActions/TheEditComponent'),
    ThePaymentComponent: () => import('./UserActions/ThePaymentComponent'),
    TheBillingComponent: () => import('./UserActions/TheBillingComponent'),
    TheRiderComponent: () => import('./UserActions/TheRiderComponent'),
    TheAddNewPricingComponent: () =>
      import('./UserActions/TheAddNewPricingComponent'),
    ThePricingApprovalComponent: () =>
      import('./UserActions/ThePricingApprovalComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      copID: null,
      showTab: null,
      show: false,
      active: false,
      cop_type_list: [],
      admin_list: [],
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
    ...mapGetters(['getCopTypes', 'getAdmins']),

    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    currency() {
      const currency = this.user.user_details.default_currency
        ? this.user.user_details.default_currency
        : 'KES';
      return currency;
    },
  },
  watch: {
    getCopTypes(types) {
      return (this.cop_type_list = types);
    },
    getAdmins(admins) {
      return (this.admin_list = admins);
    },
  },
  async mounted() {
    this.copID = this.user.user_details.cop_id;
    await this.setCopTypes();
    await this.setAdmins();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions(['setCopTypes', 'setAdmins']),

    clearErrorMessages() {
      const notification = [];
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    viewTab(tab, copID) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${copID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
<style>
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
  width: 85%;
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
.user-search {
  padding: 0;
}
</style>
