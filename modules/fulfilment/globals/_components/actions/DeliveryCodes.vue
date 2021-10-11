<template>
  <div class="fulfilment-actions-holder">
    <div class="header">Handoff code</div>
    <span
      ><img class="handoff-image" :src="`${sendyS3Path}mission_control/hub.svg`"
    /></span>
    <span class="handoff-code">5466</span>
  </div>
</template>

<script>
export default {
  name: 'DeliveryCodes',
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
