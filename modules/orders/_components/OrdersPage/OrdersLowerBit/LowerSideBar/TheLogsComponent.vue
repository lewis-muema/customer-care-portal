<template>
  <ul
    class="timeline timeline-inverse"
    style="margin-top:35px;"
    v-if="deliveryLogs === null"
  >
    <li v-for="deliveryLog in deliveryLogs" :key="deliveryLog.index">
      <i :class="`fa ${logTypesColors[deliveryLog.log_type]} fasendy`"> </i>
      <div class="timeline-item">
        <span class="time"
          ><i class="fa fa-clock-o"></i>
          {{ getFormattedDate(deliveryLog.log_time, 'd MMM, h.mm a') }}
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
      // order: null,
      sampleOrder: null,
      deliveryLogs: null,
      logTypesColors: {
        1: 'fa-get-pocket bg-green',
        2: ' fa-thumbs-up bg-aqua',
        3: 'fa-road bg-blue',
        4: 'fa-check bg-green',
        5: 'fa-reply bg-yellow',
        6: 'fa-close bg-red',
        7: 'fa-calendar bg-purple',
        11: 'fa-envelope bg-blue',
      },
    };
  },
  mounted() {
    // this.sampleOrder = this.singleOrder();
    // this.deliveryLogs = this.sampleOrder.delivery_log;
  },
};
</script>
