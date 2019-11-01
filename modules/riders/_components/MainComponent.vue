<template>
  <div class="col-md-8">
    <div class="box box-primary user-main">
      <RiderActionsComponent :user="rider" />
      <RiderDetailsComponent :user="rider" />
    </div>
  </div>
</template>
<script>
import RiderActionsComponent from '~/modules/riders/_components/RiderActionsComponent';
import RiderDetailsComponent from '~/modules/riders/_components/RiderDetailsComponent';

export default {
  name: 'MainComponent',
  components: {
    RiderActionsComponent,
    RiderDetailsComponent,
  },
  props: {
    rider: {
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
.form-inline .input-group {
  width: 100%;
}
</style>
