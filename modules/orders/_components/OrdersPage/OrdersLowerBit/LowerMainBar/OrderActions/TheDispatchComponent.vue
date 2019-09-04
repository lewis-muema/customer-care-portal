<template>
  <div>
    <div :id="`response_${orderNo}_dispatch`"></div>
    <form id="dispatch-form" @submit.prevent="dispatchOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          label="reason"
          :placeholder="getSelectorPlaceholder"
          :id="`dispatch_reason_${orderNo}`"
          v-model="reason"
        >
        </v-select>
      </div>
      <div class="form-group">
        <p>The order will be broadcasted to all the riders near the pickup</p>
      </div>
      <button class="btn btn-primary" style="width:200px;">
        Dispatch Order
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TheDispatchComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      options: [
        { code: '2', reason: 'Rider without a box' },
        { code: '11', reason: 'Rider Unreachable' },
        { code: '12', reason: 'Rider rejected' },
      ],
      placeholderItem: 'select reason for dispatching ..', // find value in selector items
      reason: '',
      description: '',
    };
  },
  computed: {
    ...mapState(['userData']),

    getSelectorPlaceholder() {
      return this.placeholderItem;
    },
  },
};
</script>
