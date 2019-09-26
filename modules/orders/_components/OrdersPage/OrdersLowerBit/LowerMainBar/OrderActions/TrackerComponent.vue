<template>
  <div>
    <!-- <form id="tracker-form" @submit.prevent="trackerAssign"> -->
    <form>
      <div class="form-group">
        <!-- <v-select
          :options="options"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select cancellation reason .."
          class="form-control proximity-point"
          :id="`cancel_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select> -->
        <v-select :options="this.orders"> </v-select>
      </div>
      <button class="btn btn-primary action-button" @click="assign_tracker">
        Assign Tracker
      </button>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orders,
    };
  },
  methods: {
    get_tracker_status() {},
    assign_tracker() {},
  },
};
</script>
