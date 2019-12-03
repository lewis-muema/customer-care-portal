<template>
  <span>
    <div
      class="notifications alert alert-danger"
      v-if="notification.length > 0"
    >
      <strong> {{ notification }} </strong>
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
  computed: {
    ...mapState(['notification', 'errors']),
  },
};
</script>
