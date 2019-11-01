<template>
  <div>
    <form id="reallocate-form" @submit.prevent="edit" class="form-inline">
      <div class="form-group col-md-6">
        <select
          name="suspension"
          id="suspension"
          class="form-control proximity point"
        >
          <option :value="1"> Suspend </option>
          <option :value="2"> Deactivate </option>
        </select>
      </div>

      <div class="form-group actions col-md-6">
        <select
          name="exclusitivity"
          id="exclusitivity"
          class="form-control rider-input"
        >
          <option :value="1"> Dedicated</option>
          <option :value="2"> Open </option>
        </select>
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
    return {};
  },
  computed: {
    currency() {
      const currency = this.user.payments.default_currency
        ? this.user.payments.default_currency
        : 'KES';
      return currency;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
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
      const riderID = this.user.payments.rider_id;
      const userID = 0;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 2,
          action_data: {
            rider_id: riderID,
            rider_stat: stat,
            exclusivity_status: strict_allocation,
          },
          request_id: 208,
          action_user: user,
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
  width: 100%;
}
.action-button {
  margin-top: 15px;
}
</style>
