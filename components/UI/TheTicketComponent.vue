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

    <div class="form-group col-md-6">
      <label for="contact">Contact</label>
      <input
        type="text"
        class="form-control"
        id="contact"
        placeholder="name@example.com"
        readonly
      />
    </div>

    <div class="form-group col-md-12">
      <label for="subject">Subject</label>
      <input type="text" class="form-control" id="subject" />
    </div>
    <div class="form-group col-md-12">
      <label for="description">Description</label>
      <textarea class="form-control" id="description" rows="3"></textarea>
    </div>
    <div class="form-group col-md-6">
      <label for="businessunit">Business Unit</label>
      <select class="form-control" id="businessunit">
        <option>TRANSPORT - CLIENT</option>
      </select>
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6">
      <label for="userjourney">User Journey</label>
      <select class="form-control" id="userjourney">
        <option>Goods Dropoff</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="issue">Issue</label>
      <select class="form-control" id="issue">
        <option>D note Inquiry</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="type">Type</label>
      <select class="form-control" id="type">
        <option>4W</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="source">Source</label>
      <select class="form-control" id="source">
        <option>CC PORTAL</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="contact">Order Number</label>
      <input
        type="text"
        class="form-control"
        id="order"
        placeholder="ABFVH89-67"
        readonly
      />
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6">
      <label for="priority">Priority</label>
      <select class="form-control" id="priority">
        <option>High</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="status">Status</label>
      <select class="form-control" id="status">
        <option>Open</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="group">Group</label>
      <select class="form-control" id="group">
        <option>Customer Support</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="agent">Agent</label>
      <select class="form-control" id="agent">
        <option>Dorcas Cherono</option>
      </select>
    </div>
    <div class="form-group col-md-12">
      <label for="contact">Tags</label>
      <input
        type="text"
        class="form-control"
        id="tags"
        placeholder="ABFVH89-67"
      />
    </div>
    <div class="form-group">
      <button class="btn btn-primary action-button" :disabled="loading">
        Create Ticket
        <span v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </div>
  </form>
</template>
<script>
/* eslint-disable */
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
          status: 3, // pending status
          priority: 1, // low priority
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
.form-control[readonly] {
  background-color: #e9ecef !important;
  opacity: 1;
}
</style>
