<template lang="html">
  <div class="">
    <div
      v-if="batch_details_dialog_state === 'cancel'"
      class="cancel-batch-dialog"
    >
      <div class="batch-input-label batch-cancel-label">
        Why do you want to cancel?
      </div>
      <el-input
        type="textarea"
        class="batch-cancellation-reason"
        :rows="2"
        placeholder="Please input"
        v-model="cancel_reason"
      >
      </el-input>

      <el-button
        type="danger"
        class="action-submit-button"
        :class="
          !cancel_reason ? 'disabled-batch-order-btn' : 'cancel-batch-order-btn'
        "
        :disabled="!cancel_reason"
        @click="cancelOrder()"
      >
        Cancel order
      </el-button>
    </div>
    <div
      v-else-if="batch_details_dialog_state === 'reschedule'"
      class="cancel-batch-dialog"
    >
      <div class="batch-input-label">
        Select a day to reschedule order
      </div>
      <VueCtkDateTimePicker
        class="fulfilment-date-class"
        formatted="MMM DD YYYY hh:mm:ss a"
        v-model="selectedDate"
        :range="false"
        :no-label="true"
        id="liveops"
      />
      <el-button
        type="danger"
        class="action-submit-button"
        :class="
          !selectedDate
            ? 'disabled-batch-order-btn'
            : 'reschedule-batch-order-btn'
        "
        :disabled="!selectedDate"
        @click="rescheduleOrder()"
      >
        Submit
      </el-button>
    </div>
    <div v-else>
      <div
        class="failed-request-outer"
        v-if="batch_info.order_status === 'ORDER_FAILED'"
      >
        <div class="failed-request-inner" @click="showFailedData(opened)">
          <div class="failed-request-msg">
            We were unable to reach the customer, here are the attempts and the
            reasons
          </div>
          <div class="failed-request-expand-section">
            <i v-if="!opened" class="el-icon-arrow-up" />
            <i v-if="opened" class="el-icon-arrow-down" />
          </div>
        </div>
        <div class="failed-request-details" v-if="opened">
          <span
            class="details-content"
            v-for="(failed_data, index) in failed_request_data"
            :key="index"
          >
            <div class="failed-request-header">
              Attempt {{ `${index + 1}` }}
            </div>
            <div class="failed-request-date">
              {{ formatDate(failed_data.attempt_date) }}
            </div>
            <div class="failed-request-reason">
              {{ failed_data.failure_reason }}
            </div>
          </span>
        </div>
      </div>
      <div class="batch-summary-body">
        <div class="">
          <div
            class="fulfilment-summary-details-info batch-details-date"
            :class="
              batch_info.order_status !== 'ORDER_FAILED'
                ? 'scheduled-date-margin'
                : ''
            "
          >
            {{ formatScheduledDate(batch_info.scheduled_date) }}
          </div>

          <div
            class="failed-request-actions"
            v-if="batch_info.order_status === 'ORDER_FAILED'"
          >
            <span
              class="reschedule-batch-child"
              @click="nextDialog('reschedule')"
              >RESCHEDULE</span
            >
            <span class="cancel-batch-child" @click="nextDialog('cancel')"
              >CANCEL ORDER</span
            >
          </div>

          <div class="failed-request-divider" />
        </div>

        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="el-icon-location batch-child-orders-icon" />
            Destination location
          </div>
          <div class="fulfilment-summary-details-info">
            {{ batch_info.destination_description }}
          </div>
        </div>
        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="fa fa-truck batch-child-orders-icon" /> Recommened Vehicle
          </div>
          <div class="fulfilment-summary-details-info transform-vehicle-name">
            {{ getVendorType(batch_info.shipping_agent_vehicle_type) }}
          </div>
        </div>
        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="el-icon-s-claim batch-child-orders-icon" /> Assigned Batch
          </div>
          <div class="fulfilment-summary-details-info">
            {{ batch_info.most_recent_batch_id }}
          </div>
        </div>
        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="el-icon-s-shop batch-child-orders-icon" /> Seller
            Information
          </div>
          <div class="fulfilment-summary-details-info">
            {{ batch_info.business_name }}
          </div>
        </div>
        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="fa fa-user batch-child-orders-icon" /> Recipient
            Information
          </div>
          <div class="fulfilment-summary-details-info">
            {{ batch_info.order_recipient_name }}
          </div>
        </div>
        <div class="">
          <div class="fulfilment-summary-details-header">
            <i class="fa fa-motorcycle batch-child-orders-icon" />Rider
            Information
          </div>
          <div class="fulfilment-summary-details-info">
            {{
              !batch_info.shipping_agent_name
                ? 'Not available'
                : batch_info.shipping_agent_name
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  mixins: [NotificationMxn],
  data() {
    return {
      batch_info: [],
      batch_details_dialog_state: null,
      selectedDate: '',
      cancel_reason: '',
      opened: false,
      processing: true,
      failed_request_data: [],
    };
  },
  computed: {
    ...mapGetters({
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
      getBatchDetailsDialogState: 'fulfilment/getBatchDetailsDialogState',
      getActivePage: 'getActivePage',
    }),
  },
  watch: {
    getBatchChildOrderDetails(val) {
      this.batch_info = val;
    },
    getBatchDetailsDialogState(val) {
      this.batch_details_dialog_state = val;
    },
  },
  beforeMount() {
    this.processing = true;
    this.batch_info = this.getBatchChildOrderDetails;
    if (this.batch_info.order_status === 'ORDER_FAILED') {
      this.getFailedRequestData();
    }
  },
  methods: {
    ...mapActions({
      fetchFailedAttempts: 'fulfilment/fetchFailedAttempts',
      perform_post_actions: 'fulfilment/perform_post_actions',
    }),
    ...mapMutations({
      setBatchDetailsDialogState: 'fulfilment/setBatchDetailsDialogState',
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    convertToUTC(date) {
      const userTZ = moment.tz.guess();
      const gmtDate = moment.tz(date, 'YYYY-MM-DD HH:mm ZZ', userTZ);
      const UTCDate = moment.utc(gmtDate);
      return UTCDate;
    },
    formatTime(date) {
      return moment(date).format('hh:mm A');
    },
    formatDate(date) {
      return moment(date).format('Do MMM hh:mm a');
    },
    formatScheduledDate(date) {
      return moment(date).format('Do MMM YYYY hh:mm a');
    },
    scheduled_time(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    nextDialog(val) {
      this.setBatchDetailsDialogState(val);
    },
    getVendorType(val) {
      const string = !val ? 'N/A' : val.replace(/_/g, ' ').toLowerCase();

      return string;
    },
    showFailedData(val) {
      this.opened = !val;
    },
    async getFailedRequestData() {
      const payload = {
        order_id: this.batch_info.order_id,
      };
      this.failed_request_data = [];
      this.processing = true;
      const response = await this.fetchFailedAttempts(payload);
      this.processing = false;

      if (Object.keys(response).length > 0) {
        this.processing = true;
        this.failed_request_data = response.failed_attempts;
      }
    },
    async rescheduleOrder() {
      // eslint-disable-next-line no-unreachable

      if (!this.selectedDate) {
        this.doNotification(
          2,
          'Reschedule Error',
          'Kindly provide reschedule date',
        );
        return;
      }
      const date = this.convertToUTC(this.scheduled_time(this.selectedDate));

      const payload = {
        app: 'AUTH',
        endpoint: 'mission-control-bff/orders/reschedule',
        apiKey: false,
        params: {
          order_id: this.batch_info.order_id,
          rescheduled_time: date,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Order Rescheduled',
            'Order has been rescheduled successfully',
          );
          setTimeout(() => {
            this.updateProcessingStatus(true);
          }, 800);
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(res.data, 'errors')) {
            error_response = res.data.errors;
          } else {
            error_response = res.data.message;
          }
          this.doNotification(2, 'Reschedule Order Error', error_response);
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
    async cancelOrder() {
      // eslint-disable-next-line no-unreachable

      if (!this.cancel_reason) {
        this.doNotification(
          2,
          'Cancel Order Error',
          'Kindly provide cancellation reason',
        );
        return;
      }
      const order_type =
        this.getActivePage === 'Outbound_ordersView'
          ? 'Delivery'
          : 'Consignment';

      const payload = {
        app: 'AUTH',
        endpoint: 'mission-control-bff/orders/cancel',
        apiKey: false,
        params: {
          order_id: this.batch_info.order_id,
          reason: this.cancel_reason,
          order_type,
          business_id: this.batch_info.business_id,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Cancel Order',
            'Order has been cancelled successfully',
          );
          setTimeout(() => {
            this.updateProcessingStatus(true);
          }, 800);
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(res.data, 'errors')) {
            error_response = res.data.errors;
          } else {
            error_response = res.data.message;
          }
          this.doNotification(2, 'Cancel Order Error', error_response);
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
  },
};
</script>

<style lang="css" scoped></style>
