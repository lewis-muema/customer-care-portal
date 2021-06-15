<template>
  <span>
    <div class="row">
      <div
        class="col-sm-3"
        v-if="
          dispute_status === 0 || dispute_status === 1 || dispute_status === 3
        "
      >
        <div class="form-group">
          <div class="radio">
            <label>
              <input
                name="delivery_docs_dispute_value1_${orderNo}"
                id="delivery_docs_action2_${orderNo}"
                @change="update_delivery_docs_dispute_action(switched)"
                checked
                value="3"
                type="radio"
              />
              Dispute Driver Documents
            </label>
          </div>
        </div>
      </div>
      <div class="col-sm-3" v-if="dispute_status === 3">
        <div class="form-group">
          <div class="radio">
            <label>
              <input
                name="delivery_docs_dispute_value1_${orderNo}"
                id="delivery_docs_action2_${orderNo}"
                @change="update_delivery_docs_dispute_action(switched)"
                checked
                value="2"
                type="radio"
              />
              Reject Driver Appeal
            </label>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group" v-if="dispute_status === 3">
          <div class="radio">
            <label>
              <input
                name="delivery_docs_dispute_value1_${orderNo}"
                id="delivery_docs_action1_${orderNo}"
                value="1"
                type="radio"
                @change="update_delivery_docs_dispute_action(switched)"
              />
              Accept Driver Appeal
            </label>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="form-group" v-if="dispute_status === 2">
          <div class="radio">
            <label>
              <input
                name="delivery_docs_dispute_value1_${orderNo}"
                id="delivery_docs_action1_${orderNo}"
                value="1"
                type="radio"
                @change="update_delivery_docs_dispute_action(switched)"
              />
              Reject Customer Dispute
            </label>
          </div>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="form-group" v-if="dispute_status === 0">
          <div class="radio">
            <label>
              <input
                name="delivery_docs_dispute_value1_${orderNo}"
                id="delivery_docs_action1_${orderNo}"
                value="1"
                type="radio"
                @change="update_delivery_docs_dispute_action(switched)"
              />
              Accept Driver Documents
            </label>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="disputeResponse !== null"
      :class="`row alert alert-${disputeErrorClass}`"
      :id="`dispute_error_${orderNo}`"
    >
      <strong> {{ disputeResponse }} </strong>
    </div>
    <form id="dispute-form" @submit.prevent="determineAction">
      <div
        class="form-group"
        v-if="
          dispute_status === 0 || dispute_status === 1 || dispute_status === 3
        "
      >
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select dispute reason .."
          class="form-control proximity-point"
          :id="`dispute_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
          dispute reason is required
        </div>
        <textarea
          v-if="
            dispute_status === 0 || dispute_status === 1 || dispute_status === 3
          "
          type="text"
          v-model="description"
          :id="`dispute_description_${orderNo}`"
          name="description"
          placeholder="Description"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.description.$error,
          }"
        >
        </textarea>
        <div
          v-if="
            // eslint-disable-next-line prettier/prettier
            submitted && !$v.description.required && (dispute_status === 0 || dispute_status === 1 || dispute_status === 3)
          "
          class="invalid-feedback"
        >
          Description is required
        </div>
      </div>
      <div class="form-group" v-else>
        <v-select
          v-if="
            dispute_status === 0 || dispute_status === 2 || dispute_status === 3
          "
          :options="optionz"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select undispute reason .."
          class="form-control proximity-point"
          :id="`undispute_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div
          v-if="
            submitted &&
              !$v.reason.required &&
              (dispute_status === 0 ||
                dispute_status === 2 ||
                dispute_status === 3)
          "
          class="invalid-feedback"
        >
          undispute reason is required
        </div>
        <textarea
          v-if="
            dispute_status === 0 || dispute_status === 2 || dispute_status === 3
          "
          type="text"
          v-model="description"
          :id="`dispute_description_${orderNo}`"
          name="description"
          placeholder="Description"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.description.$error,
          }"
        >
        </textarea>
        <div
          v-if="
            dispute_status === 0 || dispute_status === 2 || dispute_status === 3
          "
          class="invalid-feedback"
        >
          Description is required
        </div>
      </div>
      <button v-if="dispute_status !== 4" class="btn btn-primary action-button">
        submit
      </button>
    </form>
  </span>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheDeliveryDetailsForm',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modalImage: '',
      disputeErrorClass: '',
      disputeResponse: null,
      orderDetails: this.order,
      orderNo: this.order.order_details.order_no,
      riderDeliverImg: this.order.delivery_details.delivery_images,
      riderID: this.order.rider_details.rider_id,
      dispute_status: this.order.order_details.dispute_status,
      errors: [],
      notifications: '',
      options: [
        { code: '1', reason: 'A delivery document is missing' },
        { code: '2', reason: 'The delivery document is not clear' },
        { code: '3', reason: 'The delivery document is not valid' },
      ],
      optionz: [
        { code: '1', reason: 'The delivery document is there' },
        { code: '2', reason: 'The delivery document is clear' },
        { code: '3', reason: 'The delivery document is valid' },
      ],
      reason: '',
      description: '',
      submitted: false,
      switched: true,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['config']),

    ...mapState(['userData']),
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  mounted() {
    this.disputeErrorClass = '';
    this.disputeResponse = null;
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: 'orders/perform_order_action',
    }),
    triggerDnotesModal(image, e) {
      this.modalImage = image;
      $(`#ModalCenter`).modal('show');
      e.preventDefault();
    },
    determineAction() {
      if (this.dispute_status === 0 && !this.switched) {
        return this.verifyDnote();
      }
      if (this.dispute_status === 0 && this.switched) {
        return this.disputeOrder();
      }
      if (this.dispute_status === 1 && this.switched) {
        return this.disputeOrder();
      }
      if (this.dispute_status === 3 && this.switched) {
        return this.disputeOrder();
      }
      if (
        !this.switched &&
        (this.dispute_status === 2 || this.dispute_status === 3)
      ) {
        return this.undisputeOrder();
      }
    },
    async disputeOrder() {
      let notification = '';
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const email = this.session.payload.data.email;
      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispute_delivery_docs_cc',
        apiKey: true,
        params: {
          _user_email: email,
          _user_id: adminID,
          action_id: 22,
          action_user: this.actionUser,
          admin_id: adminID,
          channel: 'customer_support',
          cop_name: this.order.client_details.corporate_name,
          customer_email: this.order.client_details.email,
          customer_name: this.order.client_details.name,
          customer_phone: this.order.client_details.phone_no,
          data_set: 'cc_actions',
          description: this.description,
          dispute_delivery_doc_status: 2,
          dispute_docs_reason_id: this.reason,
          order_no: this.orderNo,
          rider_id: this.riderID,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification = data.reason;
        actionClass = this.display_order_action_notification(data.status);
      } catch (error) {
        notification =
          'Something went wrong. Try again or contact Tech Support';
        actionClass = 'danger';
      }
      this.disputeErrorClass = actionClass;
      this.disputeResponse = notification;
    },

    async undisputeOrder() {
      let notification = '';
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispute_delivery_docs_cc',
        apiKey: true,
        params: {
          admin_id: adminID,
          cop_name: this.order.client_details.corporate_name,
          customer_email: this.order.client_details.email,
          customer_name: this.order.client_details.name,
          customer_phone: this.order.client_details.phone_no,
          action_id: 22,
          channel: 'customer_support',
          data_set: 'cc_actions',
          description: this.description,
          dispute_delivery_doc_status: 4,
          dispute_docs_reason_id: this.reason,
          order_no: this.orderNo,
          rider_id: this.riderID,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification = data.reason;
        actionClass = this.display_order_action_notification(data.status);
      } catch (error) {
        notification =
          'Something went wrong. Try again or contact Tech Support';
        actionClass = 'danger';
      }
      this.disputeErrorClass = actionClass;
      this.disputeResponse = notification;
    },
    async verifyDnote() {
      let notification = '';
      let actionClass = '';
      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispute_delivery_docs_cc',
        apiKey: true,
        params: {
          admin_id: adminID,
          cop_name: this.order.client_details.corporate_name,
          customer_email: this.order.client_details.email,
          customer_name: this.order.client_details.name,
          customer_phone: this.order.client_details.phone_no,
          action_id: 22,
          channel: 'customer_support',
          data_set: 'cc_actions',
          description: 'The delivery document is valid',
          dispute_delivery_doc_status: 1,
          dispute_docs_reason_id: 0,
          order_no: this.orderNo,
          rider_id: this.riderID,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification = 'Successfully verified delivery documents';
        actionClass = this.display_order_action_notification(data.status);
      } catch (error) {
        notification =
          'Something went wrong. Try again or contact Tech Support';
        actionClass = 'danger';
      }
      this.disputeErrorClass = actionClass;
      this.disputeResponse = notification;
    },
    update_delivery_docs_dispute_action(switched) {
      if (switched) {
        this.switched = false;
        return this.switched;
      } else {
        this.switched = true;
        return this.switched;
      }
    },
  },
};
</script>
<style>
.alert-success {
  width: 100%;
  margin-left: 9px;
}
</style>
