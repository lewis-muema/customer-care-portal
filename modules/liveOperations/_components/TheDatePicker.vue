<template>
  <VueCtkDateTimePicker
    class=""
    formatted="MMM DD YYYY"
    output-format="MMM DD YYYY"
    v-model="selectedDate"
    :range="true"
    :no-label="true"
    :label="placeholder"
    :right="right"
    id="liveops"
  />
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import LiveOpsMxn from '@/mixins/live_ops_mixin';

export default {
  name: 'TheDatePicker',
  mixins: [LiveOpsMxn],

  data() {
    return {
      selectedDate: '',
      hide: 'true',
      dateArray: null,
      right: true,
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
<style>
.datetimepicker .datepicker {
  min-width: 322px !important;
}
</style>
