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
      >
        Submit
      </el-button>
    </div>
    <div v-else>
      <div class="failed-request-outer">
        <div class="failed-request-inner" @click="showFailedData(opened)">
          <div class="failed-request-msg">
            We were unable to reach the customer, here are the attempts and the
            reasons
          </div>
          <div class="failed-request-expand-section">
            <i v-if="opened" class="el-icon-arrow-up" />
            <i v-if="!opened" class="el-icon-arrow-down" />
          </div>
        </div>
      </div>
      <div class="batch-summary-body">
        <div class="">
          <div class="fulfilment-summary-details-info batch-details-date">
            {{ formatScheduledDate(batch_info.scheduled_date) }}
          </div>

          <div class="failed-request-actions">
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
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      batch_info: [],
      batch_details_dialog_state: null,
      selectedDate: '',
      cancel_reason: '',
      opened: false,
    };
  },
  computed: {
    ...mapGetters({
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
      getBatchDetailsDialogState: 'fulfilment/getBatchDetailsDialogState',
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
    this.batch_info = this.getBatchChildOrderDetails;
  },
  methods: {
    ...mapMutations({
      setBatchDetailsDialogState: 'fulfilment/setBatchDetailsDialogState',
    }),
    formatTime(date) {
      return moment(date).format('hh:mm A');
    },
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY ');
    },
    formatScheduledDate(date) {
      return moment(date).format('Do MMM YYYY hh:mm a');
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
  },
};
</script>

<style lang="css" scoped></style>
