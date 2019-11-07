<template>
  <ul class="timeline timeline-inverse" style="margin-top:35px;">
    <li v-for="deliveryLog in order.delivery_logs" :key="deliveryLog.index">
      <i
        :class="
          `fa ${logTypesColors[deliveryLog.log_type] ||
            'fa-envelope bg-blue'} fasendy`
        "
      >
      </i>
      <div class="timeline-item">
        <span class="time"
          ><i class="fa fa-clock-o"></i>
          {{ getFormattedDate(deliveryLog.log_time, 'DD MMM ,YYYY hh.mm a ') }}
        </span>
        <h3 class="timeline-header no-border">
          {{ deliveryLog.description }}
        </h3>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'TheLogsComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.orderno,
      deliveryLogs: this.order.deliveryLogs,
    };
  },
};
</script>
