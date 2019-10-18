<template>
  <span class="tt-suggestion">
    <p class="user-name">
      <strong>{{ item.user_name }}</strong>
    </p>
    <p class="user-email">Email: {{ item.user_email }}</p>
    <p>Phone: {{ item.user_phone }}</p>
  </span>
</template>
<script>
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'ThePeerSearchDisplay',
  extends: VueTypeahead,

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
