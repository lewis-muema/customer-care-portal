<template>
  <div class="billing">
    <div class="col-md-6">
      <table class="waitingtime">
        <tr>
          <th>
            Waiting Time
            <span class="pull-right">
              Total Time Waited
            </span>
          </th>
        </tr>
        <tr v-for="(item, index) in waiting" :key="index">
          <td>
            <strong>From &nbsp;</strong>
            {{ item.start_time }} <strong>To &nbsp;</strong> {{ item.end_time }}

            <span class="pull-right">
              {{ Math.floor(item.waiting_time / 60) }}
              <strong> &nbsp;minutes</strong>
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div class="col-md-6">
      <table class="extradistance">
        <tr>
          <th>Approximate Extra Distance Covered in KMs</th>
        </tr>
        <tr v-for="(item, index) in distance" :key="index">
          <td>
            <strong>At Waypoint &nbsp;</strong> {{ item.waypoint_no }}
            <span class="pull-right">
              {{ (item.extra_distance / 1000).toFixed(2) }}
              <strong> &nbsp;Kilometers</strong>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BillingDataComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: this.order.billing_data.waiting_time,
      distance: this.order.billing_data.extra_distance,
    };
  },
};
</script>
//
<style>
.table {
  border: 0;
  padding: 5;
}
.waitingtime {
  width: 100%;
}
.extradistance {
  width: 100%;
}
.billing {
  display: flex;
}
</style>
