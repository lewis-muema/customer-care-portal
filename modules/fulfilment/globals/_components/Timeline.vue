<template>
  <div class="fulfilment-timeline-wrapper">
    <p v-text="title" class="fulfilment-activity-header"></p>
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="timelineIcon"
        :type="activity.type"
        color="#EE7D00"
        size="medium"
        :timestamp="activity.timestamp"
      >
        <div class="fulfilment-timeline-activity">
          <div class="fulfilment-timeline-header">
            {{ orderEvents[activity.event_code] }}
          </div>
          <div class="fulfilment-timeline-timestamp">
            {{ formatDate(activity.event_date) }}
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import moment from 'moment';

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
        'event.pickup.order.created': 'Order has been created',
        'event.pickup.processing.for.pickup':
          'Order is being processed for pickup',
        'event.pickup.partner.enroute.to.pickup.location':
          'Order is on its way to pickup location',
        'event.pickup.partner.assigned': 'Order has been assigned to partner',
        'event.pickup.partner.enroute.to.pickup.location':
          'Partner is on the way to pickup the order',
        'event.pickup.partner.arrived.at.pickup.location':
          'Partner has arrived at pickup location',
        'event.pickup.partner.enroute.to.hub':
          'Partner is on the way to the hub',
        'event.pickup.partner.arrived.at.hub': 'Partner has arrived at the hub',
        'event.pickup.partner.submitted.items.at.hub.confirmed.via.code':
          'Partner has submitted items at the hub',
        'event.pickup.hub.items.received.at.hub':
          'Order has been received at the hub',
        'batch.created': 'Batch has been created',
      },
    };
  },
  computed: {
    timelineIcon() {
      return 'el-icon-success';
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD MMM ,YYYY hh.mm a ');
    },
  },
};
</script>
<style scoped>
.fulfilment-timeline-wrapper {
  height: 360px;
  overflow-y: scroll;
}
.fulfilment-timeline-activity {
  box-shadow: 2px 2px 24px rgb(0 0 0 / 25%);
  padding-left: 4%;
  font-family: Nunito, sans-serif;
  width: 90% !important;
  padding-top: 2%;
  padding-bottom: 2%;
}
</style>
