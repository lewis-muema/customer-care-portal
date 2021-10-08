<template lang="html">
  <div class="">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Estimated Weight</td>
          <td>{{ batch_details.weight }} {{ batch_details.weight_unit }}</td>
        </tr>
        <tr>
          <td width="50%">Total Volume</td>
          <td>
            {{ batch_details.total_volume }}{{ batch_details.volume_unit }}
          </td>
        </tr>
        <tr>
          <td width="50%">Region</td>
          <td>{{ batch_details.region }}</td>
        </tr>
        <tr>
          <td width="50%">Total Units</td>
          <td>{{ batch_details.total_units }}</td>
        </tr>
        <tr>
          <td width="50%">Waypoints</td>
          <td>{{ batch_details.waypoints }} locations</td>
        </tr>
        <tr>
          <td width="50%">Delivery Cost</td>
          <td>
            {{ batch_details.currency }} {{ batch_details.delivery_cost }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BatchesDetails',
  data() {
    return {
      batch_details: {
        weight: 400,
        weight_unit: 'Kgs',
        total_volume: 22,
        volume_unit: 'm',
        region: 'Makadara , Nairobi',
        total_units: 40,
        waypoints: 5,
        currency: 'KES',
        delivery_cost: 7800,
      },
    };
  },
};
</script>

<style lang="css" scoped>
.el-table td {
  border: 1px solid #ebeef5 !important;
}
.el-table tr {
  height: 35px !important;
}
</style>
