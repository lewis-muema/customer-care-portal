<template>
  <div class="fulfilment-batch-actions">
    <el-row>
      <el-col :span="4">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-circle-close"
          plain
          v-if="
            (page === 'Outbound_ordersView' || page === 'Inbound_ordersView') &&
              canCancelOrder()
          "
          @click="triggerAction('cancel')"
          >Cancel</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-notebook-1"
          plain
          v-if="
            page === 'Outbound_batchesView' || page === 'Inbound_batchesView'
          "
          @click="triggerAction('details')"
          >Details</el-button
        >
      </el-col>

      <el-col :span="5">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-search"
          plain
          v-if="
            (page === 'Outbound_batchesView' ||
              page === 'Inbound_batchesView') &&
              canRequestForTransport() &&
              permissions.fulfilment_allocate_partner
          "
          @click="dialogVisible = true"
          >Request for transport</el-button
        >
      </el-col>
      <!-- <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Outbound_ordersView' || page === 'Inbound_ordersView'"
          @click="triggerAction('ticket')"
          >Tickets</el-button
        >
      </el-col> -->
      <el-col :span="4">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-date"
          plain
          v-if="
            (page === 'Outbound_ordersView' || page === 'Inbound_ordersView') &&
              canCancelOrder()
          "
          @click="triggerAction('schedule')"
          >Schedule</el-button
        >
      </el-col>

      <el-col :span="5">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-receiving"
          plain
          v-if="
            page === 'Outbound_ordersView' ||
              page === 'Inbound_ordersView' ||
              page === 'Outbound_batchesView' ||
              page === 'Inbound_batchesView'
          "
          @click="triggerAction('delivery_codes')"
          >Delivery Codes</el-button
        >
      </el-col>
      <!-- <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="
            page === 'Outbound_batchesView' ||
              page === 'Inbound_batchesView' ||
              page === 'Outbound_movableUnitsView'
          "
          @click="triggerAction('reallocate')"
          >Reallocate</el-button
        >
      </el-col> -->
      <!-- <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Inbound_batchesView'"
          @click="triggerAction('dispatch')"
          >Dispatch</el-button
        >
      </el-col> -->
      <!-- <el-col :span="4">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          icon="el-icon-refresh"
          plain
          @click="triggerAction('update_status')"
          v-if="page === 'Outbound_ordersView' || page === 'Inbound_ordersView'"
          >Update status</el-button
        >
      </el-col> -->
    </el-row>
    <el-row>
      <DeliveryCodes v-if="action === 'delivery_codes'" />
      <CancelOrder v-if="action === 'cancel'" />
      <Ticket v-if="action === 'ticket'" />
      <Reallocate v-if="action === 'reallocate'" />
      <Dispatch v-if="action === 'dispatch'" />
      <Details v-if="action === 'details'" />
      <Schedule v-if="action === 'schedule'" />
      <UpdateStatus
        :page="page"
        v-if="action === 'update_status'"
        :details="getTableDetails"
      />
    </el-row>
    <el-dialog
      title="Request for transport"
      :visible.sync="dialogVisible"
      class="requestTransportDialog"
      width="40%"
    >
      <RequestTransport @closeDialog="closeDialog($event)" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'OrderActions',
  components: {
    DeliveryCodes: () => import('./actions/DeliveryCodes'),
    CancelOrder: () => import('./actions/CancelOrder'),
    Ticket: () => import('./actions/Ticket'),
    Reallocate: () => import('./actions/Reallocate'),
    Dispatch: () => import('./actions/Dispatch'),
    Details: () => import('./actions/Details'),
    RequestTransport: () => import('./actions/RequestTransport'),
    UpdateStatus: () => import('./actions/UpdateStatus'),
    Schedule: () => import('./actions/Schedule'),
  },
  props: ['page', 'rowData'],
  data() {
    return {
      action: '',
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
    permissions() {
      return JSON.parse(this.userData.payload.data.privilege);
    },
  },
  methods: {
    triggerAction(action) {
      this.action = action;
    },
    closeDialog(data) {
      this.dialogVisible = data;
    },
    canRequestForTransport() {
      const batchStatus = this.getTableDetails.batch_status;
      const allowed =
        batchStatus === 'BATCH_IN_COMPOSITION' ||
        batchStatus === 'BATCH_FAILED_SHIPPING_ASSIGNMENT';
      return allowed;
    },
    canCancelOrder() {
      const orderStatus = this.getTableDetails.order_status;
      const allowed = orderStatus === 'ORDER_FAILED';
      return allowed;
    },
  },
};
</script>
<style scoped>
.blue {
  color: #528bb8;
  border-color: #528bb8;
  background-color: #ffffff;
  outline: none;
}
.blue:hover {
  color: #ffffff;
  background-color: #528bb8;
  border: none;
}
.el-button--primary.is-plain:active {
  background-color: #528bb8;
  border: none;
}
</style>
