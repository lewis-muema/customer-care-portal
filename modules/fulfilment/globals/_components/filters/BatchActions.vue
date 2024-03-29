<template>
  <div class="fulfilment-batch-actions">
    <el-row class="text-right pr-2">
      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        :disabled="selectedOrders.length === 0"
        v-if="page === 'Outbound_batchesView'"
        @click="showModal('movable', 'Create a movable unit')"
      >
        Create movable unit
      </el-button>

      <el-button
        type="primary"
        size="medium"
        class="fulfilment-action-button"
        :disabled="selectedOrders.length === 0"
        v-if="
          (page === 'Inbound_ordersView' || page === 'Outbound_ordersView') &&
            permissions.batch_fulfilment_orders
        "
        @click="showModal('batching', 'About these orders')"
      >
        Batch orders
      </el-button>
    </el-row>
    <el-dialog
      :modal="false"
      :title="title"
      :visible.sync="centerDialogVisible"
      class="fulfilmentDialog"
      width="30%"
      @close="closeDialog()"
      :key="componentKey"
    >
      <CreateMovableUnit v-if="page === 'Outbound_batchesView'" />
      <BatchOrders
        v-if="page === 'Inbound_ordersView' || page === 'Outbound_ordersView'"
        :orders="selectedOrders"
        :page="page"
        @dialogStatus="handleDialog"
      />
    </el-dialog>
    <el-dialog
      :modal="false"
      :title="title"
      :visible.sync="getMapDialogVisible"
      class="fulfilmentDialog"
      width="84%"
      :key="componentKey"
    >
      <MapReArrangeView :page="page" @dialogStatus="handleDialog" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'BatchActions',

  components: {
    CreateMovableUnit: () => import('../actions/CreateMovableUnit'),
    BatchOrders: () => import('../actions/BatchOrders'),
    MapReArrangeView: () => import('../actions/MapReArrangeView'),
  },
  mixins: [NotificationMxn],

  props: ['page'],

  data() {
    return {
      selectedOrders: [],
      centerDialogVisible: false,
      componentKey: 0,
      title: '',
    };
  },

  computed: {
    ...mapState(['userData']),
    ...mapGetters({
      getCheckedOrders: 'fulfilment/getCheckedOrders',
      getMapDialogVisible: 'fulfilment/getMapDialogVisible',
    }),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
    modalTitle() {
      const data = {
        Outbound_ordersView: 'Delivery Requests',
        Outbound_batchesView: 'Batched Orders',
        Outbound_movableUnitsView: 'Movable Units',
      };
      return data;
    },
  },
  watch: {
    getCheckedOrders(orders) {
      this.selectedOrders = orders;
    },
  },
  methods: {
    ...mapMutations({
      updateCheckedOrders: 'fulfilment/setCheckedOrders',
      updateSelectedCountry: 'fulfilment/setSelectedCountry',
    }),
    ...mapActions({
      fetchHubs: 'fulfilment/fetchHubs',
    }),
    async showModal(action, title) {
      this.title = title;
      this.centerDialogVisible = true;
      this.updateSelectedCountry(this.selectedOrders[0].country);
      await this.fetchHubs();
    },
    closeDialog() {
      this.selectedOrders = [];
      this.componentKey += 1;
    },
    handleDialog(dialogStatus) {
      this.closeDialog();
      this.centerDialogVisible = dialogStatus;
    },
  },
};
</script>

<style></style>
