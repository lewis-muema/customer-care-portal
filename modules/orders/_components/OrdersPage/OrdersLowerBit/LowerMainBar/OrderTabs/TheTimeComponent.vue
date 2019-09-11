<template>
  <span>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Order Placed at:</td>
          <td>
            {{
              this.getOrderFormattedDate(
                eta.placed,
                'dddd. hh:mm a DD-MMM-YYYY',
              )
            }}
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
        </tr>
        <tr>
          <td>Confirmation time</td>
          <td>
            {{ this.displayDateRange(eta.etc) }}
          </td>
          <td>
            {{ this.displayDateTime(eta.confirmed) }}
          </td>
        </tr>
        <tr v-if="order.confirm_status === 1">
          <td>Pick up time</td>
          <td>
            {{ this.displayDateRange(eta.etp) }}
          </td>
          <td>
            {{ this.displayDateTime(eta.picked) }}
          </td>
        </tr>
        <tr v-if="order.delivery_status > 1">
          <td>Delivery time</td>
          <td>{{ this.displayDateRange(eta.etd) }}</td>
          <td>{{ this.displayDateTime(eta.delivered) }}</td>
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
    eta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_no,
    };
  },
  methods: {
    displayDateTime(date) {
      let displayString = '--';
      if (typeof date !== 'undefined') {
        displayString = this.getOrderFormattedDate(date, 'h.mm a');
      }
      return displayString;
    },
    displayDateRange(dateRange) {
      let displayString = '--';
      if (typeof dateRange !== 'undefined') {
        const range = dateRange.split('to');

        const eta_split = dateRange.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const timeFrom = this.getFormattedDate(start, 'h.mm a');
        const timeTo = this.getFormattedDate(end, 'h.mm a');
        displayString = `${timeFrom} - ${timeTo}`;
      }
      return displayString;
    },
  },
};
</script>
<style scoped>
.table {
  margin-bottom: 0;
}
</style>
