<template>
  <div class="settings-holder">
    <SettingsBoard />
  </div>
</template>

<script>
export default {
  layout: 'plain',
  name: 'Settings',
  components: {
    SettingsBoard: () => import('@/modules/liveOperations/Settings.vue'),
  },
};
</script>

<style></style>
