<template>
  <div class="body-box">
    <div v-if="deliveries.length === 0">No Orders</div>
    <table
      class="table table-bordered"
      :id="`peer_deliveries_table_${user}`"
      v-if="deliveries.length > 0"
    >
      <thead>
        <tr>
          <td></td>
          <td>Order No</td>
          <td>Date</td>
          <td>Rider</td>
          <td>From</td>
          <td>To</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(delivery, key) in deliveries" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ delivery.order_no }}</td>
          <td>
            {{ getFormattedDate(delivery.time_stamp, 'DD/MM/YYYY hh.mm a ') }}
          </td>
          <td>{{ delivery.rider_details.name }}</td>
          <td>{{ delivery.path.from }}</td>
          <td>{{ delivery.path.to }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheDeliveriesComponent',
  props: {
    deliveries: {
      type: Array,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
  },
};
</script>
