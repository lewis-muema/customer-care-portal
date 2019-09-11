<template>
  <div>
    <div :id="`response_${orderNo}_reallocate`"></div>
    <form id="reallocate-form" @submit.prevent="reallocateOrder">
      <div class="form-group">
        <v-select
          :options="options"
          :reduce="reason => reason.code"
          label="reason"
          :placeholder="getSelectorPlaceholder"
          :id="`reallocate_reason_${orderNo}`"
          v-model="reason"
        >
        </v-select>
      </div>
      <div class="form-group">
        <textarea
          class="form-control rounded-0"
          :id="`reallocate_description_${orderNo}`"
          placeholder="Description"
          v-model="description"
        ></textarea>
      </div>
      <button class="btn btn-primary" style="width:200px;">
        Re-Allocate Orders
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'TheReallocateComponent',
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
        { code: '1', reason: 'More information' },
        { code: '2', reason: 'Delivery delay' },
        { code: '3', reason: 'Customer not reachable' },
        { code: '4', reason: 'Customer feedback' },
      ],
      placeholderItem: 'select reason for reallocating ..', // find value in selector items
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
