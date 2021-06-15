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
            :reduce="cancelReason => cancelReason.cancel_reason_id"
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
            :options="cancellation_options"
            :reduce="cancelReason => cancelReason.cancellation_reason_id"
            name="cancellation_reason"
            label="cancellation_reason"
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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheCancelComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    orderDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      errors: [],
      notifications: '',
      cancellation_options: [],
      freightOptions: [
        { cancel_reason_id: 9, cancel_reason: 'Customs hold' },
        { cancel_reason_id: 10, cancel_reason: `Partner won't meet ETA` },
      ],
      order_status: [
        {
          label: 'Before an order has been confirmed',
          status: 'pending',
          value: 1,
        },
        {
          label: 'Before arrival at pickup location',
          status: 'confirmed',
          value: 2,
        },
        {
          label: 'After arrival at pick up location',
          status: 'in transit',
          value: 3,
        },
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
    ...mapGetters({
      cancellationReasons: 'getActiveCancellationReasons',
    }),
    getSelectorPlaceholder() {
      return this.placeholderItem;
    },
  },
  mounted() {
    this.fetchSetCancellationReasons();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: 'orders/perform_order_action',
      fetch_set_cancellation_reasons: 'fetch_set_cancellation_reasons',
    }),
    async cancelCoupon() {
      const notification = [];
      let actionClass = '';

      const copID =
        this.order.client_details.corporate_name === ''
          ? 0
          : this.order.client_details.client_id;
      const individualID =
        this.order.client_details.corporate_name === ''
          ? this.order.client_details.user_id
          : this.order.client_details.client_id;

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'use_coupon',
        apiKey: true,
        params: {
          cop_id: copID,
          individual_id: individualID,
          coupon_code: '',
          coupon_amount: 0,
          is_cancelled: true,
          coupon_type: 0,
        },
      };

      try {
        const data = await this.perform_order_action(payload);
        notification.push(data.message);
        actionClass = this.display_order_action_notification(data.status);
      } catch (error) {
        notification.push(
          'Something went wrong cancelling coupon. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
    },
    async cancelOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      await this.cancelCoupon();

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
          'Something went wrong cancelling order. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchSetCancellationReasons() {
      const notification = [];
      let actionClass = '';
      const countryCodes = [this.orderDetails.countryCode.toUpperCase()];

      try {
        await this.fetch_set_cancellation_reasons(countryCodes);
        this.filterVendorTypeCancellationReasons();
      } catch (error) {
        notification.push(
          'Error occurred fetching cancellation reasons. Please try again.',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    mapOrderStatusToValue() {
      const mappedValue = this.order_status.filter(
        status => status.status === this.orderDetails.orderStatus.toLowerCase(),
      );
      return mappedValue[0].value;
    },
    filterVendorTypeCancellationReasons() {
      const filteredCancellationReasons = [];
      this.cancellationReasons.forEach(reason => {
        const vendorIDs = JSON.parse(reason.vendor_type_ids);
        const found = vendorIDs.indexOf(this.orderDetails.vendorID) !== -1;
        if (found) {
          filteredCancellationReasons.push(reason);
        }
      });
      this.filterByCancellationStatus(filteredCancellationReasons);
    },
    filterByCancellationStatus(cancellationReasonsArray) {
      const reasonsArray = [];
      cancellationReasonsArray.forEach(reason => {
        const orderStatus = JSON.parse(reason.applicable_order_status);
        const orderStatusValue = this.mapOrderStatusToValue();

        const found = orderStatus.indexOf(orderStatusValue) !== -1;
        if (found) reasonsArray.push(reason);
      });
      this.loading_cancellation_reasons = false;
      this.cancellation_options = reasonsArray;
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
