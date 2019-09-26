<template>
  <table id="peer_list" class="table  table-bordered table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Vendor</th>
        <th>City</th>
        <th>Box</th>
        <th>Current</th>
        <th>Loan</th>
        <th>Savings</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <td>{{ this.riders_data.payments.rider_name }}</td>
      <td>{{ this.riders_data.phone_no }}</td>
      <td>{{ this.get_vendor_type() }}</td>
      <td>{{ this.riders_data.payments.city_name }}</td>
      <td>{{ this.get_carrier_type() }}</td>
      <td>
        {{
          (this.riders_data.payments.default_currency,
          this.riders_data.payments.current_list.running_balance)
        }}
      </td>
      <td>{{ this.riders_data.payments.rider_name }}</td>
      <td>{{ this.riders_data.payments.rider_name }}</td>
      <td>{{ this.riders_data.payments.rider_name }}</td>
    </tbody>
  </table>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheRiderTable',
  data() {
    return {
      riderID: null,
      riderDATA: null,
    };
  },
  computed: {
    ...mapGetters(['getRider']),
  },
  watch: {
    getRider(user) {
      return (this.riderID = user);
    },
  },
  methods: {
    get_rdier() {
      console.log(this.riders_data);
    },
    get_vendor_type() {
      // eslint-disable-next-line eqeqeq
      if (this.riders_data.payments.vendor_type == 1) {
        return 'Bike';
        // eslint-disable-next-line no-unreachable
      }
    },
    get_carrier_type() {
      if (this.riders_data.payments.carrier_type === 1) {
        return 'Box';
      }
    },
  },
};
</script>
