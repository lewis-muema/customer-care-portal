<template>
  <form @submit.prevent="submitTicket" class="form-inline">
    <!-- <div class="form-group col-md-6">
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
    </div> -->
    <!-- <div class="form-group col-md-6">
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
    </div> -->
    <!-- <div class="form-group col-md-12">
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
    </div> -->

    <div class="form-group col-md-6">
      <label for="contact">Contact</label>
      <input
        type="text"
        class="form-control"
        id="contact"
        v-model="params.contact"
        placeholder="name@example.com"
        :class="{
          'is-invalid': submitted && $v.params.contact.$error,
        }"
        readonly
      />
      <div
        v-if="submitted && !$v.params.message.required"
        class="invalid-feedback"
      >
        contact is required
      </div>
    </div>

    <div class="form-group col-md-12">
      <label for="subject">Subject</label>
      <input
        type="text"
        class="form-control"
        id="subject"
        v-model="params.subject"
        :class="{
          'is-invalid': submitted && $v.params.subject.$error,
        }"
      />
      <div
        v-if="submitted && !$v.params.message.required"
        class="invalid-feedback"
      >
        Ticket subject is required
      </div>
    </div>
    <div class="form-group col-md-12">
      <label for="description">Description</label>
      <textarea
        class="form-control"
        id="description"
        v-model="params.description"
        rows="3"
      ></textarea>
    </div>
    <div class="form-group col-md-6">
      <label for="businessunit">Business Unit</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Business unit .."
        class="form-control proximity-point"
        v-model="params.businessUnit"
        :class="{
          'is-invalid': submitted && $v.params.businessUnit.$error,
        }"
      >
        <div
          v-if="submitted && !$v.businessUnit.required"
          class="invalid-feedback"
        >
          Business Unit is required
        </div>
      </v-select>
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6">
      <label for="userjourney">User Journey</label>
      <v-select
        :options="userJourneys"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select User Journey."
        class="form-control proximity-point"
        v-model="params.businessUnit"
        :class="{
          'is-invalid': submitted && $v.params.userJourney.$error,
        }"
      >
        <div
          v-if="submitted && !$v.userJourney.required"
          class="invalid-feedback"
        >
          User Journey is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="userjourney">Issue</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select User Journey."
        class="form-control proximity-point"
        v-model="params.issue"
        :class="{
          'is-invalid': submitted && $v.params.issue.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.issue.required"
          class="invalid-feedback"
        >
          Issue is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="type">Type</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Ticket type ."
        class="form-control proximity-point"
        v-model="params.type"
        :class="{
          'is-invalid': submitted && $v.params.type.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.type.required"
          class="invalid-feedback"
        >
          Type is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="source">Source</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Ticket source."
        class="form-control proximity-point"
        v-model="params.source"
        :class="{
          'is-invalid': submitted && $v.params.source.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.source.required"
          class="invalid-feedback"
        >
          Ticket source is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="contact">Order Number</label>
      <input
        type="text"
        v-model="params.orderNo"
        class="form-control"
        id="order"
        placeholder="ABFVH89-67"
        readonly
      />
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6">
      <label for="priority">Priority</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Priority ."
        class="form-control proximity-point"
        v-model="params.priority"
        :class="{
          'is-invalid': submitted && $v.params.priority.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.priority.required"
          class="invalid-feedback"
        >
          Ticket Priority is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="status">Status</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Status ."
        class="form-control proximity-point"
        v-model="params.status"
        :class="{
          'is-invalid': submitted && $v.params.status.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.status.required"
          class="invalid-feedback"
        >
          Ticket status is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="group">Group</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select Group ."
        class="form-control proximity-point"
        v-model="params.group"
        :class="{
          'is-invalid': submitted && $v.params.group.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.group.required"
          class="invalid-feedback"
        >
          Ticket Group is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="agent">Agent</label>
      <v-select
        :options="businessUnits"
        :reduce="name => name.value"
        name="name"
        label="name"
        placeholder="Select the Agent ."
        class="form-control proximity-point"
        v-model="params.agent"
        :class="{
          'is-invalid': submitted && $v.params.agent.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.agent.required"
          class="invalid-feedback"
        >
          Agent is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-12">
      <label for="contact">Tags</label>
      <input
        type="text"
        v-model="params.tags"
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
        businessUnit: '',
        userJourney: '',
      },
      submitted: false,
      loading: false,
      businessUnits: [
        { value: 1, name: 'TRANSPORT - PARTNER' },
        { value: 2, name: 'TRANSPORT - CLIENT' },
        { value: 3, name: 'SENDY SUPPLY - SELLER' },
        { value: 3, name: 'SENDY SUPPLY - BUYER' },
      ],
      userJourneys: [
        { value: 1, name: 'Non-journey' },
        { value: 2, name: 'Account Sign In' },
      ],
    };
  },
  validations: {
    params: {
      reason: { required },
      message: { required },
      department: { required },
    },
  },
  mounted() {
    this.fetch_ticket_fields('fsffds');
    this.user_groups();
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
      fetch_ticket_fields: 'fetch_ticket_fields',
      user_groups: 'user_groups',
    }),

    // async fetchTicketFields(field) {
    //   try {
    //     this.$store.dispatch('fetch_ticket_fields', field);
    //   } catch (error) {}
    // },
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
