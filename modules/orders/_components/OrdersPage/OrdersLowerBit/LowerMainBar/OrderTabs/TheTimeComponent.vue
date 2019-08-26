<template>
  <span>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Order Time</td>
          <td>
            {{ this.getFormattedDate(pickupTime, 'dddd. h.mm a d-MMM-Y') }}
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <td>Estimated</td>
          <td>Actual</td>
          <td>Delay</td>
        </tr>
        <tr>
          <td>Life time</td>
          <td>{{ timeMetrics.estimated_lifetime }}</td>
          <td>{{ timeMetrics.actual_lifetime }}</td>
          <td>{{ timeMetrics.lifetime_delay }}</td>
        </tr>
        <tr>
          <td>Delivery time</td>
          <td>{{ timeMetrics.estimated_delivery_duration }}</td>
          <td>{{ timeMetrics.actual_delivery_duration }}</td>
          <td>{{ timeMetrics.delivery_delay }}</td>
        </tr>
        <tr>
          <td>Pick up time</td>
          <td>{{ timeMetrics.estimated_pickup_duration }}</td>
          <td>{{ timeMetrics.actual_pickup_duration }}</td>
          <td>{{ timeMetrics.pickup_delay }}</td>
        </tr>
      </tbody>
    </table>
  </span>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'TheTimeComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timeMetrics: this.order,
      pickupTime: this.pickup,
    };
  },
};
</script>
<style scoped>
.table {
  margin-bottom: 0;
}
</style>
