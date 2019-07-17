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

<style>
.label {
  display: inline;
  padding: 0.2em 0.6em 0.3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
}
</style>
