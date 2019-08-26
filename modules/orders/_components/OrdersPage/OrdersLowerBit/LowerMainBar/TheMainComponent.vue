<template>
  <div class="col-md-8">
    <TheOrderActionsComponent />
    <TheOrderDetailsComponent :order="orderDetails" />
  </div>
</template>

<script>
import TheOrderActionsComponent from './TheOrderActionsComponent';
import TheOrderDetailsComponent from './TheOrderDetailsComponent';

export default {
  name: 'TheMainComponent',
  components: {
    TheOrderActionsComponent,
    TheOrderDetailsComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
    };
  },
};
</script>
