<template>
  <div :key="componentKey">
    <el-date-picker
      v-model="filterDate"
      type="date"
      placeholder="Filter by date"
      class="fulfilment-date-class reschedule-fulfilment-date"
    >
    </el-date-picker>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'DateFilter',
  props: ['page'],
  data() {
    return {
      componentKey: 0,
      filterDate: '',
      processing: false,
    };
  },
  computed: {
    ...mapGetters({
      getStatusMapping: 'fulfilment/getStatusMapping',
      getProcessingStatus: 'fulfilment/getProcessingStatus',
    }),
  },
  watch: {
    filterDate(val) {
      this.updateSelectedDate(val);
      this.forceRender();
    },
    getProcessingStatus(status) {
      this.processing = status;
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedDate: 'fulfilment/setSelectedStatus',
    }),
    forceRender() {
      this.componentKey += 1;
    },
  },
};
</script>
<style></style>
