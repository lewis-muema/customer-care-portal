<template>
  <div>
    <div :id="`response_${orderNo}_dispatch`"></div>
    <form id="dispatch-form" @submit.prevent="dispatchOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select dispatch reason .."
          class="form-control proximity-point"
          :id="`dispatch_reason${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
          Dispatch reason is required
        </div>
      </div>
      <div class="form-group">
        <p>The order will be broadcasted to all the riders near the pickup</p>
      </div>
      <button class="btn btn-primary action-button">
        Dispatch Order
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheDispatchComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      options: [
        { code: '1', reason: 'Rider with a box' },
        { code: '2', reason: 'Rider without a box' },
        { code: '11', reason: 'Rider Unreachable' },
        { code: '12', reason: 'Rider rejected' },
      ],
      reason: '',
      submitted: false,
    };
  },
  validations: {
    reason: { required },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    async dispatchOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const batchNo = this.order.order_details.batch_no;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispatch_order_cc',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          batch_no: batchNo !== null ? batchNo : '',
          action_id: 6,
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
