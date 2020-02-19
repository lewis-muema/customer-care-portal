<template>
  <div class="col-md-12">
    <div class="box box-primary user-main">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="destination">Destination</label>
          <input
            type="text"
            class="form-control"
            id="destination"
            placeholder="Destination"
            v-model="tocoordinates"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="pickup">Pick Up</label>
          <input
            type="text"
            class="form-control"
            id="pickup"
            placeholder="Pick Up"
            v-model="fromcoordinates"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="vendorselect">Vendor select</label>
          <select class="form-control" id="vendorselect" v-model="vendorid">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>

        <div class="form-group col-md-6">
          <label for="clientemail">Email address</label>
          <input
            type="email"
            class="form-control"
            id="clientemail"
            placeholder="name@example.com"
            v-model="clientemail"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          style="
    margin: 0px 0px 30px 15px;"
        >
          Create Order
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
  name: 'CreateOfflineOrderComponent',
  data() {
    return {
      fromcoordinates: '',
      tocoordinates: '',
      vendorid: 1,
      clientemail: '',
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
