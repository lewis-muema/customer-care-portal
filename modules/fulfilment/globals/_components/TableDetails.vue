<template>
  <el-row>
    <div v-if="loading">
      <el-container>
        <el-row :gutter="18">
          <el-col :span="9">
            <el-card shadow="never">
              <Timeline :activities="activities" />
            </el-card>
          </el-col>
          <el-col :span="15">
            <el-row v-if="page !== 'deliveryHistory'">
              <el-col :span="24">
                <el-card shadow="never">
                  <TableActions :page="getActivePage" :row-data="orderInfo" />
                </el-card>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <TableDetailsTabs />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-container>
    </div>
    <div v-else class="text-center">
      <strong>Fetching data...</strong>
    </div>
  </el-row>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import Timeline from './Timeline.vue';
import TableActions from './TableActions.vue';
import TableDetailsTabs from './TableDetailsTabs.vue';
import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'TableDetails',
  components: {
    Timeline,
    TableActions,
    TableDetailsTabs,
  },
  mixins: [NotificationMxn],
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activities: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      getActivePage: 'getActivePage',
      getTableDetailKeyMetric: 'fulfilment/getTableDetailKeyMetric',
      getTableDetails: 'fulfilment/getTableDetails',
      getProcessingStatus: 'fulfilment/getProcessingStatus',
    }),
  },
  watch: {
    getTableDetails(val) {
      if (Object.keys(val).length > 0) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    },
    getProcessingStatus() {
      this.setTableDetails([]);
      this.processOrderDetails();
      this.fetchActivities();
    },
  },
  beforeMount() {
    this.setTableDetails([]);
    this.processOrderDetails();
    this.fetchActivities();
  },
  methods: {
    ...mapMutations({
      setTableDetails: 'fulfilment/setTableDetails',
      setAgentVehicleType: 'fulfilment/setAgentVehicleType',
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    ...mapActions({
      fetch_table_details: 'fulfilment/fetch_table_details',
      fetchActivitiesAction: 'fulfilment/fetchActivites',
    }),
    async processOrderDetails() {
      const payload = {
        app: this.page === 'deliveryHistory' ? 'AUTH' : 'FULFILMENT_SERVICE',
        endpoint:
          this.page === 'deliveryHistory'
            ? 'mission-control-bff/orders'
            : this.getTableDetailKeyMetric.endpoint,
        apiKey: false,
        params: {
          data_id:
            this.page === 'deliveryHistory'
              ? this.orderInfo.order_id
              : this.orderInfo[this.getTableDetailKeyMetric.id],
        },
      };
      if (this.page !== 'deliveryHistory') {
        this.setAgentVehicleType(this.orderInfo.shipping_agent_vehicle_type);
      }
      try {
        const data = await this.fetch_table_details(payload);

        if (data.status === 200) {
          if (this.getTableDetailKeyMetric.id === 'batch_id') {
            this.setTableDetails(data.data.data.batch);
          } else if (this.page === 'deliveryHistory') {
            this.setTableDetails(data.data.data.data.order);
          } else {
            this.setTableDetails(data.data.data.order);
          }
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Unable to retrieve details ', error_response);
        }
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
      this.updateProcessingStatus(false);
    },
    async fetchActivities() {
      const { order_id, batch_id } = this.orderInfo;

      const response = await this.fetchActivitiesAction({
        record_id: order_id ?? batch_id,
        type: typeof order_id === 'undefined' ? 'batches' : 'orders',
      });
      this.activities = response.data.events;
    },
  },
};
</script>
<style scoped>
.el-row {
  width: 100%;
  margin-bottom: 20px;
}
</style>
