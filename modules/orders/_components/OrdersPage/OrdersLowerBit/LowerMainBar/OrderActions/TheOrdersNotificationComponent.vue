<template>
  <div :class="displayClass">
    jhgfdsdfghjkh
    {{ actionNotification }}
    <b>{{ actionNotification }} </b>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'TheOrderNotificationComponent',
  computed: {
    ...mapState({
      displayClass: '$_orders/displayClass',
      actionNotification: '$_orders/actionNotification',
    }),
  },
  mounted() {
    console.log('actionNotification', this.actionNotification);
    console.log('displayClass', this.displayClass);
  },
};
</script>
