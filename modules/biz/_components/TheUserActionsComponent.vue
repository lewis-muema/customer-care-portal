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
        <li class="nav-item" v-if="permissions.approve_payment_biz">
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
        <li class="nav-item" v-if="setBillingPriviledge()">
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
        <li class="nav-item invoice-item">
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('invoice', copID)"
            :id="`invoice_${copID}`"
          >
            <span class="fa fa-fw fa-users"></span>
            Invoice Receiver
          </a>
        </li>
        <li
          class="nav-item custom-padding hide"
          v-if="permissions.approve_custom_invoice_3"
        >
          <a
            class="nav-link action-list custom-width"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('custom_invoice', copID)"
            :id="`custom_invoice_${copID}`"
          >
            <span class="fa fa-fw fa-file "></span>
            New Invoice
          </a>
        </li>
        <li
          class="nav-item custom-padding hide"
          v-if="permissions.approve_custom_invoice_4"
        >
          <a
            class="nav-link action-list custom-width"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('reverse_invoice', copID)"
            :id="`reverse_invoice_${copID}`"
          >
            <span class="fa fa-fw fa-history "></span>
            Reverse Invoice
          </a>
        </li>
        <li class="nav-item" v-if="permissions.approve_vat_configs_biz">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('vat_config', copID)"
            :id="`vat_config_${copID}`"
          >
            <span class="fa  fa-cogs"></span>
            VAT Config
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('ticket', copID)"
            :id="`ticket_${copID}`"
          >
            <span class="fa fa-fw fa-envelope"></span>
            Create Ticket
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
        <li
          v-if="permissions.approve_offline_orders"
          class="nav-item invoice-item"
        >
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('offline_orders', copID)"
            :id="`offline_orders_${copID}`"
          >
            <span class="fa fa-fw fa-toggle-off"></span>
            Offline Orders
          </a>
        </li>
        <li
          v-if="permissions.approve_tonnage_billing"
          class="nav-item invoice-item"
        >
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('millers_tonnage', copID)"
            :id="`millers_tonnage_${copID}`"
          >
            <span class="fa fa-fw fa-clipboard"></span>
            Millers tonnage
          </a>
        </li>
        <li
          v-if="permissions.freight_actions && activeStatus"
          class="nav-item invoice-item"
        >
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('financing', copID)"
            :id="`financing_${copID}`"
          >
            <span class="fa fa-fw fa-clipboard"></span>
            Financing
          </a>
        </li>
        <li
          v-if="permissions.approve_reversals_biz"
          class="nav-item reversal-item"
        >
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('reversals', copID)"
            :id="`reversals_${copID}`"
          >
            <span class="fa fa-fw fa-clipboard"></span>
            Reversals & Credit Note
          </a>
        </li>
        <li v-if="showFreightApproval" class="nav-item invoice-item">
          <a
            class="nav-link action-list invoice-action"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('freight_status', copID)"
            :id="`freight_status_${copID}`"
          >
            <span class="fa fa-fw fa-toggle-off"></span>
            Freight Status
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
            :id="`ticket_${copID}`"
            role="tabpanel"
            v-if="showTab === `ticket_${copID}`"
          >
            <TheTicketComponent
              :order="user"
              :category="category"
              :ticket="ticketData"
            />
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
            :id="`vat_config_${copID}`"
            role="tabpanel"
            v-if="showTab === `vat_config_${copID}`"
          >
            <TheVATConfigComponent :user="user" :session="userData" />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`custom_invoice_${copID}`"
            role="tabpanel"
            v-if="showTab === `custom_invoice_${copID}`"
          >
            <TheCustomInvoiceComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`reverse_invoice_${copID}`"
            role="tabpanel"
            v-if="showTab === `reverse_invoice_${copID}`"
          >
            <TheReverseInvoiceComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`offline_orders_${copID}`"
            role="tabpanel"
            v-if="showTab === `offline_orders_${copID}`"
          >
            <OfflineOrders
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`millers_tonnage_${copID}`"
            role="tabpanel"
            v-if="showTab === `millers_tonnage_${copID}`"
          >
            <TheMillersTonnageComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`financing_${copID}`"
            role="tabpanel"
            v-if="showTab === `financing_${copID}` && activeStatus"
          >
            <TheFinancingComponent
              :user="user"
              :session="userData"
              :currency="currency"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`reversals_${copID}`"
            role="tabpanel"
            v-if="showTab === `reversals_${copID}`"
          >
            <TheReveralsComponent
              :user="user"
              :session="userData"
              :currency="currency"
              :user-type="category"
              :id="copID"
            />
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`freight_status_${copID}`"
            role="tabpanel"
            v-if="showTab === `freight_status_${copID}`"
          >
            <TheFreightStatusComponent :user="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

