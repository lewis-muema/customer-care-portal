<template>
  <div>
    <div class="status-progress">
      <div class="progress-icon-left">
        <div
          class="progress-icon-active"
          @click="lastAction()"
          v-if="statuses[stage].phase === 0"
        >
          <i class="el-icon-back" />
        </div>
        <div class="progress-icon-inactive" v-else>
          <i class="el-icon-back" />
        </div>
        <p class="center-text">Back</p>
      </div>
      <div class="progress-icon-right">
        <div
          class="progress-icon-active"
          @click="nextAction()"
          v-if="statuses[stage].phase === 2"
        >
          <i class="el-icon-right" />
        </div>
        <div class="progress-icon-inactive" v-else>
          <i class="el-icon-right" />
        </div>
        <p class="center-text">Next</p>
      </div>
    </div>
    <div class="status-action">
      <div class="status-action-label">{{ statuses[stage].title }}</div>
      <button
        class="status-action-button"
        @click="confirmAction()"
        :class="
          statuses[stage].phase === 2
            ? 'status-action-button-complete'
            : 'status-action-button-confirm'
        "
      >
        <span v-if="statuses[stage].phase === 0">CONFIRM</span>
        <span v-if="statuses[stage].phase === 1"
          ><i class="el-icon-loading"
        /></span>
        <span v-if="statuses[stage].phase === 2"
          ><i class="el-icon-check"
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
        { title: 'Pending', phase: 2 },
        { title: 'Confirmed', phase: 0 },
        { title: 'Gate-In', phase: 0 },
        { title: 'Gate-Out', phase: 0 },
        { title: 'In transit', phase: 0 },
        { title: 'Offloaded', phase: 0 },
        { title: 'Container return', phase: 0 },
        { title: 'Delivered', phase: 0 },
      ],
      stage: 1,
    };
  },
  methods: {
    returnStatus(i) {},
    nextAction() {
      if (this.stage >= 0 && this.stage < this.statuses.length - 1) {
        this.stage++;
      }
    },
    lastAction() {
      if (this.stage > 0 && this.stage <= this.statuses.length - 1) {
        this.stage--;
      }
    },
    confirmAction() {
      if (this.statuses[this.stage].phase === 0) {
        this.statuses[this.stage].phase = 1;
        setTimeout(() => {
          this.statuses[this.stage].phase = 2;
        }, 2000);
      }
    },
  },
};
</script>

<style></style>
