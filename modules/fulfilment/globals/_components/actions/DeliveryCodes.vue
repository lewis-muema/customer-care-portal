<template>
  <div class="fulfilment-actions-holder" v-if="delivery_code">
    <div>
      <div class="header">Handoff code</div>
      <span
        ><img
          class="handoff-image"
          :src="`${sendyS3Path}mission_control/hub.svg`"
      /></span>
      <span class="handoff-code">{{ delivery_code }}</span>
    </div>
    <div class="return-code">
      <div class="header" v-if="return_code">Return code</div>
      <span
        ><img
          v-if="return_code"
          class="handoff-image"
          :src="`${sendyS3Path}mission_control/hub.svg`"
      /></span>
      <span class="handoff-code">{{ return_code }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DeliveryCodes',
  data() {
    return {
      delivery_code: '',
      return_code: '',
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.delivery_code = this.getTableDetails.confirmation_pin;
    this.return_code = this.getTableDetails.return_confirmation_pin;
  },
};
</script>
<style scoped>
.fulfilment-actions-holder {
  display: flex;
}
.return-code {
  margin-left: 2.5em;
}
.header {
  font-weight: 600;
  margin-bottom: 1em;
}
.handoff-code {
  font-size: 13px;
  margin: 0 4px;
}
.handoff-image {
  width: 35%;
}
</style>
