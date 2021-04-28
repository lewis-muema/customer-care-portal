<template>
  <form @submit.prevent="submitTicket" class="form-inline">
    <div class="form-group col-md-12 ticket-form">
      <div
        v-if="actionErrors.length > 0"
        class="form-group col-md-12 error-holder"
        :class="`alert alert-success alert-${actionClass}`"
        :id="`error_holder`"
      >
        <ul>
          <li v-for="error in actionErrors" :key="error.index">
            <b>{{ error }}</b>
          </li>
        </ul>
      </div>
      <h4>Create a Ticket</h4>
    </div>

    <div class="form-group col-md-6 ticket-field">
      <v-select
        :options="customerInfo"
        :reduce="reason => reason.code"
        name="point"
        label="reason"
        placeholder="Select ticket reason .."
        class="form-control proximity-point ticket-select"
        :id="`reason_${idParam}`"
        v-model="params.reason"
        :class="{
          'is-invalid': submitted && $v.params.reason.$error,
        }"
      >
      </v-select>
      <div
        v-if="submitted && !$v.params.reason.required"
        class="invalid-feedback"
      >
        Ticket reason is required
      </div>
    </div>
    <div class="form-group  col-md-6 ticket-field">
      <input
        type="text"
        v-model="params.department"
        name="department"
        placeholder="department"
        class="form-control order-input"
        readonly
        :class="{
          'is-invalid': submitted && $v.params.department.$error,
        }"
      />
      <div
        v-if="submitted && !$v.params.department.required"
        class="invalid-feedback"
      >
        Ticket department is required
      </div>
    </div>
    <div class="form-group col-md-12 ticket-field">
      <textarea
        type="text"
        v-model="params.message"
        :id="`ticket_message_${idParam}`"
        name="message"
        class="form-control"
        placeholder="Ticket message"
        :class="{
          'is-invalid': submitted && $v.params.message.$error,
        }"
      >
      </textarea>
      <div
        v-if="submitted && !$v.params.message.required"
        class="invalid-feedback"
      >
        Ticket message is required
      </div>
    </div>

    <div class="form-group  col-md-12 ticket-field pull-right btn-holder">
      <button class="btn btn-primary b_middle pull-right" :disabled="loading">
        Create Ticket
        <span v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </div>
  </form>
</template>
<script>
import moment from 'moment';

import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TheUserTicketingComponent',

  props: ['category', 'ticket'],
  data() {
    return {
      actionErrors: [],
      actionClass: '',
      params: {
        reason: '',
        message: '',
        department: 'Customer Support',
      },
      submitted: false,
      loading: false,
    };
  },
  validations: {
    params: {
      reason: { required },
      message: { required },
      department: { required },
    },
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters({
      getActionErrors: 'getActionErrors',
      getActionClass: 'getActionClass',
    }),
    idParam() {
      return this.ticket.id;
    },
  },
  watch: {
    getActionErrors(error) {
      return (this.actionErrors = error);
    },
    getActionClass(action) {
      return (this.actionClass = action);
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      createTicket: 'createTicket',
    }),
    async submitTicket() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.loading = true;
      const notification = [];
      let actionClass = '';
      const department = 2;

      const loggedUser = this.userData.payload.data.name;
      const msg = `${this.params.message} <br /> <code class="pull-right">Raised By : ${loggedUser} from CC Portal</code>`;

      const filteredReason = this.customerInfo.filter(reason => {
        return reason.code === this.params.reason;
      });

      const payload = {
        app: 'STAFF_API',
        endpoint: 'freshdesk/tickets',
        apiKey: false,
        params: {
          name: this.ticket.customer.firstName,
          email: this.ticket.customer.email,
          subject: `${filteredReason[0].reason} - ${this.ticket.title}`,
          description: msg,
          status: 3,
          priority: 1,
          group_id: 67000438215, // customer support group id
          agentEmail: this.userData.payload.data.email,
        },
      };

      try {
        const data = await this.createTicket(payload);
        const errorMsg = data.message;
        if (!data.status && data.data) {
          notification.push(errorMsg);
          const errors = data.data.errors;
          for (let i = 0; i < errors.length; i += 1) {
            notification.push(`${errors[i].field} - ${errors[i].message}`);
          }
        } else {
          notification.push('Ticket created successfully on fresh desk');
        }
        const status = typeof data.status === 'boolean' ? data.status : false;
        actionClass = this.display_order_action_notification(status);
      } catch (error) {
        notification.push(error.response.message);
        actionClass = 'danger';
      }
      this.loading = false;
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
<style scoped>
.loader {
  color: #f8f9fa;
  font-weight: 700;
  font-size: 15px;
}
.form-control {
  margin-bottom: 8px;
  width: 100% !important;
  font-size: 14px !important;
}
.b_middle {
  margin-bottom: 5px;
}
h4 {
  font-size: 17px;
  margin-top: 10px;
}
.ticket-select > .vs__dropdown-toggle {
  border: none !important;
}
.ticket-form {
  justify-content: center;
}
.ticket-field {
  margin-top: 16px;
}
.btn-holder {
  justify-content: flex-end;
}
.error-holder {
  margin-top: 10px;
}
</style>
