<template>
  <td class="status-td">
    <span
      id="pending_count"
      class="label label-danger active-pending"
      @click="toggle_show('pending')"
    >
      <label id="pending_orders"> 0 </label> Pending
    </span>
    &nbsp;

    <span
      id="confirmed_count"
      class="label label-warning active-confirmed"
      @click="toggle_show('confirmed')"
    >
      <label id="confirmed_orders"> 0 </label> Confirmed
    </span>
    &nbsp;

    <span
      id="transit_count"
      class="label label-success active-transit"
      @click="toggle_show('transit')"
    >
      <label id="transit_orders"> 0 </label> In Transit
    </span>
  </td>
</template>
<script>
export default {
  name: 'TheStatusButtonsBar',
  data() {
    return {
      pending_show: 1,
      confirmed_show: 1,
      transit_show: 1,
      request_id_init: null,
    };
  },

  methods: {
    toggle_show(status) {
      const showStatus = `${status}_show`;
      const set = this.pending_show;
      const element = `${status}_count`;
      const css = `active-${status}`;
      console.log('testing status', this.showStatus);
      $(`#${element}`).toggleClass(css);
    },
  },
};
</script>
