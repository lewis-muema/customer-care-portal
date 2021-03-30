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
          <span
            v-if="
              deliveryLog.log_type === 4 &&
                isSendyStaff(signedByName) &&
                !isDnoteUpload(signedByName)
            "
          >
            <strong
              >( Completion done from CC portal by {{ signedByName }})</strong
            >
          </span>
        </h3>
      </div>
    </li>
  </ul>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

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
      deliveryLogs: this.order.delivery_logs,
      status: this.order.order_details.order_status,
    };
  },
  computed: {
    ...mapState(['userData']),
    signedByName() {
      const deliveryArray =
        this.status === 'delivered' &&
        this.order.delivery_details.delivery_images.length > 0
          ? this.order.delivery_details.delivery_images
          : null;
      // eslint-disable-next-line prettier/prettier
      const lastArray = deliveryArray ? deliveryArray.slice(-1)[0] : null;
      return lastArray ? lastArray.name : null;
    },
  },
};
</script>
