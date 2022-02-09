<template>
  <div :key="componentKey">
    <el-select
      v-model="status"
      multiple
      collapse-tags
      placeholder="Filter by status"
      :disabled="processing"
    >
      <el-option
        v-for="item in sectionStatuses"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'SellerStatusFilter',
  props: ['page'],
  data() {
    return {
      componentKey: 0,
      status: [],
      value2: [],
      processing: false,
    };
  },
  computed: {
    ...mapGetters({
      getStatusMapping: 'fulfilment/getStatusMapping',
      getProcessingStatus: 'fulfilment/getProcessingStatus',
    }),

    section() {
      return this.page === 'Outbound_ordersView' ||
        this.page === 'Inbound_ordersView'
        ? 'order'
        : 'batch';
    },
    sectionStatuses() {
      const filteredStatus = this.getStatusMapping.filter(
        event => event.type === this.section,
      );
      const all = {
        label: 'All',
        value: 'all',
        type: '',
      };
      filteredStatus.unshift(all);
      return filteredStatus;
    },
  },
  watch: {
    status(val) {
      this.updateSelectedStatus(val);
      this.forceRender();
    },
    getProcessingStatus(status) {
      this.processing = status;
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedStatus: 'fulfilment/setSelectedStatus',
    }),
    forceRender() {
      this.componentKey += 1;
    },
  },
};
</script>
<style>
.fulfilment-status-filter .el-select {
  border: 1px solid #9e9e9e;
  background-color: #fff;
  box-shadow: none;
  margin: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  z-index: 1000;
}
</style>
