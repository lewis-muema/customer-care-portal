<template>
  <td>
    <span
      id="pending_count"
      class="label label-danger active-pending"
      onclick="toggle_show('pending')"
    >
      <label id="pending_orders"> 0 </label> Pending
    </span>
    &nbsp;

    <span
      id="confirmed_count"
      class="label label-warning active-confirmed"
      onclick="toggle_show('confirmed')"
    >
      <label id="confirmed_orders"> 0 </label> Confirmed
    </span>
    &nbsp;

    <span
      id="transit_count"
      class="label label-success active-transit"
      onclick="toggle_show('transit')"
    >
      <label id="transit_orders"> 0 </label> In Transit
    </span>
  </td>
</template>
<script>
export default {
  name: 'TheStatusButtonsBar',
};
</script>
