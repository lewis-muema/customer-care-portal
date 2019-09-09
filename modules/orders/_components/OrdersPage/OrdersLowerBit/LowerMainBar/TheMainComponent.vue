<template>
  <div class="col-md-8">
    <TheOrderActionsComponent :orderdetails="orderdetails" />
    <TheOrderDetailsComponent :orderdetails="orderdetails" />
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
    orderdetails: {
      type: Object,
      required: true,
    },
  },
};
</script>
