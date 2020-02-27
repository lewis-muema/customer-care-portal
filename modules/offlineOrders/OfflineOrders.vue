<template>
  <div class="col-md-12">
    <div>
      <create-offline-order-component />
    </div>
  </div>
</template>
<script>
import CreateOfflineOrderComponent from '~/modules/offlineOrders/_components/OrderActions/CreateOfflineOrderComponent';

export default {
  name: 'OfflineOrders',
  components: {
    CreateOfflineOrderComponent,
  },
  mounted() {},
};
</script>
<style>
.user-main {
  border-top: 3px solid #3c8dbc;
}
.form-inline .input-group {
  width: 100%;
}
.input-group-icon {
  padding: 8px 12px;
}
</style>
