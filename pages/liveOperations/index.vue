<template>
  <div class="nps-container">
    <Dashboard />
  </div>
</template>
<script>
export default {
  layout: 'plain',

  components: {
    Dashboard: () => import('@/modules/liveOperations/Dashboard.vue'),
  },
};
</script>
