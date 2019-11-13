<template>
  <form @submit.prevent="submitTicket" class="form-inline">
    <div class="form-group col-md-6">
      <v-select
        :options="customerInfo"
        :reduce="reason => reason.code"
        name="point"
        label="reason"
        placeholder="Select ticket reason .."
        class="form-control proximity-point"
        :id="`reason_${orderNo}`"
        v-model="params.reason"
        :class="{
          'is-invalid': submitted && $v.params.reason.$error,
        }"
      >
      </v-select>
      <div
        v-if="submitted && !$v.params.reason.required"
        class="invalid-feedback"
      >
        Ticket reason is required
      </div>
    </div>
    <!-- <div class="form-group">
      <v-select
        :options="departments"
        :reduce="department => department.code"
        name="department"
        label="department"
        placeholder="Select department assigned to .."
        class="form-control proximity-point"
        :id="`department_${orderNo}`"
        v-model="params.department"
        :class="{
          'is-invalid': submitted && $v.params.department.$error,
        }"
      >
      </v-select>
      <div
        v-if="submitted && !$v.params.department.required"
        class="invalid-feedback"
      >
        Ticket department is required
      </div>
    </div> -->
    <div class="form-group  col-md-6">
      <input
        type="text"
        v-model="params.department"
        name="department"
        placeholder="department"
        class="form-control"
        readonly
        :class="{
          'is-invalid': submitted && $v.params.department.$error,
        }"
      />
      <div
        v-if="submitted && !$v.params.department.required"
        class="invalid-feedback"
      >
        Ticket department is required
      </div>
    </div>
    <div class="form-group col-md-12">
      <textarea
        type="text"
        v-model="params.message"
        :id="`ticket_message_${orderNo}`"
        name="message"
        class="form-control"
        placeholder="Ticket message"
        :class="{
          'is-invalid': submitted && $v.params.message.$error,
        }"
      >
      </textarea>
      <div
        v-if="submitted && !$v.params.message.required"
        class="invalid-feedback"
      >
        Ticket message is required
      </div>
    </div>

    <div class="form-group">
      <button class="btn btn-primary action-button">
        Ticket
      </button>
    </div>
  </form>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheTicketComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      params: {
        reason: '',
        message: '',
        department: 'Customer Support',
      },
      submitted: false,
    };
  },
  validations: {
    params: {
      reason: { required },
      message: { required },
      department: { required },
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
    async submitTicket() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const notification = [];
      let actionClass = '';
      const department = 2;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'ticket_order_cc',
        apiKey: true,
        params: {
          activity_narrative: this.params.message,
          action_id: 9,
          user_phone: this.phone,
          assignedType: department,
          client_mode: this.order.order_details.client_mode,
          order_no: this.orderNo,
          reporter_id: 1,
          type_id: 1,
          type_title: this.params.reason,
          user_email: this.order.client_details.email,
          user_id: 18867,
          user_name: this.order.client_details.name,
          user_phone: this.order.client_details.phone_no,
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
