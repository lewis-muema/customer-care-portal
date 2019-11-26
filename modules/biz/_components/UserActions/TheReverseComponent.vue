<template>
  <div class="">
    <div
      class="process-request"
      v-if="process_request"
      :class="{ success: isActive, error: hasError }"
    >
      <p>
        {{ response_handler }}
      </p>
    </div>
    <form
      id="reallocate-form"
      @submit.prevent="submitReversal"
      class="form-inline col-md-12"
    >
      <div class="form-group  col-md-4 user-input actions_content--align">
        <label class="reverse">Order Number / Transaction ID</label>

        <input
          type="text"
          v-model="refNo"
          name="refNo"
          :id="`refNo`"
          placeholder="Reference No"
          class="form-control revrse-input"
          :class="{
            'is-invalid': submitted && $v.refNo.$error,
          }"
        />
        <div v-if="submitted && !$v.refNo.required" class="invalid-feedback">
          Transaction ID is required
        </div>
      </div>
      <div class="form-group  col-md-12" style="padding-left: 0px;">
        <button class="btn btn-primary action-button transfer-button ">
          Reverse Transaction
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheReverseComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      refNo: '',
      submitted: false,
      process_request: false,
      response_handler: 'Processing your request ...',
      isActive: true,
      hasError: false,
      submitted: false,
    };
  },
  validations: {
    refNo: { required },
  },
  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  methods: {
    ...mapActions({
      perform_user_action: 'perform_user_action',
    }),
    async submitReversal() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.process_request = true;
      this.notificationHandler(true, false, 'Processing your request ...');

      const copID = this.user.user_details.cop_id;
      const user_id = 0;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 22,
          action_data: {
            cop_id: copID,
            user_id,
            pay_reference: this.refNo,
            action_user: this.actionUser,
          },
          request_id: 1611,
          action_user: this.actionUser,
        },
      };

      try {
        const data = await this.perform_user_action(payload);
        this.notificationHandler(false, true, data.reason);
        if (data.status) {
          this.notificationHandler(true, false, data.reason);
        }
      } catch (error) {
        const msg = 'Something went wrong. Try again or contact Tech Support';
        this.notificationHandler(false, true, msg);
      }
    },
    notificationHandler(active, error, message) {
      this.isActive = active;
      this.hasError = error;
      this.response_handler = message;
    },
  },
};
</script>
<style scoped>
.form-inline .form-control {
  width: 82%;
  border-radius: 0.25rem;
}
.reverse {
  width: 100%;
  margin-left: -15px;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.revrse-input {
  margin-left: -15px;
}
.user-input {
  margin-bottom: 15px;
}
.reverse-button {
  width: 18% !important;
}
.actions_content--align {
  margin-bottom: 17px !important;
  margin-right: 6% !important;
  width: 56%;
  max-width: 100%;
}
.process-request {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 3px;
  margin-left: 2%;
  color: white;
  width: 90%;
}
.invalid-feedback {
  font-size: 14px !important;
}
.success {
  border-color: #3c8dbc;
  background-color: #3c8dbc !important;
}
.error {
  background-color: #dd4b39 !important;
  border-color: #dd4b39 !important;
}
</style>
