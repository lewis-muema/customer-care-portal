<template>
  <div class="col-md-8">
    <TheOrderActionsComponent :order="order" />
    <TheOrderDetailsComponent :order="order" />
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
};
</script>
