<template>
  <table id="peer_list" class="table  table-bordered table-hover">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Sign Up Date</th>
      </tr>
    </thead>
    <tbody>
      {{
        userID
      }}
    </tbody>
  </table>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ThePeerTable',
  data() {
    return {
      userID: null,
    };
  },
  computed: {
    ...mapGetters(['getPeerUser']),
  },
  watch: {
    getPeerUser(user) {
      return (this.userID = user);
    },
  },
};
</script>
