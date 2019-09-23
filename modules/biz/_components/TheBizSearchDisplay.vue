<template>
  <span class="tt-suggestion">
    <p class="user-name">
      <strong>{{ item.cop_name }}</strong>
    </p>
    <p>Phone: {{ item.cop_phone }}</p>
    <p class="user-email">Email: {{ item.cop_email }}</p>
    <p>Contact Person: {{ item.contact_person }}</p>
    <p>Account No: {{ item.account_no }}</p>
  </span>
</template>
<script>
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'TheBizSearchDisplay',
  extends: VueTypeahead,

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style>
.user-name {
  color: #3c8dbc;
}
.user-email {
  float: right;
}
</style>
