<template>
  <div>
    <form>
      <div class="form-group">
        <select
          name="tracker"
          id="trackersList"
          class="form-control proximity point"
        >
          <option
            v-for="(tracker, index) in available_trackers"
            :key="index"
            :value="`${tracker.uniqueId}`"
          >
            {{ tracker.name }}</option
          >
        </select>
      </div>
    </form>
    <button
      v-if="changed === 2"
      class="btn btn-primary action-button"
      @click="assign_trackers"
    >
      Assign Tracker
    </button>
    <button
      v-if="changed === 1"
      class="btn btn-primary action-button"
      @click="unassign_trackers"
    >
      Unassign Tracker
    </button>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TrackerComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      available_trackers: null,
      reason: '',
      e: '',
      trackerIMEI: '',
      trackerName: '',
      assignedImei: '',

      /**
       * This changed is used to determine which buttons to display
       * if changed = 1 means that it has been assigned a tracker s0 we show the unassigned button
       * if changed = 2 means that it hasnt been uassigned a tracker so we show the assign button
       */
      changed: '',
    };
  },
  mounted() {
    this.get_tracker_status();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      tracker_status: '$_orders/tracker_status',
      retrieve_available_trackers: '$_orders/tracker_status',
      assign_tracker: '$_orders/assign_tracker',
      unassignTracker: '$_orders/unassign_tracker',
    }),
    async get_tracker_status() {
      const notification = [];
      let actionClass = '';

      const payload = {
        app: 'POSITIONS',
        endpoint: 'get_tracker_details',
        apiKey: true,
        params: { order_no: this.orderNo },
      };
      try {
        const data = await this.tracker_status(payload);
        if (data.status === true) {
          this.assignedImei = data.tracker_imei;
          notification.push(
            `This order is assigned GPS Tracker - ${data.tracker_name}`,
          );
          actionClass = 'alert alert-info';
          this.changed = 1;
        } else {
          this.get_available_trackers();
          this.changed = 2;
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    async get_available_trackers() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'POSITIONS',
        endpoint: 'get_all_trackers',
        apiKey: true,
        params: {},
      };
      try {
        const data = await this.retrieve_available_trackers(payload);
        if (data.tracker.length >= 0) {
          this.available_trackers = data.tracker;
          this.changed = 2;
        } else {
          notification.push('There are no available trackers at this time');
          actionClass = 'alert alert-info';
          this.changed = 2;
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    async assign_trackers() {
      await this.get_available_trackers();
      const notification = [];
      let actionClass = '';
      const e = document.getElementById('trackersList');
      this.trackerName = e.options[e.selectedIndex].text;
      this.trackerIMEI = e.options[e.selectedIndex].value;
      const payload = {
        app: 'POSITIONS',
        endpoint: 'assign_tracker',
        apiKey: true,
        params: {
          imei: this.trackerIMEI,
          order_no: this.orderNo,
        },
      };
      try {
        const data = await this.assign_tracker(payload);
        if (data.status) {
          notification.push(
            `This order has been assigned to GPS Tracker${data.deviceid}`,
          );
          actionClass = this.display_order_action_notification(data.status);
          this.changed = 1;
        } else {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
          this.changed = 2;
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    async unassign_trackers() {
      const notification = [];
      let actionClass = '';
      const tracker = `${this.trackerIMEI}`;
      const tracker_name = `${this.trackerName}`;
      const payload = {
        app: 'POSITIONS',
        endpoint: 'unassign_tracker',
        apiKey: true,
        params: {
          imei: this.assignedImei,
        },
      };
      try {
        const data = await this.unassignTracker(payload);
        if (data.status) {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
          this.changed = 2;
        } else {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
          this.changed = 1;
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
