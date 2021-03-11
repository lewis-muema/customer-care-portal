<template>
  <div class="reorganize">
    <a class=" btn request_new_rider_place blue-color" @click="reorganize()">
      <!-- <i class="fa fa-sort-amount-asc"></i> -->
      <span id="re_organize_me">Load Fresh Data</span>
    </a>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  name: 'TheReorganizeBar',
  methods: {
    ...mapMutations({
      updateReorganizeStatus: 'setReorganizeStatus',
    }),
    reorganize() {
      this.updateReorganizeStatus(true);
    },
  },
};
</script>

<style scoped>
.blue-color {
  background: #527cbd !important;
  border-radius: 8px;
}
</style>
