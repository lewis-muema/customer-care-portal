<template>
  <div>
    <div
      class="active tab-pane"
      :id="`info${user.rider_id}`"
      style="color:#333;"
    >
      <div class="body-box">
        <table class="table table-bordered">
          <tr>
            <td width="50%">Email</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td width="50%">City</td>
            <td>{{ user.city_name }}</td>
          </tr>
          <tr>
            <td width="50%">Carrier</td>
            <td>{{ determine_carrier_type(user.carrier_type) }}</td>
          </tr>
          <tr>
            <td width="50%">Tracking Mode</td>
            <td>{{ determine_tracker_status(user.tracker) }}</td>
          </tr>

          <tr>
            <td width="50%">Allocation</td>
            <td>{{ determine_allocation(user.exclusivity_status) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  methods: {
    determine_carrier_type(carrier) {
      if (carrier === 1) {
        return 'Box';
      }
      return 'No Box';
    },

    determine_tracker_status(tracker) {
      if (tracker === 1) {
        return 'Tracker';
      }
      return 'Unknown';
    },

    determine_allocation(exclusivity_status) {
      if (exclusivity_status === 0) {
        return 'Open';
      }
      return 'Exculsive';
    },
  },
};
</script>
