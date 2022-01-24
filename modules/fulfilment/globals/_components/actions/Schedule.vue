<template>
  <div>
    <div class="cancel-batch-dialog cancel-batch-action-section">
      <div class="batch-input-label">
        Select a day to reschedule order
      </div>
      <el-date-picker
        v-model="selectedDate"
        type="datetime"
        placeholder="Select date and time"
        class="fulfilment-date-class reschedule-fulfilment-date"
      >
      </el-date-picker>
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
  </div>
</template>

<script>
import moment from 'moment';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'Schedule',
  mixins: [NotificationMxn],
  props: ['details'],
  data() {
    return {
      selectedDate: '',
    };
  },
  methods: {
    ...mapActions({
      perform_post_actions: 'fulfilment/perform_post_actions',
    }),
    ...mapMutations({
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    convertToUTC(date) {
      const userTZ = moment.tz.guess();
      const gmtDate = moment.tz(date, 'YYYY-MM-DD HH:mm ZZ', userTZ);
      const UTCDate = moment.utc(gmtDate);
      return UTCDate;
    },
    scheduled_time(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
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
          order_id: this.details.order_id,
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
  },
};
</script>

<style lang="css" scoped></style>
