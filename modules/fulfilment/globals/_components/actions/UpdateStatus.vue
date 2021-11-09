<template>
  <div class="fulfilment-actions-holder status-holder">
    <label>Status </label>
    <el-select
      v-model="selectedStatus"
      placeholder="Select status"
      class="status-change"
    >
      <el-option
        v-for="item in sectionStatuses"
        :key="item.value"
        :label="item.description"
        :value="item"
        :disabled="isDisabled(item.value)"
      >
      </el-option>
    </el-select>
    <el-button
      type="primary"
      class="blue"
      size="mini"
      plain
      @click="updateStatus()"
      :disabled="processing || !selectedStatus"
    >
      Update Status
      <i class="fa fa-chevron-right status-icon"></i>
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import moment from 'moment';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'UpdateStatus',
  mixins: [NotificationMxn],
  props: ['page', 'details'],
  data() {
    return {
      selectedStatus: '',
      processing: false,
      statusEvents: null,
    };
  },
  computed: {
    ...mapGetters({
      getStatusMapping: 'fulfilment/getStatusMapping',
      getTableData: 'fulfilment/getTableData',
    }),

    section() {
      return this.page === 'Outbound_ordersView' ||
        this.page === 'Inbound_ordersView'
        ? 'order'
        : 'batch';
    },
    sectionStatuses() {
      const filteredStatus = this.getStatusMapping.filter(
        event => event.type === this.section,
      );
      return filteredStatus;
    },
    status() {
      return this.section === 'order'
        ? this.details.order_status
        : this.details.batch_status;
    },
    statusDetails() {
      const filteredStatus = this.sectionStatuses.filter(
        event => event.value === this.status,
      );
      return filteredStatus[0];
    },
    allowedStatus() {
      const data = this.statusDetails.availableStatus;
      return data;
    },
  },
  methods: {
    ...mapMutations({
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
      updateStatusChanged: 'fulfilment/setStatusChanged',
    }),
    ...mapActions({
      perform_post_actions: 'fulfilment/perform_post_actions',
    }),

    async updateStatus() {
      this.processing = true;
      this.updateStatusChanged(false);

      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: 'transport/tracking',
        apiKey: false,
        params: {
          order_id: this.details.order_id,
          batch_id:
            this.details.batches.length === 0
              ? null
              : this.details.batches[0].batch_id,
          event_date: Date.now(),
          event_code:
            this.page === 'Inbound_ordersView'
              ? this.selectedStatus.events.pickup
              : this.selectedStatus.events.delivery,
        },
      };
      try {
        const res = await this.perform_post_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Status Updated',
            `Status updated successfully`,
          );
          setTimeout(() => {
            this.updateProcessingStatus(true);
            this.updateStatusChanged(true);
          }, 800);
          // eslint-disable-next-line no-unreachable
        } else {
          this.disabled = false;
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Update Status Error', error_response);
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        this.disabled = false;
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
    },
    isDisabled(status) {
      const statuses = this.allowedStatus;
      if (!statuses) {
        return true;
      }
      const exists = statuses.includes(status);
      return !exists;
    },
  },
};
</script>

<style>
.status-holder label {
  display: flex;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.status-holder .el-select {
  width: 35%;
}
.status-holder .el-input__inner {
  border: 0.6px solid #909399;
  box-sizing: border-box;
  border-radius: 4px;
  height: 35px;
}
.status-holder .el-input__inner,
.status-holder .el-input__inner::placeholder {
  font-size: 13px;
  line-height: 20px;
  color: #909399;
}
.status-holder .el-button {
  display: flex;
  margin-top: 1em;
  background: #1b7fc3;
  border-radius: 4px;
  color: #ffffff;
  border-color: #1b7fc3;
  height: 36px;
  font-size: 13px;
  line-height: 20px;
}
.status-icon {
  margin-left: 10px;
}
</style>
