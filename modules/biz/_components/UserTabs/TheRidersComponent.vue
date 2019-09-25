<template>
  <div class="body-box">
    <div v-if="riders.length === 0 || riders === null">
      No Specific Riders allocated
    </div>
    <table
      class="table table-bordered"
      :id="`business_riders_table_${user}`"
      v-if="riders.length > 0"
    >
      <thead>
        <tr>
          <td></td>
          <td>Name</td>
          <td>Phone</td>
          <td>Status</td>
          <td>Type</td>
          <td>Tracker No</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rider, key) in riders" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ rider.rider_name }}</td>
          <td>{{ rider.phone_no }}</td>
          <td>{{ rider.rider_stat === 0 ? 'Inactive' : 'Active' }}</td>
          <td>{{ rider.carrier_type === 0 ? 'No Box' : 'Box' }}</td>
          <td>{{ rider.phone_no_1 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheRidersComponent',
  props: {
    riders: {
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
