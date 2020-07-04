<template lang="html">
  <div class="">
    <el-tabs v-model="activeName" @tab-click="handleTab">
      <!-- <el-tab-pane label="Statistics" name="statistics">
        <Statistics :key="componentKey" />
      </el-tab-pane> -->
      <el-tab-pane label="Rewards" name="rewards">
        <Rewards :key="componentKey" />
      </el-tab-pane>
      <el-tab-pane label="Penalties" name="penalties">
        <Penalties :key="componentKey" />
      </el-tab-pane>
      <el-tab-pane label="Warning Messages" name="warning">
        <Warning :key="componentKey" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Statistics from './StatisticsComponent.vue';
import Rewards from './RewardsComponent.vue';
import Penalties from './PenaltiesComponent.vue';
import Warning from './WarningComponent.vue';

export default {
  name: 'RewardsView',
  components: { Rewards, Penalties, Warning },
  data() {
    return {
      activeName: 'rewards',
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
