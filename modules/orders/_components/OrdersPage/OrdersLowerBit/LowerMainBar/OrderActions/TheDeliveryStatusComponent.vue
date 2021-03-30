<template>
  <div class="row">
    <div class="cancel-form">
      <form id="cancel-form" @submit.prevent="updateDeliveryState">
        <div class="form-group">
          <v-select
            :options="options"
            :reduce="delivery_status => delivery_status.delivery_status_id"
            name="delivery_status"
            label="delivery_status"
            placeholder="Select delivery status .."
            class="form-control proximity-point"
            :id="`delivery_status_${orderNo}`"
            v-model="delivery_status"
            :class="{
              'is-invalid': submitted && $v.delivery_status.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.delivery_status.required"
            class="invalid-feedback"
          >
            Delivery status is required
          </div>
        </div>
        <div class="" v-if="delivery_status === 'approve'">
          <div class="form-group">
            <v-select
              :options="paymentMethods"
              :reduce="payment_type => payment_type.payment_method_id"
              name="name"
              label="name"
              placeholder="Select payment method .."
              class="form-control proximity-point"
              :id="`payment_type_${orderNo}`"
              v-model="payment_type"
            >
            </v-select>
          </div>

          <div class="form-group" v-if="payment_type !== ''">
            <textarea
              type="text"
              v-model="ref_no"
              :id="`delivery_description_${orderNo}`"
              name="ref_no"
              placeholder="Reference Number"
              class="form-control"
            >
            </textarea>
          </div>
        </div>

        <div class="form-group">
          <textarea
            type="text"
            v-model="description"
            :id="`delivery_description_${orderNo}`"
            name="description"
            placeholder="Description ..."
            class="form-control"
            :class="{
              'is-invalid': submitted && $v.description.$error,
            }"
          >
          </textarea>
          <div
            v-if="submitted && !$v.description.required"
            class="invalid-feedback"
          >
            Reason is required
          </div>
        </div>
        <button class="btn btn-primary action-button">
          Update Status
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheDeliveryStatusComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      errors: [],
      notifications: '',
      options: [
        { delivery_status_id: 'approve', delivery_status: 'Approved' },
        { delivery_status_id: 'enroute', delivery_status: `In Transit` },
        { delivery_status_id: 'arrive', delivery_status: 'Arrived' },
        {
          delivery_status_id: 'complete',
          delivery_status: `Collected by reipient`,
        },
      ],
      delivery_status: '',
      description: '',
      submitted: false,
      error_msg: '',
      paymentMethods: [],
      payment_type: '',
      ref_no: '',
    };
  },
  validations: {
    delivery_status: { required },
    description: { required },
  },
  computed: {
    ...mapState(['userData']),
  },
  mounted() {
    const userInfo = this.userData.payload.data;
    this.fetchPaymentOptions(userInfo);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      update_intercounty_delivery_state: 'update_intercounty_delivery_state',
      request_payment_methods: 'request_payment_methods',
    }),
    async fetchPaymentOptions(userInfo) {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PAYMENT_SERVICE',
        endpoint: 'accounts/pay_methods',
        apiKey: false,
        params: {
          country_code: 'KE',
          account_type: 'Sendy Staff',
          entry_point: 'CC Portal',
        },
      };
      try {
        const data = await this.request_payment_methods(payload);
        const error = !this.status ? data.error : '';
        if (!data.status) {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
          this.updateClass(actionClass);
          this.updateErrors(notification);
        }

        return (this.paymentMethods = data.payment_methods);
      } catch (error) {
        this.status = false;
      }
    },
    async updateDeliveryState() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      if (
        this.delivery_status === 'approve' &&
        (this.ref_no === '' || this.payment_type === '')
      ) {
        notification.push('Kindly provide all values');
        actionClass = this.display_order_action_notification(false);
      } else {
        const userInfo = this.userData.payload.data;

        const payload = {
          route: this.delivery_status,
          params: {
            _user_email: userInfo.email,
            _user_id: userInfo.admin_id,
            action_user: userInfo.name,
            channel: 'customer_support',
            data_set: 'cc_actions',
            order_no: this.orderNo,
          },
        };

        if (this.delivery_status === 'approve') {
          payload.params.ref_no = this.ref_no;
          payload.params.payment_method = this.payment_type;
        }

        try {
          const data = await this.update_intercounty_delivery_state(payload);

          if (data.status) {
            notification.push(data.reason);
            actionClass = this.display_order_action_notification(data.status);
          } else {
            if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
              this.error_msg = data.errors;
            } else {
              this.error_msg = data.reason;
            }
            notification.push(this.error_msg);
            actionClass = this.display_order_action_notification(data.status);
          }
        } catch (error) {
          notification.push(
            'Something went wrong. Try again or contact Tech Support',
          );
          actionClass = 'danger';
        }
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
<style>
.cancel-form {
  width: 55%;
  margin-left: 2%;
}
.cancel-outer {
  margin-left: 1%;
}
</style>
