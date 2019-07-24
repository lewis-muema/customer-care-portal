<template>
  <div class="col-md-8">
    <TheOrderActionsComponent />
    <TheOrderDetailsComponent />
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
};
</script>
