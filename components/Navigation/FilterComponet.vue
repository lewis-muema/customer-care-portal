<template>
  <div class="breadcrumb cop ">
    <span>
      <input
        type="checkbox"
        value="all"
        v-model="cop_ids"
        @change="checkAllCopids()"
      />
      All
    </span>
    <span v-for="item in cop_names" :key="item">
      <input
        type="checkbox"
        :value="item"
        v-model="cop_ids"
        @change="checkCopId()"
      />
      {{ item }}
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'FilterComponent',
  data() {
    return {
      isCheckAllCopIds: true,
      cop_ids: [],
      cop_names: ['normal', 'kiota', 'sendyGo'],
      copId_Data: [],
      selected_cop_ids: [],
    };
  },

  methods: {
    ...mapMutations({
      updateSelectedCopNames: 'setSelectedCopNames',
    }),
    checkAllCopids() {
      this.isCheckAllCopIds = true;
      this.cop_ids = [];
      console.log('all selected');

      this.printCopIds();
    },

    checkCopId() {
      this.isCheckAllCopIds = false;
      if (this.cop_ids.includes('normal')) {
        this.cop_ids = ['normal'];
      }

      console.log(this.cop_ids);
      this.printCopIds();
    },

    printCopIds() {
      this.selected_cop_ids = [];
      for (let i = 0; i < this.cop_ids.length; i++) {
        this.selected_cop_ids.push(this.cop_ids[i]);
      }
      this.updateSelectedCopNames(this.selected_cop_ids);
    },
  },
};
</script>

<style scoped>
.cop {
  right: 500px;
  color: #333;
  font-size: 13px;
  background: #ecf0f5;
  border: 1px solid #3333;
}

.cop > span {
  padding-left: 26px;
}
</style>
