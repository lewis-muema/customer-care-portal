<template>
  <div class="fulfilment-timeline-wrapper">
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
        <div class="fulfilment-timeline-header">
          {{ orderEvents[activity.event_code] }}
        </div>
        <div class="fulfilment-timeline-timestamp">
          {{ getFormattedDate(activity.event_time, 'DD MMM ,YYYY hh.mm a ') }}
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
      orderEvents: {
        'event.delivery.order.created': 'Order has been created',
        'event.delivery.at.hub.processing.for.delivery':
          'Order is being processed',
        'event.delivery.at.hub.waiting.for.partner':
          'Order is waiting to be assigned to partner',
        'event.delivery.at.hub.partner.assigned':
          'Order has been assigned to partner',
        'event.delivery.partner.enroute.to.hub':
          'Order is in transit to the hub',
        'event.delivery.partner.arrived.at.hub': 'Order has arrived at the hub',
        'event.delivery.partner.pickup.from.hub.confirmed.via.code':
          'Order picked by partner',
        'event.delivery.partner.enroute.to.buyer.location':
          'Order is enroute to the buyer',
        'event.delivery.partner.arrived.at.buyer.location':
          'Partner has reached at location as is ready to deliver your  package',
        'event.delivery.partner.submitted.items.to.buyer.confirmed.via.code':
          'Delivery code received awaiting partner confirmation',
      },
    };
  },
};
</script>
<style scoped>
.fulfilment-timeline-wrapper {
  height: 360px;
  overflow-y: scroll;
}
</style>
