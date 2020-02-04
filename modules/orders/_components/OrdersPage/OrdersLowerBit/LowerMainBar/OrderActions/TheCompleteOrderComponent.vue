<template>
  <form @submit.prevent="completeOrder" class="form-inline">
    <div class="form-group col-md-12">
      <label class="reason">Reason</label>
      <textarea
        type="text"
        v-model="reason"
        :id="`completion_reason_`"
        name="reason"
        class="form-control"
        placeholder="Order completion order"
        :class="{
          'is-invalid': submitted && $v.reason.$error,
        }"
      >
      </textarea>
      <div v-if="submitted && !$v.reason.required" class="invalid-feedback">
        Order Completion Reason is required
      </div>
    </div>
    <div class="form-group col-md-12">
      <label class="col-md-12 uploads">Submit Delivery Notes</label>
      <div class="btn-group btn-group-justified">
        <a class="btn btn-default">Upload </a>
        <a class="btn btn-default">Scan</a>
      </div>
    </div>
    <div class="form-group col-md-12">
      <button class="btn btn-primary action-button">
        Complete Order
        <span v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i
        ></span>
      </button>
    </div>
  </form>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheCompleteOrderComponent',
  data() {
    return {
      reason: '',
      submitted: false,
      loading: false,
    };
  },
  validations: {
    params: {
      reason: { required },
    },
  },
  methods: {
    completeOrder() {
      conole.log('completeOrder');
    },
  },
};
</script>
<style scoped>
.btn-group > .btn-group:not(:last-child) > .btn,
.btn-group > .btn:not(:last-child):not(.dropdown-toggle) {
  margin-right: 6em;
}
.uploads {
  justify-content: left;
  margin-left: -1em;
  margin-bottom: 10px;
  font-weight: 600;
}
.reason {
  font-weight: 600;
}
.btn-default {
  cursor: pointer;
  margin-right: 6em;
  width: 8em;
  border-radius: 5px;
}
</style>
