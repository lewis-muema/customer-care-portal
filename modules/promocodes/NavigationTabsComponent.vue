<template>
  <div class="row coupon-nav">
    <button
      class="btn btn-primary action-button filter-button new-btn"
      @click.prevent="setNext()"
      v-if="typeof nextStep !== 'undefined'"
    >
      Save & Continue
    </button>
    <button
      class="btn btn-primary coupon-back"
      @click.prevent="setPrevious()"
      v-if="typeof previousStep !== 'undefined'"
    >
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </button>
    <a
      class="cancel-button new-btn close"
      data-dismiss="modal"
      aria-label="Close"
      v-if="typeof previousStep === 'undefined'"
    >
      Cancel
    </a>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'NavigationTabsComponent',
  props: ['nextStep', 'previousStep', 'step'],
  data() {
    return {
      submitted: false,
    };
  },

  methods: {
    isActive() {
      return this.activeItem === menuItem;
    },
    setNext(menuItem) {
      const nextStep = this.step + 1;
      this.$emit('menuItem', {
        step: nextStep,
        nextStep: this.nextStep,
        direction: 'next',
      });
    },
    setPrevious() {
      const previousStep = this.step - 1;

      this.$emit('menuItem', {
        step: previousStep,
        nextStep: this.previousStep,
        direction: 'previous',
      });
    },
  },
};
</script>

<style>
.coupon-nav {
  margin-right: 1em;
}
.coupon-back {
  background: #ffffff;
  border: none;
  color: #909399;
  font-size: 17px;
}
.new-btn {
  float: none !important;
  margin: auto !important;
}
.cancel-button {
  background: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.5px;
  color: #527cbd !important;
  opacity: 1;
  cursor: pointer;
  width: 100%;
  text-align: center;
}
</style>
