<template>
  <div v-if="loading">
    <el-container>
      <el-row :gutter="18">
        <el-col :span="9">
          <el-card shadow="never">
            <Timeline :activities="activities" />
          </el-card>
        </el-col>
        <el-col :span="15">
          <el-row>
            <el-col :span="24">
              <el-card shadow="never">
                <TableActions :page="getActivePage" />
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
  },
  beforeMount() {
    this.setTableDetails([]);
    this.processOrderDetails();
    this.fetchActivities();
  },
  methods: {
    ...mapMutations({
      setTableDetails: 'fulfilment/setTableDetails',
    }),
    ...mapActions({
      fetch_table_details: 'fulfilment/fetch_table_details',
      fetchActivitiesAction: 'fulfilment/fetchActivites',
    }),
    async processOrderDetails() {
      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: this.getTableDetailKeyMetric.endpoint,
        apiKey: false,
        params: {
          data_id: this.orderInfo[this.getTableDetailKeyMetric.id],
        },
      };
      try {
        const data = await this.fetch_table_details(payload);

        if (data.status === 200) {
          if (this.getTableDetailKeyMetric.id === 'batch_id') {
            this.setTableDetails(data.data.data.batch);
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
