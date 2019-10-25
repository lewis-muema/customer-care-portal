<template>
  <div>
    <form id="reallocate-form" @submit.prevent="submit" class="form-inline">
      <div class="form-group  col-md-6">
        <input
          type="text"
          v-model="recepient"
          name="recepient"
          placeholder="Invoice Recipient Name"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.recepient.$error,
          }"
        />
        <div
          v-if="submitted && !$v.recepient.required"
          class="invalid-feedback"
        >
          Invoice Recepient Name is required
        </div>
      </div>
      <div class="form-group  col-md-6">
        <input
          type="text"
          v-model="email"
          name="email"
          placeholder="Invoice Recipient Email"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.email.$error,
          }"
        />
        <div v-if="submitted && !$v.email.required" class="invalid-feedback">
          Invoice Recepient Email is required
        </div>
      </div>
      <div class="form-group  col-md-6 actions status">
        <v-select
          :options="invoiceStatus"
          :reduce="status => status.code"
          name="status"
          label="status"
          class="form-control select"
          placeholder="Select Status.."
          :id="`status`"
          v-model="status"
          :class="{
            'is-invalid': submitted && $v.status.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.status.required" class="invalid-feedback">
          Invoice Status is required
        </div>
      </div>
      <div class="col-md-6">
        <button class="btn btn-primary action-button invoice-button">
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
  name: 'TheInvoiceComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      recepient: '',
      email: '',
      status: '',
      invoiceStatus: [
        { code: 'false', status: 'Activate' },
        { code: 'true', status: 'Deactivate' },
      ],
    };
  },
  validations: {
    recepient: { required },
    email: { required },
    status: { required },
  },
  computed: {
    copID() {
      return this.user.user_details.cop_id;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
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
    async submit() {
      const notification = [];
      let actionClass = '';
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
          action_id: 19,
          action_data: {
            name: this.recepient,
            cop_id: this.copID,
            email: this.email,
            remove: this.status,
          },
          request_id: 18,
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
.form-inline .form-control {
  width: 100%;
}
.status {
  margin-top: 16px;
}
.invoice-button {
  width: 100%;
  margin-top: 23px;
}
</style>
