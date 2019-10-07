<template>
  <div>
    <div :id="`response_${orderNo}_reallocate`"></div>
    <form id="reallocate-form" @submit.prevent="reallocateOrder">
      <div class="form-group">
        <v-select
          :options="customerInfo"
          :reduce="reason => reason.code"
          name="reason"
          label="reason"
          placeholder="Select reallocation reason .."
          class="form-control proximity-point"
          :id="`reallocate_reason_${orderNo}`"
          v-model="reason"
          :class="{
            'is-invalid': submitted && $v.reason.$error,
          }"
        >
        </v-select>
        <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
          Reallocation reason is required
        </div>
      </div>
      <div class="form-group">
        <textarea
          type="text"
          v-model="description"
          :id="`reallocation_description_${orderNo}`"
          name="description"
          class="form-control"
          placeholder="Description"
          :class="{
            'is-invalid': submitted && $v.description.$error,
          }"
        >
        </textarea>
        <div
          v-if="submitted && !$v.description.required"
          class="invalid-feedback"
        >
          Description is required
        </div>
      </div>
      <button class="btn btn-primary action-button">
        Re-Allocate Orders
      </button>
    </form>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

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
      reason: '',
      description: '',
      submitted: false,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    reallocateOrder() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
    },
  },
};
</script>
