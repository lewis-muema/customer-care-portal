<template lang="html">
  <div class="">
    <div class="">
      <div class="fulfilment-cancelation-text">
        Are you sure you want to remove order {{ order_info.order_id }} from
        this batch?
      </div>
    </div>
    <el-button
      type="danger"
      class="full-width remove-order-btn"
      @click="removeOrderFromBatch()"
    >
      Remove order from batch
    </el-button>
    <div class="close-order-dialog" @click="closeDialog()">
      Cancel
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  mixins: [NotificationMxn],
  data() {
    return {
      order_info: [],
    };
  },
  computed: {
    ...mapGetters({
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
    }),
  },
  watch: {
    getBatchChildOrderDetails(val) {
      this.order_info = val;
    },
  },
  beforeMount() {
    this.order_info = this.getBatchChildOrderDetails;
  },
  methods: {
    ...mapMutations({
      setRemoveOrderStoreValue: 'fulfilment/setRemoveOrderStoreValue',
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    ...mapActions({
      remove_order_from_batch: 'fulfilment/remove_order_from_batch',
    }),
    closeDialog() {
      this.setRemoveOrderStoreValue(false);
    },
    async removeOrderFromBatch() {
      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: `missioncontrol/batches/${this.order_info.most_recent_batch_id}/removeorders`,
        apiKey: false,
        params: {
          orders: [this.order_info.order_id],
        },
      };
      try {
        const data = await this.remove_order_from_batch(payload);

        console.log('data', data);

        if (data.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Order Removal',
            'Order has been removed from batch successfully',
          );
          this.setRemoveOrderStoreValue(false);
          this.updateProcessingStatus(true);
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Order Removal Error', error_response);
        }
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
