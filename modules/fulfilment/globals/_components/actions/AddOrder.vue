<template>
  <el-row class="text-right mr-4 add-order">
    <el-button
      type="primary"
      class="add-batch-section"
      @click="centerDialogVisible = true"
    >
      + Add to batch
    </el-button>

    <el-dialog
      title="Add order to batch"
      :visible.sync="centerDialogVisible"
      width="30%"
      left
      class="text-left add-batch"
      @close="closeDialog()"
    >
      <div class="add-label">Order number</div>
      <SearchOrder
        section="orders"
        placeholder="Enter order number"
        @orderDetails="handleOrder"
        page="addOrder"
      />
      <el-row v-if="order" class="search-details">
        <div>Destination</div>
        <div class="search-value">{{ order.destination }}</div>

        <div>Recipient</div>
        <div class="search-value">{{ order.recipient_name }}</div>

        <div>Seller</div>
        <div class="search-value">{{ order.business_name }}</div>
      </el-row>

      <el-button
        type="primary"
        class="full-width action-submit-button"
        @click="addOrder()"
        :disabled="!order || disabled"
      >
        Add to batch
      </el-button>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'AddOrder',
  components: {
    SearchOrder: () => import('../filters/Search'),
  },
  mixins: [NotificationMxn],
  props: ['batch'],

  data() {
    return {
      centerDialogVisible: false,
      order: null,
      disabled: false,
      processing: false,
    };
  },
  computed: {
    ...mapGetters({
      getActivePage: 'getActivePage',
    }),
    orderNumbers() {
      const arr = [];
      if (this.order) {
        arr.push(this.order.order_id);
      }
      return arr;
    },
  },
  methods: {
    ...mapMutations({
      isSearching: 'fulfilment/setSearchingStatus',
    }),
    ...mapActions({
      perform_patch_actions: 'fulfilment/perform_patch_actions',
    }),
    handleOrder(orderDetails) {
      this.order = orderDetails;
    },
    closeDialog() {
      this.order = null;
      this.centerDialogVisible = false;
    },
    async addOrder() {
      this.processing = true;
      this.disabled = true;
      this.isSearching(false);

      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: `missioncontrol/batches/${this.batch}/addorders`,
        apiKey: false,
        params: {
          orders: this.orderNumbers,
        },
      };

      try {
        const res = await this.perform_patch_actions(payload);

        if (res.status === 200) {
          /* eslint no-restricted-globals: ["error", "event"] */
          this.doNotification(
            1,
            'Add to batch',
            `Order has been added to batch successfully`,
          );
          setTimeout(() => {
            this.centerDialogVisible = false;
          }, 800);
        } else {
          this.disabled = false;
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Add to batch', error_response);
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
  },
};
</script>

<style scoped>
.add-order .fa-spin {
  margin-left: -2em;
}
.add-order input::placeholder {
  color: #909399;
  font-size: 13px;
  line-height: 16px;
}
.search-details {
  background: rgba(196, 196, 196, 0.23);
  border-radius: 6px;
  margin-top: 3px;
  width: 90%;
  padding: 1em;
}
.search-value {
  font-size: 16px;
  /* line-height: 22px; */
  color: #000000;
  margin-bottom: 10px;
}
.action-submit-button.el-button.is-disabled,
.action-submit-button.el-button.is-disabled:focus,
.action-submit-button.el-button.is-disabled:hover {
  color: #c0c4cc;
  background-color: #f0f3f7;
  border-color: #f0f3f7;
}
.add-label {
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  margin-bottom: 10px;
}
</style>
