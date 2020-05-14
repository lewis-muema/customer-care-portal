<template>
  <div class="row">
    <div v-if="loading_cancellation_reasons" class="cancel-outer">
      <p>
        Fetching Cancellation Options ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div class="cancel-form" v-else>
      <form id="cancel-form" @submit.prevent="cancelOrder">
        <div class="form-group">
          <v-select
            v-if="
              order.order_details.order_no !==
                order.order_details.parent_order_no &&
                Object.prototype.hasOwnProperty.call(
                  order,
                  'freight_details',
                ) &&
                order.freight_details
            "
            :options="freightOptions"
            :reduce="cancel_reason => cancel_reason.cancel_reason_id"
            name="cancel_reason"
            label="cancel_reason"
            placeholder="Select cancellation reason .."
            class="form-control proximity-point"
            :id="`cancel_reason_${orderNo}`"
            v-model="cancel_reason"
            :class="{
              'is-invalid': submitted && $v.cancel_reason.$error,
            }"
          >
          </v-select>
          <v-select
            v-else
            :options="options"
            :reduce="cancel_reason => cancel_reason.cancel_reason_id"
            name="cancel_reason"
            label="cancel_reason"
            placeholder="Select cancellation reason .."
            class="form-control proximity-point"
            :id="`cancel_reason_${orderNo}`"
            v-model="cancel_reason"
            :class="{
              'is-invalid': submitted && $v.cancel_reason.$error,
            }"
          >
          </v-select>
          <div
            v-if="submitted && !$v.cancel_reason.required"
            class="invalid-feedback"
          >
            Cancellation reason is required
          </div>
        </div>
        <div class="form-group">
          <textarea
            type="text"
            v-model="description"
            :id="`cancel_description_${orderNo}`"
            name="description"
            placeholder="Description"
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
            Description is required
          </div>
        </div>
        <button class="btn btn-primary action-button">
          Cancel Order
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheCancelComponent',
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
      options: [],
      freightOptions: [
        { cancel_reason_id: 9, cancel_reason: 'Customs hold' },
        { cancel_reason_id: 10, cancel_reason: `Partner won't meet ETA` },
      ],
      cancel_reason: '',
      description: '',
      submitted: false,
      loading_cancellation_reasons: true,
    };
  },
  validations: {
    cancel_reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['userData']),

    getSelectorPlaceholder() {
      return this.placeholderItem;
    },
  },
  mounted() {
    this.fetchCancellationOptions();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
      request_cancellation_options: 'request_cancellation_options',
    }),
    async cancelOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'cancel_order',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 1,
          cancel_reason_id: this.cancel_reason,
          reason_description: this.description,
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
    async fetchCancellationOptions() {
      const notification = [];
      let actionClass = '';
      try {
        const data = await this.request_cancellation_options();
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          data.data.forEach(res => {
            this.options.push(res);
          });
        }
        this.loading_cancellation_reasons = false;
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
<style>
.cancel-form {
  width: 55%;
  margin-left: 2%;
}
.cancel-outer {
  margin-left: 1%;
}
</style>
