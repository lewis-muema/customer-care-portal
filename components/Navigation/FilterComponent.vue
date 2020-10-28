<template>
  <div class="breadcrumb cop ">
    <span>
      <input
        type="checkbox"
        value="normal"
        v-model="isCheckAllCopIds"
        @change="checkAllCopids()"
      />
      Logistics
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
      cop_names: ['Kiota', 'SendyGO'],
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
      this.cop_ids = ['normal'];
      this.printCopIds();
    },

    checkCopId() {
      this.isCheckAllCopIds = false;
      if (this.cop_ids.includes('normal')) {
        this.cop_ids.shift();
      }
      this.printCopIds();
    },

    printCopIds() {
      this.selected_cop_ids = [...this.cop_ids];
      this.updateSelectedCopNames(this.selected_cop_ids);
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
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
