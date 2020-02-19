//Add UI to mark the order as completed and upload delivery notes for the order
//Add UI to link order to partner and update order amount, commission, service
//fee and insurance on CC portal
<template>
  <div class="col-md-12">
    <div class="box box-primary user-main">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="ordernumber">Order Number</label>
          <input
            type="text"
            class="form-control"
            id="ordernumber"
            v-model="ordernumber"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="pickup">Pick Up</label>
          <input
            type="text"
            class="form-control"
            id="pickup"
            v-model="fromcoordinates"
            disabled
          />
        </div>
        <div class="form-group col-md-6">
          <label for="destination">Destination</label>
          <input
            type="text"
            class="form-control"
            id="destination"
            v-model="tocoordinates"
            disabled
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          style="
    margin: 0px 0px 30px 15px;"
        >
          Complete Order
        </button>
      </form>
    </div>
  </div>
</template>
<script>
// import CreateOfflineOrderComponent from '~/modules/offlineOrders/_components/CreateOfflineOrderComponent';
// import ConfirmOfflineOrderComponent from '~/modules/offlineOrders/_components/ConfirmOfflineOrderComponent';
// import PickOfflineOrderComponent from '~/modules/offlineOrders/_components/PickOfflineOrderComponent';
// import CompleteOfflineOrderComponent from '~/modules/offlineOrders/_components/CompleteOfflineOrderComponent';
// import UpdatePartnerInfoComponent from '~/modules/offlineOrders/_components/UpdatePartnerInfoComponent';

import axios from 'axios';

export default {
  name: 'OfflineOrders',
  data() {
    return {
      ordernumber: '',
      fromcoordinates: '',
      tocoordinates: '',
    };
  },
  // components: {
  //   CreateOfflineOrderComponent,
  //   ConfirmOfflineOrderComponent,
  //   PickOfflineOrderComponent,
  //   CompleteOfflineOrderComponent,
  //   UpdatePartnerInfoComponent,
  // },
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
.input-group-icon {
  padding: 8px 12px;
}
</style>
