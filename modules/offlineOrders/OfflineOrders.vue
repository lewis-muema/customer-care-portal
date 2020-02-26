<template>
  <div class="col-md-12">
    <div>
      <create-offline-order-component />
    </div>
  </div>
</template>
<script>
import CreateOfflineOrderComponent from '~/modules/offlineOrders/_components/OrderActions/CreateOfflineOrderComponent';
// import ConfirmOfflineOrderComponent from '~/modules/offlineOrders/_components/ConfirmOfflineOrderComponent';
// import PickOfflineOrderComponent from '~/modules/offlineOrders/_components/PickOfflineOrderComponent';
// import CompleteOfflineOrderComponent from '~/modules/offlineOrders/_components/CompleteOfflineOrderComponent';
// import UpdatePartnerInfoComponent from '~/modules/offlineOrders/_components/UpdatePartnerInfoComponent';

export default {
  name: 'OfflineOrders',
  components: {
    CreateOfflineOrderComponent,
    // ConfirmOfflineOrderComponent,
    // PickOfflineOrderComponent,
    // CompleteOfflineOrderComponent,
    // UpdatePartnerInfoComponent,
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
