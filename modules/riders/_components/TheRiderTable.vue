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
      {{
        riderID
      }}
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
};
</script>
