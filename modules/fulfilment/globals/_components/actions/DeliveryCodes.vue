<template>
  <div class="fulfilment-actions-holder" v-if="delivery_code">
    <div class="header">Handoff code</div>
    <span
      ><img class="handoff-image" :src="`${sendyS3Path}mission_control/hub.svg`"
    /></span>
    <span class="handoff-code">{{ delivery_code }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DeliveryCodes',
  data() {
    return {
      delivery_code: '',
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.delivery_code = this.getTableDetails.confirmation_pin;
  },
};
</script>
<style scoped>
.header {
  font-weight: 600;
  margin-bottom: 1em;
}
.handoff-code {
  font-size: 13px;
  margin: 0 4px;
}
.handoff-image {
  width: 4%;
}
</style>
