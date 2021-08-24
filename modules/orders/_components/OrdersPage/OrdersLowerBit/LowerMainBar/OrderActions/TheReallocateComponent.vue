<template>
  <div>
    <div :id="`response_${orderNo}_reallocate`"></div>
    <form id="reallocate-form" @submit.prevent="checkTrackerStatus">
      <div class="form-group">
        <v-select
          v-if="
            order.order_details.order_no !==
              order.order_details.parent_order_no &&
              Object.prototype.hasOwnProperty.call(order, 'freight_details') &&
              order.freight_details
          "
          :options="freightReallocationInfo"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select reallocation reason .."
          class="form-control proximity-point"
          :id="`reallocate_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <v-select
          v-else
          :options="customerInfo"
          :reduce="name => name.reallocation_id"
          name="reason"
          label="description"
          placeholder="Select reallocation reason .."
          class="form-control proximity-point"
          :id="`reallocate_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
          Reallocation reason is required
        </div>
      </div>
      <div class="form-group">
        <textarea
          type="text"
          v-model="description"
          :id="`reallocation_description_${orderNo}`"
          name="description"
          class="form-control"
          placeholder="Description"
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
        Re-Allocate Orders
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheReallocateComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      vendorType: this.order.rider_details.vendor_type_id,
      assignedImei: '',
      reason: '',
      description: '',
      submitted: false,
      customerInfo: [],
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  mounted() {
    this.fetchReassignmentReasons();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: 'orders/perform_order_action',
      tracker_status: 'orders/tracker_status',
      fetch_all_reallocation_reason: 'fetch_all_reallocation_reason',
    }),
    fetchReassignmentReasons() {
      this.fetch_all_reallocation_reason()
        .then(results => {
          this.customerInfo = results.data.filter(
            reason =>
              reason.status === 1 && this.vendorType === reason.vendor_type_id,
          );
        })
        .catch(err => {
          throw err;
        });
    },
    async checkTrackerStatus() {
      if (this.vendorType === 25 || this.vendorType === 20) {
        const notification = [];
        let actionClass = '';

        const payload = {
          app: 'POSITIONS',
          endpoint: 'get_tracker_details',
          apiKey: true,
          params: { order_no: this.orderNo },
        };
        try {
          const data = await this.tracker_status(payload);
          if (data.status) {
            this.assignedImei = data.tracker_imei;
            notification.push(
              `This order is assigned GPS Tracker - ${data.tracker_name}. Unassign the tracker before reallocating the order`,
            );
            actionClass = 'alert alert-info';
          } else {
            return this.reallocateOrder();
          }
        } catch (error) {
          notification.push(
            'Something went wrong. Try again or contact Tech Support',
          );
          actionClass = 'danger';
        }
        this.updateClass(actionClass);
        this.updateErrors(notification);
      } else {
        return this.reallocateOrder();
      }
    },
    async reallocateOrder() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const notification = [];
      let actionClass = '';

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'reallocate_order_cc',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          action_id: 6,
          reallocation_description: this.description,
          reallocation_reason_id: this.reason,
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
