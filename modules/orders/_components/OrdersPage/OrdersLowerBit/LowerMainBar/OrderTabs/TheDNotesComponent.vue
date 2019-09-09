<template>
  <div>{{ order }}</div>
</template>
<script>
export default {
  name: 'TheDNotesComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>
