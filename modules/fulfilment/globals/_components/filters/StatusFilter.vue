<template>
  <div :key="componentKey">
    <el-select v-model="status" multiple placeholder="All Orders">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'StatusFilter',
  data() {
    return {
      componentKey: 0,
      options: [
        {
          value: 1,
          label: 'Pending',
        },
        {
          value: 2,
          label: 'Confirmed',
        },
        {
          value: 3,
          label: 'In Transit',
        },
        {
          value: 4,
          label: 'Delivered',
        },
        {
          value: 5,
          label: 'Cancelled',
        },
      ],
      status: [],
      value2: [],
    };
  },
  watch: {
    status(val) {
      this.updateSelectedStatus(val);
      this.forceRender();
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
