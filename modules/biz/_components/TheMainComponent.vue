<template>
  <div class="col-md-8">
    <div class="box box-primary user-main">
      <TheUserActionsComponent :user="user" />
      <TheUserDetailsComponent :user="user" />
    </div>
  </div>
</template>
<script>
import TheUserActionsComponent from '~/modules/biz/_components/TheUserActionsComponent';
import TheUserDetailsComponent from '~/modules/biz/_components/TheUserDetailsComponent';

export default {
  name: 'TheMainComponent',
  components: {
    TheUserActionsComponent,
    TheUserDetailsComponent,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.clearErrorMessages();
  },
};
</script>
<style>
.user-main {
  border-top: 3px solid #3c8dbc;
}
</style>
