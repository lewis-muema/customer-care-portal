<template lang="html">
  <div class="">
    <el-tabs v-model="activeName" @tab-click="handleTab">
      <el-tab-pane label="Pending" name="pending">
        <Pending :key="componentKey" />
      </el-tab-pane>
      <el-tab-pane label="Approved" name="approved">
        <Approved :key="componentKey" />
      </el-tab-pane>
      <el-tab-pane label="Declined" name="declined">
        <Declined :key="componentKey" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pending from './Pending.vue';
import Approved from './Approved.vue';
import Declined from './Declined.vue';

export default {
  name: 'RefundsView',
  components: { Pending, Approved, Declined },
  data() {
    return {
      activeName: 'pending',
      componentKey: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleTab() {
      this.componentKey += 1;
    },
  },
};
</script>

<style lang="css"></style>
