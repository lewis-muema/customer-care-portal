<template>
  <ul
    class="timeline timeline-inverse"
    style="margin-top:35px;"
    v-if="deliveryLogs !== null"
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
    this.sampleOrder = this.singleOrder();
    this.deliveryLogs = this.sampleOrder.delivery_log;
  },
  methods: {
    determine_class(logType) {},
  },
};
</script>
<style scoped>
.timeline {
  position: relative;
  margin: 0 0 30px 0;
  padding: 0;
  list-style: none;
}
.timeline > li {
  position: relative;
  margin-right: 10px;
  margin-bottom: 15px;
}
.timeline > li > .fa,
.timeline > li > .glyphicon,
.timeline > li > .ion {
  width: 30px;
  height: 30px;
  font-size: 15px;
  line-height: 30px;
  position: absolute;
  color: #666;
  background: #d2d6de;
  border-radius: 50%;
  text-align: center;
  left: 18px;
  top: 0;
}
.timeline > li > .timeline-item {
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin-top: 0;
  background: #fff;
  color: #444;
  margin-left: 60px;
  margin-right: 15px;
  padding: 0;
  position: relative;
}
.timeline > li > .timeline-item > .time {
  color: #999;
  float: right;
  padding: 10px;
  font-size: 12px;
}
.no-border {
  border: 0 !important;
}
.timeline > li > .timeline-item > .timeline-header {
  margin: 0;
  color: #555;
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
  font-size: 13px;
  line-height: 1.1;
}
.timeline-inverse > li > .timeline-item {
  background: #f0f0f0;
  border: 1px solid #ddd;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
