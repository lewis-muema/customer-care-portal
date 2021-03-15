<template>
  <div>
    <div
      v-if="errorMsg !== ''"
      class="alert alert-msg"
      :class="actionClass === 'success' ? 'resolve-alert' : 'error-alert'"
    >
      <i
        v-if="actionClass === 'success'"
        class="fa fa-check-circle"
        aria-hidden="true"
      ></i>
      <i v-else class="fa fa-ban" aria-hidden="true"></i>
      {{ errorMsg }}
    </div>
    <SearchAdmin @adminData="searchedAdmin" v-if="action !== 'resolve'" />
    <div v-if="searched" class="col-md-10 offset-md-1 admin-holder search-text">
      Searching staff...
      <i class="fa fa-spinner fa-spin loader"></i>
    </div>
    <div class="col-md-10 offset-md-1 row admin-holder" v-if="admin !== null">
      <div class="col-md-8">
        <div class="admin-name">{{ admin.name }}</div>
        <div class="admin-email">{{ admin.email }}</div>
      </div>
      <div class="col-md-4">
        <div class="radio-holder">
          <input
            type="radio"
            class="actions__radio-button"
            :value="1"
            checked
          />
        </div>
      </div>
    </div>
    <div class="form-group reason-holder" v-if="action === 'reassign'">
      <label class="reason">Enter the reason for reassigning this order</label>
      <textarea
        type="text"
        v-model="reason"
        name="reason"
        class="form-control coupon-reason"
        placeholder="Enter Reason"
      >
      </textarea>
    </div>
    <div class="form-group" v-if="action === 'resolve'">
      <div>
        Are you sure you want to mark this order as resolved?
      </div>
    </div>
    <div class="row text-center actions-holder">
      <a
        class="cancel-button close resolve-close"
        data-dismiss="modal"
        aria-label="Close"
        @click="cancel()"
        v-if="action === 'resolve'"
      >
        NO, Take me back
      </a>
      <a
        class="cancel-button close"
        data-dismiss="modal"
        aria-label="Close"
        @click="cancel()"
        v-else
      >
        Cancel
      </a>
      <button
        v-if="action === 'assign'"
        class="btn btn-primary submit-btn"
        @click="assign()"
      >
        Assign
      </button>
      <button
        v-if="action === 'reassign'"
        class="btn btn-primary submit-btn"
        @click="assign()"
      >
        Confirm
      </button>
      <button
        v-if="action === 'resolve'"
        class="btn btn-primary submit-btn"
        @click="assign()"
      >
        YES, Mark as resolved
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'AssignOrder',
  components: {
    SearchAdmin: () => import('./SearchAdmin'),
  },
  props: ['action', 'alert'],
  data() {
    return {
      reason: '',
      adminID: null,
      admin: null,
      helpscoutUserID: null,
      submitted: false,
      errorMsg: '',
      searched: false,
      typingState: false,
      cancelEvent: false,
      actionClass: '',
      notification: [],
    };
  },
  computed: {
    ...mapState(['actionErrors', 'userData']),
    ...mapGetters(['getAdmins', 'getSearchState', 'getTypingState']),

    params() {
      const data = {
        message: this.alert.alert_type,
        reason: 'Live Operations',
      };
      return data;
    },
    ticket() {
      const userName = this.alert !== null ? this.alert.customer_name : '';
      const length = 39;
      const trimmedName = userName.substring(0, length);
      const email = 'customersupport@sendyit.com';
      const phone = this.alert !== null ? this.alert.customer_phone : '';

      const data = {
        id: this.alert !== null ? this.alert.id : null,
        title: this.alert !== null ? this.alert.order_no : '',
        customer: {
          firstName: trimmedName,
          lastName: '.',
          email: email.trim(),
          phone,
        },
      };
      return data;
    },
  },
  watch: {
    getSearchState(status) {
      this.searched = status;
    },
    getTypingState(status) {
      this.admin = null;
      this.typingState = status;
    },
    action(data) {
      this.cancel();
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      updateSearchState: 'setSearchState',
      updateLiveRefresh: 'setLiveOpsRefresh',
    }),
    ...mapActions([
      'getHelpscoutUser',
      'assignAlert',
      'create_ticket',
      'reAssignTicket',
    ]),
    async searchedAdmin(adminData) {
      this.adminID = adminData.admin_id;
      this.helpscoutUserID = await this.retrieveHelpscoutUser(adminData.email);
      this.updateSearchState(false);
      this.updateLiveRefresh(true);
      return (this.admin = adminData);
    },
    async retrieveHelpscoutUser(email) {
      const payload = {
        email,
      };
      try {
        const response = await this.getHelpscoutUser(payload);
        // eslint-disable-next-line prettier/prettier
        const data = response.status === 200 ? response.data._embedded.users : null;
        return data.length === 0 ? null : data[0].id;
      } catch (error) {
        return error;
      }
    },
    // eslint-disable-next-line require-await
    async assign() {
      this.submitted = true;
      const alertID = this.alert.id;
      const payload = {
        app: 'STAFF_API',
        endpoint: `live-ops/orders/${alertID}`,
        apiKey: false,
        params: {
          assignee: this.adminID,
          staffEmail: this.userData.payload.data.email,
          adminID: this.userData.payload.data.admin_id,
          staffName: this.userData.payload.data.name,
          app: 'CC Portal',
          ...(this.action === 'reassign' && { reason: this.reason }),
          ...(this.action === 'resolve' && { status: 1 }),
        },
      };

      try {
        const data = await this.assignAlert(payload);
        this.notification.push(data.message);
        this.errorMsg = data.message;
        this.actionClass = this.display_order_action_notification(data.status);

        switch (this.action) {
          case 'assign':
            this.submitTicket();
            break;
          case 'reassign':
            if (this.alert.helpscout_ticket !== null) {
              this.updateTicket();
            }
            break;
          default:
            break;
        }
        this.submitted = false;
      } catch (error) {
        this.errorMsg = error.response.message;
        notification.push(error.response.message);
        this.submitted = false;
        return error;
      }
    },
    async updateTicket() {
      const payload = {
        op: 'replace',
        path: '/assignTo',
        value: this.helpscoutUserID,
        conversationID: this.alert.helpscout_ticket,
      };
      try {
        const response = await this.reAssignTicket(payload);
        this.$router.go(this.$router.currentRoute);

        return response;
      } catch (error) {
        return error;
      }
    },
    async submitTicket() {
      this.helpscoutUserID = await this.retrieveHelpscoutUser(this.admin.email);

      const notification = [];
      const actionClass = '';
      const department = 2;

      const loggedUser = this.userData.payload.data.name;
      const msg = `${this.params.message} <br /> <code class="pull-right">Assigned By : ${loggedUser}</code>`;

      const payload = {
        subject: `${this.params.reason} - ${this.ticket.title}`,
        mailboxId: 43421,
        assignTo: this.helpscoutUserID,
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
      const helpscoutTicketID = data.headers['resource-id'];

      await this.updateHelpscouteTicket(helpscoutTicketID);
      this.loading = false;
      this.$router.go(this.$router.currentRoute);
    },
    cancel() {
      this.updateErrors([]);
      this.errorMsg = '';
      this.cancelEvent = true;
      this.$emit('cancelEvent', this.cancelEvent);
      this.cancelEvent = false;
    },
    async updateHelpscouteTicket(ticketID) {
      const payload = {
        app: 'STAFF_API',
        endpoint: `live-ops/orders/${this.alert.id}`,
        apiKey: false,
        params: {
          helpscoutTicket: ticketID,
          staffEmail: this.userData.payload.data.email,
          adminID: this.userData.payload.data.admin_id,
          staffName: this.userData.payload.data.name,
          app: 'CC Portal',
        },
      };
      try {
        const data = await this.assignAlert(payload);
        return data;
      } catch (error) {
        return error;
      }
    },
  },
};
</script>

<style>
.cancel-button {
  width: auto;
  margin-right: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.5px;
  color: #527cbd;
  cursor: pointer;
}
.submit-btn {
  background: #527cbd;
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.actions-holder {
  justify-content: center;
  margin-top: 2em;
}
.admin-holder {
  padding-top: 2em;
}
.admin-name {
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.02em;
  color: #303133;
  text-transform: capitalize;
}
.admin-email {
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.03em;
  color: #606266;
}
.radio-holder {
  padding-left: 10px;
  padding-right: 0px;
  text-align: right;
}
.actions__radio-button {
  width: 22px;
  height: 30px;
  cursor: pointer;
}
.reason-holder {
  margin-top: 2em;
}
.search-text {
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #3c8dbc;
}
.cancel-button {
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.5px;
  color: #527cbd !important;
}
</style>
