<template>
  <form @submit.prevent="submitTicket" class="form-inline">
    <div class="form-group col-md-6">
      <v-select
        v-if="
          order.order_details !== undefined &&
            order.order_details.order_no !==
              order.order_details.parent_order_no &&
            Object.prototype.hasOwnProperty.call(order, 'freight_details') &&
            order.freight_details
        "
        :options="freightReallocationInfo"
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
      <v-select
        v-else
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

    <div class="form-group">
      <button class="btn btn-primary action-button">
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
import { mapState, mapActions, mapMutations } from 'vuex';

import TheTicketForm from '~/components/UI/TheTicketComponent';

export default {
  name: 'TheTicketComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
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
    idParam() {
      return this.ticket.id;
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
</style>
