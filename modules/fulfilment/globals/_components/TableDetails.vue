<template>
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
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

import Timeline from './Timeline.vue';
import TableActions from './TableActions.vue';
import TableDetailsTabs from './TableDetailsTabs.vue';

export default {
  name: 'TableDetails',
  components: {
    Timeline,
    TableActions,
    TableDetailsTabs,
  },
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activities: [
        {
          log_type: 1,
          log_time: '2021-09-24T15:03:59.000Z',
          description: 'Order received Monday',
        },
        {
          log_type: 36,
          log_time: '2021-09-24T15:03:59.000Z',
          description: 'Order has been packaged at the hub',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getActivePage: 'getActivePage',
    }),
  },
  beforeMount() {
    // process order details data here
  },
};
</script>
<style scoped>
.el-row {
  width: 100%;
  margin-bottom: 20px;
}
</style>
