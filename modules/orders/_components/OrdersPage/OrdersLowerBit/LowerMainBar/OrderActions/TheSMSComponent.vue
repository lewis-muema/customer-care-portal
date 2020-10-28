<template>
  <span>
    <div>
      If the order has been delivered the client will be asked to rate the
      order.
    </div>
    <br />
    <form @submit.prevent="sendSMS" class="form-group">
      <div class="form-group">
        <input
          type="text"
          v-model="phone"
          :id="`phone_${orderNo}`"
          name="phone"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.phone.$error,
          }"
        />
        <div v-if="submitted && !$v.phone.required" class="invalid-feedback">
          User Phone is required
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary action-button">
          Send Link
        </button>
      </div>
    </form>
  </span>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheSMSComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      phone: this.order.client_details.phone_no,
      submitted: false,
      app_route: '',
    };
  },
  validations: {
    phone: { required },
  },
  computed: {
    link() {
      return `https://${this.app_route}.sendyit.com/external/tracking/${this.orderNo}`;
    },
  },
  created() {
    this.checkappRoute();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    checkappRoute() {
      let app = 'webapptest';
      if (this.$env.APP_ENV === 'production') {
        app = 'app';
      }
      this.app_route = app;
    },
    async sendSMS() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'tracking_link_cc',
        apiKey: true,
        params: {
          link: this.link,
          action_id: 8,
          user_phone: this.phone,
        },
      };

      try {
        const data = await this.perform_order_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
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
