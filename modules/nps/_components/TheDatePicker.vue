<template>
  <VueCtkDateTimePicker
    class="pick-delivery-docs-date form-control"
    formatted="YYYY-MM-DD HH:mm:00"
    output-format="YYYY-MM-DD HH:mm:00"
    v-model="selectedDate"
    :range="true"
    :no-label="true"
    :label="placeholder"
    id="nps"
  />
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheDatePicker',
  mixins: [NPSMxn],

  data() {
    return {
      selectedDate: '',
      hide: 'true',
      dateArray: null,
    };
  },
  computed: {
    placeholder() {
      return `This Month     ${this.npsDateRange}`;
    },
  },
  watch: {
    async selectedDate() {
      const seleceted = this.selectedDate;
      const startDate =
        this.selectedDate !== null
          ? await this.convertToUTC(this.selectedDate.start)
          : this.firstDayOfCurrentMonth;
      const endDate =
        this.selectedDate !== null
          ? await this.convertToUTC(this.selectedDate.end)
          : this.lastDayOfCurrentMonth;
      const dateArray = { startDate, endDate };
      await this.setnpsDateRange(dateArray);
    },
  },
  methods: {
    ...mapMutations(['setnpsDateRange']),
  },
};
</script>
<style scoped>
.datetimepicker {
  margin-left: -1em !important;
}
.form-control {
  padding: 0;
}
.date-holder {
  padding: 10px;
}
.pick-delivery-docs-date {
  margin-right: 1%;
  height: 45px;
  border-style: solid;
  border-width: 0.2px;
  border-color: #cccccc;
  padding-left: 0;
  background: #f5f7fa;
}
.date-info {
  padding-left: 7em;
  margin-bottom: 20px;
}
</style>
