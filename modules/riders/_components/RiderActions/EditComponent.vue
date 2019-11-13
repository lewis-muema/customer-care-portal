<template>
  <div>
    <form id="reallocate-form" @submit.prevent="edit" class="form-inline">
      <div class="form-group actions col-md-6">
        <v-select
          :options="suspension"
          :reduce="type => type.code"
          name="type"
          label="type"
          class="form-control select suspension"
          placeholder="Select Status"
          :id="`Status`"
          v-model="Status"
          :class="{
            'is-invalid': submitted && $v.Status.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.Status.required" class="invalid-feedback">
          Suspension Status is required
        </div>
      </div>

      <div class="form-group actions col-md-6">
        <v-select
          :options="dedication"
          :reduce="type => type.code"
          name="type"
          label="type"
          class="form-control select exclusivity"
          placeholder="Select Exclusivity status"
          :id="`Exclusivity`"
          v-model="Exclusivity"
          :class="{
            'is-invalid': submitted && $v.Exclusivity.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.Exclusivity.required"
          class="invalid-feedback"
        >
          Exclusivity status is Required
        </div>
      </div>

      <div class="form-group actions col-md-12">
        <button class="btn btn-primary action-button">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'EditComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      Status: '',
      Exclusivity: '',
      suspension: [
        { code: 2, type: 'Suspend' },
        { code: 0, type: 'Deactivate' },
      ],
      dedication: [{ code: 0, type: 'Open' }, { code: 1, type: 'Dedicated' }],
    };
  },
  validations: {
    Status: { required },
    Exclusivity: { required },
  },
  computed: {
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
      request_payment_methods: 'request_payment_methods',
      perform_user_action: 'perform_user_action',
    }),
    handleError(status, error) {
      const notification = [];
      let actionClass = '';
      if (!status) {
        notification.push(data.error);
        actionClass = this.display_order_action_notification(status);
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },

    async edit() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const riderID = this.user.rider_id;
      const email = this.session.payload.data.email;
      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'sendy/rt_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 2,
          action_data: {
            rider_id: riderID,
            rider_stat: this.Status,
            exclusivity_status: this.Exclusivity,
            action_user: this.actionUser,
          },
          request_id: 208,
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
.rider-input {
  width: 162px;
}
.action-button {
  margin: 15px;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
</style>
