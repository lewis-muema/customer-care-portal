<template>
  <td class="reorganize">
    <a class=" btn btn-primary request_new_rider_place" @click="reorganize()">
      <i class="fa fa-sort-amount-asc"></i>
      <span id="re_organize_me">Re-Organize</span>
    </a>
  </td>
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
