<template>
  <span>
    <div
      class="notifications alert alert-danger"
      v-if="notification.length > 0"
    >
      {{ notification }}
    </div>
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="error in errors" :key="error.index">
          <b>{{ error }}</b>
        </li>
      </ul>
    </div>
  </span>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'TheNotificationsComponent',
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState(['notification']),
  },
};
</script>
