<template>
  <el-container>
    <el-row :gutter="18">
      <el-col :span="6">
        <el-card shadow="never">
          <Timeline :activities="activities" />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col :span="24">
            <el-card shadow="never">
              <TableActions />
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card shadow="never">
              <TableDetailsTabs />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
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
  data() {
    return {
      activities: [
        {
          content: 'Order Received on',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          color: '#EE7D00',
          icon: 'el-icon-circle-check',
        },
        {
          content: 'Order is being picked',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          color: '#EE7D00',
          icon: 'el-icon-circle-check',
        },
        {
          content: 'Package is on the way',
          timestamp: '2018-04-03 20:46',
          size: 'large',
          color: '#7586C5',
        },
        {
          content: 'Default node',
          timestamp: '2018-04-03 20:46',
        },
      ],
    };
  },
};
</script>
<style scoped>
.el-row {
  width: 100%;
  margin-bottom: 20px;
}
</style>
