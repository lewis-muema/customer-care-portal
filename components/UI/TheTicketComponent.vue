<template>
  <div>
    <form @submit.prevent="submitTicket" class="form-inline">
      <div class="form-group col-md-6">
        <label for="contact">Contact</label>
        <input
          type="text"
          class="form-control form-control-contact"
          id="contact"
          v-model="params.contact"
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
        <span v-if="isBusinessUnitSelected">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
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
        <span v-if="isUserJourneySelected">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
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
          placeholder=".."
          :class="{
            'is-invalid': submitted && $v.params.orderNo.$error,
          }"
        />
        <div
          v-if="submitted && !$v.params.orderNo.required"
          class="invalid-feedback"
        >
          OrderNo is required
        </div>
      </div>
      <div class="w-100"></div>
      <div class="form-group col-md-6">
        <label for="priority">Priority</label>
        <v-select
          :options="priority"
          :reduce="label => label.id"
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
        <span v-if="isUserGroupSelected">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
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
      <div class="form-group col-md-6"></div>
      <div class="form-group col-md-6">
        <div class="">
          <button
            type="button"
            class="btn btn-default btn-cancel"
            @click="clearInputs()"
          >
            Cancel
          </button>
        </div>
        <button class="btn btn-primary  ml-3 " :disabled="loading">
          Create Ticket
        </button>
      </div>
    </form>
    <TicketSubmitModal
      :dialog-visible="showSubmittedModal"
      :ticket-source="params.source"
      @close="showSubmittedModal = false"
    />
  </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';

import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

import TheTicketForm from '~/components/UI/TheTicketComponent';

export default {
  name: 'TheTicketComponent',
  components: {
    TicketSubmitModal: () =>
      import('../../pages/user/TheTicketSubmitModalComponent.vue'),
  },
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
        orderNo: '',
        priority: '',
        status: '',
        group: '',
        businessUnit: '',
        userJourney: '',
        agent: '',
      },
      submitted: false,
      loading: false,
      disabled: false,
      showDialog: false,
      isBusinessUnitSelected: false,
      isUserJourneySelected: false,
      isUserGroupSelected: false,
      showSubmittedModal: false,
      ticketType: [],
      priority: [],
      status: [],
      agents: [],
      issues: [],
      userJourneys: [],
      userAgents: [],
      businessUnits: [],
      userGroups: [],
      ticketFields: ['ticket_type', 'priority', 'status'],
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
    this.ticketFields.forEach(ticketField => {
      this.fetchTicketFields(`${ticketField}`);
    });
    this.fetchUserGroups();
    this.fetchBusinessUnits();
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters(['getSession']),
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
      user_groups: 'fetch_ticket_user_groups',
      fetch_business_units: 'fetch_ticket_business_units',
    }),
    clearInputs() {
      this.params.subject = '';
      this.params.description = '';
      this.params.businessUnit = '';
      this.params.userJourney = '';
      this.params.issue = '';
      this.params.type = '';
      this.params.orderNo = '';
      this.params.priority = '';
      this.params.status = '';
      this.params.group = '';
      this.params.agent = '';
    },
    async fetchUserGroups() {
      let data = await this.user_groups();
      const userGroups = data['data'];
      this.userGroups = userGroups;
    },
    async fetchTicketFields(field) {
      let data = await this.fetch_ticket_fields(field);
      const ticketFieldsData = data['data'];
      switch (field) {
        case 'ticket_type':
          this.ticketType = ticketFieldsData;
          break;
        case 'priority':
          this.priority = ticketFieldsData;
          break;
        case 'status':
          this.status = ticketFieldsData;
          break;
        default:
      }
    },
    async changedBusinesssUnit(event) {
      this.isBusinessUnitSelected = true;
      let data = await this.fetch_business_units();
      const businessUnits = data['data'];
      businessUnits.forEach(businessUnit => {
        if (businessUnit.label === event) {
          this.userJourneys = businessUnit.user_journeys;
          this.isBusinessUnitSelected = false;
        }
      });
    },
    async changedUserGroup(event) {
      this.isUserGroupSelected = true;
      let data = await this.user_groups();
      const userGroups = data['data'];
      userGroups.forEach(userGroup => {
        if (userGroup.id === event) {
          this.userAgents = userGroup.agents;
          this.isUserGroupSelected = false;
        }
      });
    },
    async changedUserJourney(event) {
      this.isUserJourneySelected = true;
      let data = await this.fetch_business_units();
      const businessUnits = data['data'];
      businessUnits.forEach(businessUnit => {
        businessUnit.user_journeys.forEach(userJourney => {
          if (userJourney.label === event) {
            this.issues = userJourney.issues;
            this.isUserJourneySelected = false;
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
          priority: this.params.priority,
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
        const data = await this.createTicket(payload);
        const errorMsg = data.message;
        if (!data.status && data.data) {
          notification.push(errorMsg);
          const errors = data.data.errors;
          for (let i = 0; i < errors.length; i += 1) {
            notification.push(`${errors[i].field} - ${errors[i].message}`);
          }
        } else {
          this.showSubmittedModal = true;
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

.sub-text {
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  color: #000000;
}
.primary-blue {
  width: 100%;
  color: white;
  background: #324ba8;
}
.btn-primary {
  background: #324ba8 !important;
}
.btn-cancel {
  margin-left: 160px !important;
}
.loader {
  color: #324ba8;
  font-weight: 700;
  font-size: 15px;
}
</style>
