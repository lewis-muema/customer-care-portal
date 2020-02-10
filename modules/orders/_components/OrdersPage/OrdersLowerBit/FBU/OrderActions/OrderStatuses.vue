<template>
  <div>
    <div class="status-action">
      <div class="status-action-label">{{ statuses[stage].title }}</div>
      <button
        class="status-action-button"
        @click="confirmAction()"
        :class="[
          statuses[stage].phase === 2
            ? 'status-action-button-complete'
            : 'status-action-button-confirm',
          statuses[stage].phase === 3
            ? 'status-action-button-failed'
            : 'status-action-button-confirm',
          order.order_details.confirm_status === 0
            ? 'disabled-confirm-button'
            : '',
        ]"
      >
        <span v-if="statuses[stage].phase === 0">CONFIRM</span>
        <span v-if="statuses[stage].phase === 1"
          ><i class="el-icon-loading"
        /></span>
        <span v-if="statuses[stage].phase === 2"
          ><i class="el-icon-check"
        /></span>
        <span v-if="statuses[stage].phase === 3"
          ><i class="el-icon-close"
        /></span>
      </button>
    </div>
    <div class="indicators">
      <div
        v-for="(status, index) in statuses"
        :key="index"
        class="indicator-container"
      >
        <div
          class="indicator-divide"
          v-if="index !== statuses.length - 1"
        ></div>
        <div
          class="status-indicator"
          :class="stage === index ? 'active-status-indicator' : ''"
          @click="progress(index)"
        >
          <div
            class="progress-indicator"
            v-if="statuses[index].phase === 2"
          ></div>
        </div>
        <p class="center-text">{{ status.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'OrderStatuses',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statuses: [
        {
          title: 'Pending',
          response: 'pending',
          phase: 2,
          endpoint: '',
        },
        {
          title: 'Confirmed',
          response: 'confirmed',
          phase: 0,
          endpoint: '',
        },
        {
          title: 'Gate-In',
          response: 'gated_in',
          phase: 0,
          endpoint: 'v1/freight/gate_in',
        },
        {
          title: 'Gate-Out',
          response: 'gated_out',
          phase: 0,
          endpoint: 'v1/freight/gate_out',
        },
        {
          title: 'In transit',
          response: 'in_transit',
          phase: 0,
          endpoint: 'v1/freight/transit',
        },
        {
          title: 'Arrived',
          response: 'arrived',
          phase: 0,
          endpoint: 'v1/freight/arrive',
        },
        {
          title: 'Offloaded',
          response: 'offloaded',
          phase: 0,
          endpoint: 'v1/freight/offload',
        },
        {
          title: 'Container return',
          response: 'ec_returned',
          phase: 0,
          endpoint: '',
        },
        {
          title: 'Delivered',
          response: 'delivered',
          phase: 0,
          endpoint: '',
        },
      ],
      stage: 1,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
  },
  created() {
    this.resetStage();
  },
  methods: {
    ...mapActions({
      change_order_status: 'change_order_status',
    }),
    resetStage() {
      let loopCount = 0;
      this.statuses.forEach((row, i) => {
        if (loopCount === 0) {
          this.statuses[i].phase = 2;
          this.stage = i + 1;
          if (this.order.freight_details.freight_status === row.response) {
            loopCount = 1;
          }
        }
      });
    },
    progress(i) {
      if (
        i !== 0 &&
        this.stage !== this.statuses.length - 1 &&
        this.statuses[i - 1].phase === 2 &&
        this.stage + 1 === i
      ) {
        this.stage++;
      }
    },
    confirmAction() {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: this.statuses[this.stage].endpoint,
        params: {
          _user_email: this.userData.payload.data.email,
          _user_id: this.userData.payload.data.admin_id,
          action_user: this.userData.payload.data.name,
          channel: 'operations',
          data_set: 'cc_actions',
          order_no: this.order.order_details.order_no,
          rider_phone: this.order.rider_details.phone_no,
          sim_card_sn: this.order.rider_details.serial_no,
        },
      };
      if (this.statuses[this.stage].phase === 0) {
        this.statuses[this.stage].phase = 1;
        this.change_order_status(payload)
          .then(response => {
            if (response.data.status) {
              this.statuses[this.stage].phase = 2;
            } else {
              this.statuses[this.stage].phase = 3;
              setTimeout(() => {
                this.statuses[this.stage].phase = 0;
              }, 3000);
            }
          })
          .catch(error => {
            handleError(error);
          });
      }
    },
  },
};
</script>

<style>
.disabled-confirm-button {
  pointer-events: none;
  cursor: not-allowed !important;
  background: #1a7fc3a8;
  border: 1px solid #1a7fc3a8;
}
</style>
