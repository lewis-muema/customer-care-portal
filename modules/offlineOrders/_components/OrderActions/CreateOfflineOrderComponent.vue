<template>
  <div class="col-md-12">
    <div class="box box-primary user-main offline--container">
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="destination">Destination</label>
          <vue-google-autocomplete
            ref="destination"
            id="map"
            classname="form-control"
            placeholder="Search location"
            @placechanged="getDestinationAddressData"
          >
          </vue-google-autocomplete>
        </div>
        <div class="form-group col-md-6">
          <label for="pickup">Pick Up</label>
          <vue-google-autocomplete
            ref="pickup"
            id="map1"
            classname="form-control"
            placeholder="Search location"
            @placechanged="getPickupAddressData"
          >
          </vue-google-autocomplete>
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
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import PricingConfigsMxn from '@/mixins/pricing_configs_mixin';

export default {
  name: 'CreateOfflineOrderComponent',
  components: { VueGoogleAutocomplete },
  mixins: [PricingConfigsMxn],
  data() {
    return {
      vendorid: 1,
      destination: '',
      pickup: '',
      clientemail: '',
      fromcoordinates: '',
      tocoordinates: '',
      vendorTypes: [],
      vendorName: '',
    };
  },
  computed: {
    ...mapGetters({
      getSessionData: 'getSession',
    }),
    vendor() {
      return this.vendorTypes.find(op => {
        return op.name === this.vendorName;
      });
    },
  },
  // components: {
  //   CreateOfflineOrderComponent,
  //   ConfirmOfflineOrderComponent,
  //   PickOfflineOrderComponent,
  //   CompleteOfflineOrderComponent,
  //   UpdatePartnerInfoComponent,
  // },
  mounted() {
    console.log('here', this.getSessionData);
    // const countryCode = this.user.user_details.country_code;
    // this.fetchVendorTypes(countryCode);
  },
  methods: {
    getDestinationAddressData(addressData, placeResultData, id) {
      const latitude = addressData.latitude;
      const longitude = addressData.longitude;
      this.destination = [latitude, longitude];
      console.log(this.destination);
    },
    getPickupAddressData(addressData, placeResultData, id) {
      const latitude = addressData.latitude;
      const longitude = addressData.longitude;
      this.pickup = [latitude, longitude];
      console.log(this.pickup);
    },
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
::placeholder {
  color: #c0c4cc;
  font-size: 0.8em;
}
</style>
