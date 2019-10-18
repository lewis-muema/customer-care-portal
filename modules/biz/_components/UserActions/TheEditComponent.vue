<template>
  <div>
    <form id="edit-form" @submit.prevent="editUser">
      <table class="table user-table">
        <tr>
          <td width="50%">
            <div class="form-group actions">
              <span>Approval Status</span>

              <v-select
                :options="approvalStatus"
                :reduce="status => status.code"
                name="status"
                label="status"
                class="form-control select"
                :id="`status`"
                v-model="approveStatus"
                :class="{
                  'is-invalid': submitted && $v.approveStatus.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.approveStatus.required"
                class="invalid-feedback"
              >
                Approval Status is required
              </div>
            </div>
          </td>
          <td width="50%">
            <div class="form-group actions">
              <span>Payment Option</span>

              <v-select
                :options="payOptions"
                :reduce="option => option.code"
                name="option"
                label="option"
                class="form-control select"
                :id="`option`"
                v-model="payOption"
                :disabled="canEditPayMethod"
                :class="{
                  'is-invalid': submitted && $v.payOption.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.payOption.required"
                class="invalid-feedback"
              >
                Payment option is required
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <div class="form-group actions">
              <span>Company Type</span>

              <v-select
                :options="copTypeList"
                :reduce="name => name.cop_type_id"
                name="name"
                label="name"
                class="form-control select"
                :id="`companyType`"
                v-model="companyType"
                :class="{
                  'is-invalid': submitted && $v.companyType.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.companyType.required"
                class="invalid-feedback"
              >
                Company Type is required
              </div>
            </div>
          </td>
          <td width="50%">
            <div class="form-group actions">
              <span>Account Manager</span>

              <v-select
                :options="adminList"
                :reduce="name => name.admin_id"
                name="name"
                label="name"
                class="form-control select"
                :id="`admin`"
                v-model="admin"
                :disabled="canChangeManager"
                :class="{
                  'is-invalid': submitted && $v.admin.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.admin.required"
                class="invalid-feedback"
              >
                Account Manager is required
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <div class="form-group actions">
              <span>Rider Allocation</span>

              <v-select
                :options="riderAllocation"
                :reduce="type => type.code"
                name="type"
                label="type"
                class="form-control select"
                :id="`riderType`"
                v-model="riderType"
                :class="{
                  'is-invalid': submitted && $v.riderType.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.riderType.required"
                class="invalid-feedback"
              >
                Rider Allocation is required
              </div>
            </div>
          </td>
          <td width="50%" v-if="payOption === 2">
            <div class="form-group actions">
              <span>Credit Period</span>

              <v-select
                :options="creditPeriod"
                :reduce="name => name.code"
                name="name"
                label="name"
                class="form-control select"
                :id="`creditPeriod`"
                v-model="period"
                :disabled="canEditPeriod"
                :class="{
                  'is-invalid': submitted && $v.period.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.period.required"
                class="invalid-feedback"
              >
                Credit Period is required
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <div class="form-group actions">
              <span>Sales Ops Agent</span>

              <v-select
                :options="salesOps"
                :reduce="name => name.admin_id"
                name="name"
                label="name"
                class="form-control select"
                :id="`riderType`"
                v-model="riderType"
                :class="{
                  'is-invalid': submitted && $v.riderType.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.riderType.required"
                class="invalid-feedback"
              >
                Rider Allocation is required
              </div>
            </div>
          </td>
          <td width="50%">
            <div class="form-group actions">
              <span>Company Category</span>

              <v-select
                :options="companyCategory"
                :reduce="name => name.code"
                name="name"
                label="name"
                class="form-control select"
                :id="`category`"
                v-model="category"
                :class="{
                  'is-invalid': submitted && $v.category.$error,
                }"
              >
              </v-select>
              <div
                v-if="submitted && !$v.category.required"
                class="invalid-feedback"
              >
                Company Category is required
              </div>
            </div>
          </td>
        </tr>
      </table>

      <button class="btn btn-primary action-button">
        Proceess
      </button>
    </form>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheEditComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      paymentMethods: null,
      submitted: false,

      approvalStatus: [
        { code: '1', status: 'Approve' },
        { code: '2', status: 'Suspend' },
      ],
      riderAllocation: [
        { code: '1', type: 'Dedicated Riders' },
        { code: '0', type: 'All Riders' },
      ],
      creditPeriod: [
        { code: '15', name: '15 Days' },
        { code: '30', name: '30 Days' },
        { code: '45', name: '45 Days' },
      ],
      payOptions: [
        { code: '1', option: 'Prepay' },
        { code: '2', option: 'Postpay' },
      ],
      companyCategory: [
        { code: '0', name: 'Merchant' },
        { code: '1', name: 'Enterprise' },
      ],
      salesOps: [],
      cop_type_list: [
        {
          cop_type_id: 1,
          name: 'Ecommerce',
        },
        {
          cop_type_id: 2,
          name: 'Legal',
        },
        {
          cop_type_id: 3,
          name: 'Hospitality',
        },
        {
          cop_type_id: 4,
          name: 'Insurance',
        },
        {
          cop_type_id: 5,
          name: 'Construction',
        },
        {
          cop_type_id: 6,
          name: 'Health Care',
        },
        {
          cop_type_id: 7,
          name: 'Grocery',
        },
      ],
      admin_list: [
        {
          admin_id: 0,
          name: 'Marketing',
          admin_type: '0',
          email: 'marketing@sendyit.com',
        },
        {
          admin_id: 1,
          name: 'Evanson KB',
          admin_type: '0',
          email: 'ebiwott@sendyit.com',
        },
        {
          admin_id: 2,
          name: 'Don',
          admin_type: '0',
          email: 'don@sendyit.com',
        },
      ],
    };
  },
  validations: {
    approveStatus: { required },
    payOption: { required },
    companyType: { required },
    riderType: { required },
    admin: { required },
    period: { required },
    category: { required },
  },
  computed: {
    canEditPayMethod() {
      const option = this.payOption;
      let disabled = false;
      if (!this.permissions['approve_postpay'] && option === 1) {
        disabled = true;
      }
      return disabled;
    },
    canChangeManager() {
      const option = this.manager;
      let disabled = false;
      if (!this.permissions['change_account_manager']) {
        disabled = true;
      }
      return disabled;
    },
    canEditPeriod() {
      const option = this.payOption;
      let disabled = false;
      if (!this.permissions['approve_postpay']) {
        disabled = true;
      }
      return disabled;
    },
    copTypeList() {
      const list = this.user.cop_type_list;
      return list.length === 0 ? this.cop_type_list : list;
    },
    adminList() {
      return this.user.admin_list ? this.user.admin_list : this.admin_list;
    },
    approveStatus() {
      const status = this.user.user_details.approved;
      const state = typeof status === 'undefined' ? 1 : status;
      const arr = this.approvalStatus;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    payOption() {
      const option = this.user.user_details.payment_option;
      const state = typeof option === 'undefined' ? 2 : option;
      return state;
    },
    paymentOption() {
      const state = this.payOption;
      const arr = this.payOptions;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    companyType() {
      const type = this.user.user_details.cop_type_name;
      const state = typeof type === 'undefined' ? 'Insurance' : type;
      const arr = this.copTypeList;
      return arr.filter(c => c.name.indexOf(state) > -1);
    },
    manager() {
      const manager = this.user.user_details.account_manager;
      const state = typeof manager === 'undefined' ? 'Marketing' : manager;
      return state;
    },
    admin() {
      const state = this.manager;
      const arr = this.adminList;
      return arr.filter(c => c.name.indexOf(state) > -1);
    },
    riderType() {
      const allocation = this.user.user_details.strict_allocation;
      const state = typeof allocation === 'undefined' ? 0 : allocation;
      const arr = this.riderAllocation;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    period() {
      const p = this.user.user_details.credit_period;
      const state = typeof period === 'undefined' ? 15 : period;
      const arr = this.creditPeriod;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    category() {
      const category = this.user.user_details.cop_category;
      const state = typeof category === 'undefined' ? 1 : category;
      const arr = this.companyCategory;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  methods: {
    editUser() {
      const notification = [];
      const actionClass = '';
      const copID = this.user.user_details.cop_id;

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 11,
          action_data: {
            approve_status: this.approveStatus,
            cop_id: copID,

            cop_type_id: this.companyType,
            payment_option: this.payOption,
            admin_id: this.admin,
            strict_allocation: riderType,
            credit_period: this.period,
            cop_category: this.category,
            sales_agent: 0,
          },
          request_id: `19`,
          action_user: this.actionUser,
        },
      };
    },
  },
};
</script>
