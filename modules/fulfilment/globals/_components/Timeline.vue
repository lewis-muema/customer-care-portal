<template>
  <div class="">
    <p v-text="title" class="fulfilment-activity-header"></p>
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        icon="el-icon-circle-check"
        :type="activity.type"
        color="#EE7D00"
        size="medium"
        :timestamp="activity.timestamp"
      >
        <div class="fulfilment-timeline-header">{{ activity.description }}</div>
        <div class="fulfilment-timeline-timestamp">
          {{ getFormattedDate(activity.log_time, 'DD MMM ,YYYY hh.mm a ') }}
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      reverse: false,
      title: 'ACTIVITY',
    };
  },
};
</script>