export default {
  name: 'TheUserActionsComponent',
  components: {
    TheEditComponent: () => import('./UserActions/TheEditComponent'),
    ThePaymentComponent: () => import('./UserActions/ThePaymentComponent'),
    TheBillingComponent: () => import('./UserActions/TheBillingComponent'),
    TheRiderComponent: () => import('./UserActions/TheRiderComponent'),
    TheInvoiceComponent: () => import('./UserActions/TheInvoiceComponent'),
    TheTicketComponent: () => import('~/components/UI/TheTicketComponent'),
    TheAddNewPricingComponent: () =>
      import('./UserActions/TheAddNewPricingComponent'),
    TheVATConfigComponent: () => import('./UserActions/TheVATConfigComponent'),
    TheCustomInvoiceComponent: () =>
      import('./UserActions/TheCustomInvoiceComponent'),
    TheReverseInvoiceComponent: () =>
      import('./UserActions/TheReverseInvoiceComponent'),
    OfflineOrders: () => import('./UserActions/OfflineOrders'),
    TheMillersTonnageComponent: () =>
      import('./UserActions/TheMillersTonnageComponent'),
    TheFinancingComponent: () => import('./UserActions/AuxilliaryServices'),
    TheReveralsComponent: () =>
      import('../../users/_components/Reversals/TheReveralsComponent'),
    TheFreightStatusComponent: () =>
      import('./UserActions/TheFreightStatusComponent'),
  },
  mixins: [PricingConfigsMxn],
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
      configData: [],
      testAdmin: false,
      category: 'biz',
      distancePricingTableData: [],
      locationPricingTableData: [],
      activeStatus: false,
      freight_status: 0,
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
    ticketData() {
      const userName = this.user.user_details.cop_name;
      const id = this.user.user_details.cop_id;

      const data = {
        id,
        title: `SENDY${id} ( Cop User)`,
        customer: {
          firstName: userName,
          lastName: '.',
          email: this.user.user_details.cop_email,
          phone: this.user.user_details.cop_phone,
        },
      };
      return data;
    },

    showFreightApproval() {
      let resp = false;

      if (this.permissions.approve_freight_biz && this.freight_status >= 1) {
        resp = true;
      }
      return resp;
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
    this.checkFreightStatus();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions(['setCopTypes', 'setAdmins', 'request_user_freight_status']),

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
    setBillingPriviledge() {
      const user = this.user.user_details;
      let approve_billing = false;
      if (user.payment_option === '2') {
        if (this.permissions.approve_postpay_billing) {
          approve_billing = true;
        }
      } else {
        if (this.permissions.approve_prepay_billing_biz) {
          approve_billing = true;
        }
      }
      return approve_billing;
    },
    async checkFreightStatus() {
      const notification = [];
      let actionClass = '';

      const payload = {
        val: `copId=${this.user.user_details.cop_id}`,
      };

      try {
        const data = await this.request_user_freight_status(payload);
        this.freight_status = data.freight_status;
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
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
.invoice-item {
  width: 18%;
}
.invoice-action {
  width: 98% !important;
}
.custom-padding {
  padding-right: 3px !important;
}
.custom-width {
  width: 100% !important;
}
.reversal-item {
  width: 24%;
}
</style>
