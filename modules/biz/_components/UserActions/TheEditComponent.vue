<template>
  <div>
    <form id="reallocate-form" @submit.prevent="editUser" class="form-inline">
      <div class="form-group  col-md-6">
        <label>Approval Status</label>
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
      <div class="form-group  col-md-6">
        <label>Payment Option</label>
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
      <div class="form-group  col-md-6">
        <label>Company Type</label>
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
      <div class="form-group  col-md-6">
        <label>Account Manager</label>
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
        <div v-if="submitted && !$v.admin.required" class="invalid-feedback">
          Account Manager is required
        </div>
      </div>
      <div class="form-group  col-md-6">
        <label>Rider Allocation</label>
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
      <div class="form-group  col-md-6">
        <label>Credit Period</label>
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
        <div v-if="submitted && !$v.period.required" class="invalid-feedback">
          Credit Period is required
        </div>
      </div>
      <div class="form-group  col-md-6">
        <label>Company Category</label>
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
        <div v-if="submitted && !$v.category.required" class="invalid-feedback">
          Company Category is required
        </div>
      </div>
      <div class="form-group  col-md-12">
        <button class="btn btn-primary action-button">
          Process
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
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
      approveStatus: '',
      payOption: '',
      companyType: '',
      admin: '',
      riderType: '',
      category: '',
      period: '',
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
        {
          cop_type_id: 8,
          name: 'Communications',
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
        {
          admin_id: 8,
          name: 'Denis Gachoki',
          admin_type: '0',
          email: 'don@sendyit.com',
        },
      ],
    };
  },

  computed: {
    companyTypeData() {
      const state = this.user.user_details.cop_type_name;
      const arr = this.copTypeList;
      return arr.filter(c => c.name.indexOf(state) > -1);
    },
    canEditPayMethod() {
      const option = this.user.user_details.payment_option;
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
    manager() {
      const manager = this.user.user_details.account_manager;
      const state = manager;
      return state;
    },
    adminData() {
      const state = this.manager;
      const arr = this.adminList;
      return arr.filter(c => c.name.indexOf(state) > -1);
    },
    adminList() {
      return this.user.admin_list ? this.user.admin_list : this.admin_list;
    },
    copTypeList() {
      const list = this.cop_type_list;
      return list.length === 0 ? this.cop_type_list : list;
    },
    riderAllocation() {
      const riderAllocation = [
        { code: '1', type: 'Dedicated Riders' },
        { code: '0', type: 'All Riders' },
      ];
      return riderAllocation;
    },
    creditPeriod() {
      const creditPeriod = [
        { code: '15', name: '15 Days' },
        { code: '30', name: '30 Days' },
        { code: '45', name: '45 Days' },
      ];
      return creditPeriod;
    },
    periodData() {
      const state = this.user.user_details.credit_period;
      const arr = this.creditPeriod;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    canEditPeriod() {
      const option = this.payOption;
      let disabled = false;
      if (!this.permissions['approve_postpay']) {
        disabled = true;
      }
      return disabled;
    },

    approvalStatus() {
      const approvalStatus = [
        { code: '1', status: 'Approve' },
        { code: '2', status: 'Suspend' },
      ];
      return approvalStatus;
    },
    companyCategory() {
      const companyCategory = [
        { code: '1', name: 'Merchant' },
        { code: '2', name: 'Enterprise' },
      ];
      return companyCategory;
    },
    categoryData() {
      const state = this.user.user_details.cop_category;
      const arr = this.companyCategory;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    riderTypeData() {
      const state = this.user.user_details.strict_allocation;
      const arr = this.riderAllocation;
      return arr.filter(c => c.code.indexOf(state) > -1);
    },
    approval() {
      const state = this.user.user_details.approved;
      const arr = this.approvalStatus;
      const returned = arr.filter(c => c.code.indexOf(state) > -1);
      return returned[0];
    },
    payOptions() {
      const payOptions = [
        { code: '1', option: 'Prepay' },
        { code: '2', option: 'Postpay' },
      ];
      return payOptions;
    },
    paymentOption() {
      const state = this.user.user_details.payment_option;
      const arr = this.payOptions;
      const returned = arr.filter(c => c.code.indexOf(state) > -1);
      return returned;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  watch: {
    approveStatus() {
      this.approveStatus = this.approveStatus;
    },
    payOption() {
      this.payOption = this.payOption;
    },
    companyType() {
      this.companyType = this.companyType;
    },
    admin() {
      this.admin = this.admin;
    },
    riderType() {
      this.riderType = this.riderType;
    },
    category() {
      this.category = this.category;
    },
    period() {
      this.period = this.period;
    },
  },
  mounted() {
    this.approveStatus = this.approval.status;
    this.payOption = this.paymentOption[0].option;
    this.companyType = this.companyTypeData[0].name;
    this.admin = this.adminData[0].name;
    this.riderType = this.riderTypeData[0].type;
    this.category = this.categoryData[0].name;
    this.period = this.periodData[0].name;
  },
  validations: {
    approveStatus: { required },
    payOption: { required },
    companyType: { required },
    admin: { required },
    riderType: { required },
    category: { required },
    period: { required },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      perform_user_action: 'perform_user_action',
    }),
    async editUser() {
      const notification = [];
      let actionClass = '';
      const copID = this.user.user_details.cop_id;

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // eslint-disable-next-line no-restricted-globals
      const status = isNaN(Number(this.approveStatus))
        ? this.user.user_details.approved
        : this.approveStatus;
      // eslint-disable-next-line no-restricted-globals
      const type = isNaN(Number(this.companyType))
        ? this.cop_type_list.filter(
            c => c.name.indexOf(this.user.user_details.cop_type_name) > -1,
          )[0].cop_type_id
        : this.companyType;
      // eslint-disable-next-line no-restricted-globals
      const option = isNaN(Number(this.payOption))
        ? this.user.user_details.payment_option
        : this.payOption;
      // eslint-disable-next-line no-restricted-globals
      const admin = isNaN(Number(this.admin))
        ? this.admin_list.filter(
            c => c.name.indexOf(this.user.user_details.account_manager) > -1,
          )[0].admin_id
        : this.admin;
      // eslint-disable-next-line no-restricted-globals
      const rider = isNaN(Number(this.riderType))
        ? this.user.user_details.strict_allocation
        : this.riderType;
      // eslint-disable-next-line no-restricted-globals
      const period = isNaN(Number(this.period))
        ? this.user.user_details.credit_period
        : this.period;
      // eslint-disable-next-line no-restricted-globals
      const category = isNaN(Number(this.category))
        ? this.user.user_details.cop_category
        : this.category;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 11,
          action_data: {
            approve_status: status,
            cop_id: copID,

            cop_type_id: type,
            payment_option: option,
            admin_id: admin,
            strict_allocation: rider,
            credit_period: period,
            cop_category: category,
            sales_agent: 0,
          },
          request_id: `19`,
          action_user: this.actionUser,
        },
      };
      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          this.updateSuccess(true);
        }
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
<style scoped>
.form-control {
  width: 100%;
  padding: 0.375rem 0;
}
.form-inline .form-group {
  padding-top: 23px;
}
</style>
