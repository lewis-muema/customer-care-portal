<template lang="html">
  <div class="">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Order Number</td>
          <td>{{ order_details.order_no }}</td>
        </tr>
        <tr>
          <td width="50%">Batch</td>
          <td>
            {{ order_details.batch_no }}
          </td>
        </tr>
        <tr>
          <td width="50%">Vendor Type</td>
          <td>{{ order_details.vendor_type }}</td>
        </tr>
        <tr>
          <td width="50%">Fulfilment fee</td>
          <td>
            {{ order_details.currency }} {{ order_details.fulfilment_fee }}
          </td>
        </tr>
        <tr>
          <td width="50%">Number of items</td>
          <td>{{ order_details.items }} items</td>
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
      order_details: {
        order_no: 'ADHDHD383',
        batch_no: '#4744444',
        vendor_type: 'Bike',
        currency: 'KES',
        fulfilment_fee: 299,
        items: 4,
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
