<template>
  <div>
    <form id="cancel-form" @submit.prevent="cancelOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select cancellation reason .."
          class="form-control proximity-point"
          :id="`cancel_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
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
      options: [
        { code: '1', reason: 'No partner' },
        { code: '2', reason: 'Delay' },
        { code: '3', reason: 'Customer error' },
      ],
      reason: '',
      description: '',
      submitted: false,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['userData']),

    getSelectorPlaceholder() {
      return this.placeholderItem;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
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
          cancel_reason_id: this.reason,
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
  },
};
</script>
