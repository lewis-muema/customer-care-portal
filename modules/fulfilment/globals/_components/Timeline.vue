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
        'event.delivery.order.created': 'Order created',
        'event.delivery.at.hub.processing.for.delivery':
          'Order being processed',
        'event.delivery.at.hub.waiting.for.partner':
          'Order waiting to be assigned to partner',
        'event.delivery.at.hub.partner.assigned': 'Order assigned to partner',
        'event.delivery.partner.enroute.to.hub': 'Order in transit to hub',
        'event.delivery.partner.arrived.at.hub': 'Order arrived at hub',
        'event.delivery.partner.pickup.from.hub.confirmed.via.code':
          'Order picked by partner',
        'event.delivery.partner.enroute.to.buyer.location':
          'Order enroute to buyer',
        'event.delivery.partner.arrived.at.buyer.location':
          'Order arrived at buyer',
        'event.delivery.partner.submitted.items.to.buyer.confirmed.via.code':
          'Order received by buyer',
        'event.pickup.order.created': 'Order created',
        'event.pickup.at.hub.processing.for.delivery': 'Order being processed',
        'event.pickup.at.hub.waiting.for.partner':
          'Order waiting to be assigned to partner',
        'event.pickup.at.hub.partner.assigned': 'Order assigned to partner',
        'event.pickup.partner.enroute.to.hub': 'Order in transit to hub',
        'event.pickup.partner.arrived.at.hub': 'Order arrived at hub',
        'event.pickup.partner.pickup.from.hub.confirmed.via.code':
          'Order picked by partner',
        'event.pickup.partner.enroute.to.buyer.location':
          'Order enroute to buyer',
        'event.pickup.partner.arrived.at.buyer.location':
          'Order arrived at buyer',
        'event.pickup.partner.submitted.items.to.buyer.confirmed.via.code':
          'Order received buyer',
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
