<template lang="html">
  <div class="">
    <div class="">
      <div class="fulfilment-cancelation-text">
        Are you sure you want to remove order {{ order_info.order_id }} from
        this batch?
      </div>
    </div>
    <el-button
      type="danger"
      class="full-width remove-order-btn"
      @click="removeOrderFromBatch()"
    >
      Remove order from batch
    </el-button>
    <div class="close-order-dialog" @click="closeDialog()">
      Cancel
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      order_info: [],
    };
  },
  computed: {
    ...mapGetters({
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
    }),
  },
  watch: {
    getBatchChildOrderDetails(val) {
      this.order_info = val;
    },
  },
  beforeMount() {
    this.order_info = this.getBatchChildOrderDetails;
  },
  methods: {
    ...mapMutations({
      setRemoveOrderStoreValue: 'fulfilment/setRemoveOrderStoreValue',
    }),
    closeDialog() {
      this.setRemoveOrderStoreValue(false);
    },
    removeOrderFromBatch() {
      // handle request
    },
  },
};
</script>

<style lang="css" scoped></style>
