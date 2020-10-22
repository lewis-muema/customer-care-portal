<template>
  <footer class="main-footer">
    <div class="pull-right hidden-xs"><b>Version</b> 1.4.4</div>
    <strong> &copy; {{ getYear }} SENDY.</strong>
    All rights reserved.
  </footer>
</template>
<script>
import moment from 'moment';

export default {
  name: 'TheFooter',
  computed: {
    getYear() {
      return moment().format('YYYY');
    },
  },
};
</script>
