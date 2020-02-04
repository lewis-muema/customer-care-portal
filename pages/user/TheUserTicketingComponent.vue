<template>
  <form @submit.prevent="submitTicket" class="form-inline">
    <div class="form-group col-md-12">
      <h4>Add Ticket</h4>
    </div>
    <div
      v-if="actionErrors.length > 0"
      :class="`alert alert-${actionClass}`"
      :id="`error_holder`"
    >
      <ul>
        <li v-for="error in actionErrors" :key="error.index">
          <b>{{ error }}</b>
        </li>
      </ul>
    </div>

    <div class="form-group col-md-6">
      <v-select
        :options="customerInfo"
        :reduce="reason => reason.code"
        name="point"
        label="reason"
        placeholder="Select ticket reason .."
        class="form-control proximity-point"
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
    <div class="form-group  col-md-6">
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
    <div class="form-group col-md-12">
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

    <div class="form-group  col-md-12">
      <button class="btn btn-primary action-button b_middle">
        Ticket
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

  props: {
    category: {
      type: String,
      required: true,
    },
    ticket: {
      type: Object,
      required: true,
    },
  },
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
    }),
    ...mapActions({
      create_ticket: 'create_ticket',
    }),
    async submitTicket() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loading = true;
      const notification = [];
      const actionClass = '';
      const department = 2;

      const loggedUser = this.userData.payload.data.name;
      const msg = `${this.params.message} <br /> <code class="pull-right">Created By : ${loggedUser}</code>`;

      const payload = {
        subject: `${this.params.reason} - ${this.ticket.title}`,
        mailboxId: 43421,
        mailboxname: 'Support',
        isDraft: false,
        type: 'phone',
        status: 'active',
        customer: this.ticket.customer,
        threads: [
          {
            type: 'phone',
            to: [],
            cc: [],
            bcc: [],
            attachments: [],
            status: 'active',
            customer: {
              email: this.ticket.customer.email,
            },
            text: msg,
          },
        ],
      };
      const data = await this.create_ticket(payload);
      this.loading = false;
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
}
.b_middle {
  margin-bottom: 5px;
}
h4 {
  font-size: 14px;
}
.vs__dropdown-toggle {
  border: none !important;
}
</style>
