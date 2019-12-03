<template>
  <span class="tt-suggestion">
    <p>
      <strong>{{ item.rider_name }}</strong>
    </p>
    <p>Phone: {{ item.phone_no }}</p>
    <p>Email: {{ item.email }}</p>
    <p>Signup Date: {{ getFormattedDate(item.date_signed_up, 'LLLL') }}</p>
  </span>
</template>
<script>
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'TheRiderSearchDisplay',
  extends: VueTypeahead,

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
