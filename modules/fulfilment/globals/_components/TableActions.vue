<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
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
          plain
          v-if="
            page === 'Outbound_batchesView' || page === 'Inbound_batchesView'
          "
          @click="triggerAction('request_transport')"
          >Request for transport</el-button
        >
      </el-col>

      <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Outbound_ordersView' || page === 'Inbound_ordersView'"
          @click="triggerAction('cancel')"
          >Cancel</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Outbound_ordersView' || page === 'Inbound_ordersView'"
          @click="triggerAction('ticket')"
          >Tickets</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Outbound_ordersView' || page === 'Inbound_ordersView'"
          @click="triggerAction('delivery_codes')"
          >Delivery Codes</el-button
        >
      </el-col>
      <el-col :span="3">
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
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          class="blue"
          size="mini"
          plain
          v-if="page === 'Inbound_batchesView'"
          @click="triggerAction('dispatch')"
          >Dispatch</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <DeliveryCodes v-if="action === 'delivery_codes'" />
      <CancelOrder v-if="action === 'cancel'" />
      <Ticket v-if="action === 'ticket'" />
      <Reallocate v-if="action === 'reallocate'" />
      <Dispatch v-if="action === 'dispatch'" />
      <Details v-if="action === 'details'" />
      <RequestTransport
        v-if="action === 'request_transport'"
        :row-data="rowData"
      />
    </el-row>
  </div>
</template>
<script>
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
  },
  props: ['page', 'rowData'],
  data() {
    return {
      action: '',
    };
  },
  methods: {
    triggerAction(action) {
      this.action = action;
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
