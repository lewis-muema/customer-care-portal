<template>
  <footer class="main-footer">
    <div class="pull-right hidden-xs"><b>Version</b> 1.4.4</div>
    <strong> &copy; {{ getDate }} SENDY.</strong>
    All rights reserved.
  </footer>
</template>
<script>
const moment = require('moment');

export default {
  name: 'TheFooter',
  data() {
    return {};
  },
  computed: {
    getDate() {
      return moment().format('YYYY');
    },
  },
};
</script>
