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
        readonly
      />
      <div
        v-if="submitted && !$v.params.contact.required"
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
      <div class="invalid-feedback">
        <span v-if="!$v.params.subject.required">
          Ticket subject is required
        </span>
      </div>
    </div>
    <div class="form-group col-md-12">
      <label for="description">Description</label>
      <textarea
        class="form-control"
        id="description"
        v-model="params.description"
        rows="3"
        :class="{
          'is-invalid': submitted && $v.params.description.$error,
        }"
      ></textarea>
      <div class="invalid-feedback">
        <span v-if="!$v.params.description.required">
          Ticket description is required
        </span>
      </div>
    </div>
    <div class="form-group col-md-6">
      <label for="businessunit">Business Unit</label>
      <v-select
        :options="businessUnits"
        :reduce="label => label.label"
        label="label"
        placeholder=".."
        class="form-control proximity-point"
        v-model="params.businessUnit"
        @input="changedBusinesssUnit"
        :class="{
          'is-invalid': submitted && $v.params.businessUnit.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.businessUnit.required"
          class="invalid-feedback"
        >
          Business Unit is required
        </div>
      </v-select>
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6" v-if="params.businessUnit">
      <label for="userjourney">User Journey</label>
      <v-select
        :options="userJourneys"
        :reduce="label => label.label"
        label="label"
        placeholder=".."
        class="form-control proximity-point"
        v-model="params.userJourney"
        @input="changedUserJourney"
        :class="{
          'is-invalid': submitted && $v.params.userJourney.$error,
        }"
      >
        <div
          v-if="submitted && !$v.params.userJourney.required"
          class="invalid-feedback"
        >
          User Journey is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6" v-if="params.userJourney">
      <label for="userjourney">Issue</label>
      <v-select
        :options="issues"
        :reduce="label => label.label"
        label="label"
        placeholder=".."
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
        :options="ticketType"
        :reduce="label => label.label"
        label="label"
        placeholder=".."
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
          Ticket Type is required
        </div>
      </v-select>
    </div>
    <div class="form-group col-md-6">
      <label for="source">Source</label>
      <input
        type="text"
        v-model="params.source"
        class="form-control"
        id="source"
        readonly
      />
    </div>
    <div class="form-group col-md-6">
      <label for="contact">Order Number</label>
      <input
        type="text"
        v-model="params.orderNo"
        class="form-control"
        id="order"
        readonly
      />
    </div>
    <div class="w-100"></div>
    <div class="form-group col-md-6">
      <label for="priority">Priority</label>
      <v-select
        :options="priority"
        :reduce="label => label.label"
        label="label"
        placeholder=".."
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
        :options="status"
        :reduce="label => label.id"
        name="label"
        placeholder=".."
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
        :options="userGroups"
        :reduce="name => name.id"
        label="name"
        placeholder=".."
        class="form-control proximity-point"
        v-model="params.group"
        @input="changedUserGroup"
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
        :options="userAgents"
        :reduce="name => name.id"
        label="name"
        placeholder=".."
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
    <div class="form-group">
      <button class="btn btn-primary action-button" :disabled="loading">
        Create Ticket
        <span v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </div>
    {{ params }}
    {{ getName }}
  </form>
</template>
<script>
/* eslint-disable */
import moment from 'moment';

import { required, minLength } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

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
        contact: this.ticket.customer.firstName,
        subject: '',
        description: '',
        type: '',
        source: 'CC PORTAL',
        orderNo: this.order.order_details.order_no,
        priority: '',
        status: '',
        group: '',
        businessUnit: '',
        userJourney: '',
        agent: this.$store.getters.getSession.payload.data.name,
      },
      submitted: false,
      loading: false,
      ticketType: [],
      priority: [],
      status: [],
      agents: [],
      issues: [],
      userJourneys: [],
      userAgents: [],
      businessUnits: [],
      userGroups: [],
    };
  },
  validations: {
    params: {
      contact: { required },
      subject: { required },
      description: { required },
      issue: { required },
      type: { required },
      source: { required },
      orderNo: { required },
      priority: { required },
      status: { required },
      group: { required },
      agent: { required },
      businessUnit: { required },
      userJourney: { required },
    },
  },
  mounted() {
    this.fetchTicketFields('ticket_type');
    this.fetchTicketFields('priority');
    this.fetchTicketFields('status');
    this.fetchUserGroups();
    this.fetchBusinessUnits();
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters(['getSession']),
    idParam() {
      return this.ticket.id;
    },
    getName() {
      return this.ticket.customer.email;
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
      user_groups: 'fetch_ticket_user_groups',
      fetch_business_units: 'fetch_ticket_business_units',
    }),
    async fetchUserGroups() {
      let data = await this.user_groups();
      const userGroups = data['data'];
      this.userGroups = userGroups;
    },
    async fetchTicketFields(field) {
      let data = await this.fetch_ticket_fields(field);
      const ticketFields = data['data'];
      switch (field) {
        case 'ticket_type':
          this.ticketType = ticketFields;
          break;
        case 'priority':
          this.priority = ticketFields;
          break;
        case 'status':
          this.status = ticketFields;
          break;
        default:
      }
    },
    async changedBusinesssUnit(event) {
      let data = await this.fetch_business_units();
      const businessUnits = data['data'];
      businessUnits.forEach(businessUnit => {
        console.log(event);
        if (businessUnit.label === event) {
          this.userJourneys = businessUnit.user_journeys;
        }
      });
    },
    async changedUserGroup(event) {
      let data = await this.user_groups();
      const userGroups = data['data'];
      userGroups.forEach(userGroup => {
        if (userGroup.id === event) {
          this.userAgents = userGroup.agents;
        }
      });
    },
    async changedUserJourney(event) {
      let data = await this.fetch_business_units();
      const businessUnits = data['data'];
      businessUnits.forEach(businessUnit => {
        businessUnit.user_journeys.forEach(userJourney => {
          if (userJourney.label === event) {
            this.issues = userJourney.issues;
          }
        });
      });
    },
    async fetchBusinessUnits() {
      let data = await this.fetch_business_units();
      const businessUnits = data['data'];
      this.businessUnits = businessUnits;
    },
    async submitTicket() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loading = true;
      const notification = [];
      let actionClass = '';
      // const department = 2;

      // const loggedUser = this.userData.payload.data.name;
      // const msg = `${this.params.message} <br /> <code class="pull-right">Raised By : ${loggedUser} from CC Portal</code>`;
      const msg = 'Your ticket has been created successfully'

      // const filteredReason = this.customerInfo.filter(reason => {
      //   return reason.code === this.params.reason;
      // });

      const payload = {
        app: 'STAFF_API',
        endpoint: 'freshdesk/tickets',
        apiKey: false,
        params: {
          name: this.params.contact,
          subject: this.params.subject,
          description: this.params.description,
          status: this.params.status,
          type: this.params.type,
          priority: 2,
          responder_id: this.params.agent,
          email: this.ticket.customer.email,
          group_id: this.params.group,
          source: 114,
          custom_fields: {
            cf_business_unit870537: this.params.businessUnit,
            cf_user_journey793335: this.params.userJourney,
            cf_issue690783: this.params.issue,
            cf_order_number: this.params.orderNo,
          },
        },
      };

      try {
        console.log('here', payload);
        const data = await this.createTicket(payload);
        console.log(data.data);
        console.log('ticket created successfullyççç');
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
