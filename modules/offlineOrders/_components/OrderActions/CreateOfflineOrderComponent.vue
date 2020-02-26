<template>
  <div class="col-md-12">
    <div
      v-if="createOrder"
      class="box box-primary user-main offline--container"
    >
      <form style="padding:30px;">
        <div class="form-group col-md-6">
          <label for="destination">Destination</label>
          <vue-google-autocomplete
            types=""
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
            types=""
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
          <select class="form-control" id="vendorselect" v-model="vendorId">
            <option>Choose vendor</option>
            <option
              v-for="vendor in vendorTypes"
              :key="vendor.id"
              :value="vendor.id"
              >{{ vendor.name }}</option
            >
          </select>
        </div>

        <div class="form-group col-md-6">
          <label for="clientEmail">Email address</label>
          <input
            type="email"
            class="form-control"
            id="clientEmail"
            placeholder="name@example.com"
            v-model="clientEmail"
          />
        </div>
        <button
          type="button"
          class="btn btn-primary create-order--btn"
          @click="createOfflineOrder"
        >
          Create Order
        </button>
      </form>
    </div>
    <div v-if="confirmOrder">
      <ConfirmOfflineOrderComponent />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import ConfirmOfflineOrderComponent from './ConfirmOfflineOrderComponent';

export default {
  name: 'CreateOfflineOrderComponent',
  components: { VueGoogleAutocomplete, ConfirmOfflineOrderComponent },
  data() {
    return {
      vendorId: 1,
      destination: '',
      pickup: '',
      clientEmail: '',
      fromCoordinates: '',
      toCoordinates: '',
      vendorTypes: [],
      vendorName: '',
      pickupCountryCode: '',
      DestinationCountryCode: '',
      createOrder: true,
      confirmOrder: false,
    };
  },
  computed: {
    ...mapGetters({
      getSessionData: 'getSession',
    }),
    countryCodes() {
      return (
        this.DestinationCountryCode !== '' && this.pickupCountryCode !== ''
      );
    },
  },
  watch: {
    countryCodes(val) {
      this.fetchVendorTypes();
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      updateOrderAmount: 'setOrderAmount',
      updatePickUp: 'setPickUp',
      updateDropoff: 'setDropoff',
    }),
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      create_offline_order: 'create_offline_order',
    }),
    getDestinationAddressData(addressData, placeResultData, id) {
      const latitude = addressData.latitude;
      const longitude = addressData.longitude;
      const countryName = addressData.country;
      this.toCoordinates = `${latitude}, ${longitude}`;
      // eslint-disable-next-line
      const { getCode } = require('country-list');
      this.DestinationCountryCode = getCode(countryName);
    },
    getPickupAddressData(addressData, placeResultData, id) {
      const latitude = addressData.latitude;
      const longitude = addressData.longitude;
      const countryName = addressData.country;
      this.fromCoordinates = `${latitude}, ${longitude}`;
      // eslint-disable-next-line
      const { getCode } = require('country-list');
      this.pickupCountryCode = getCode(countryName);
    },

    async fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'vendors/types',
        apiKey: false,
        params: {
          pickup_country_code: this.pickupCountryCode,
          dropoff_country_code: this.DestinationCountryCode,
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        return (this.vendorTypes = data.vendor_types);
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    async createOfflineOrder() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'OFFLINE_PRICING',
        endpoint: 'offline_request',
        apiKey: false,
        params: {
          pick_up_coordinates: '-1.2987826,36.76318070000002',
          drop_off_coordinates: '-1.3001097,36.7706334',
          vendor_id: this.vendorId,
          client_email: this.clientEmail,
        },
      };
      try {
        const data = await this.create_offline_order(payload);
        if (data.status) {
          const pickup = data.values.from_name;
          const dropoff = data.values.to_name;
          const orderAmount =
            data.values.economy_price_tiers[0].price_tiers[0].cost;
          this.updateOrderAmount(orderAmount);
          this.updatePickUp(pickup);
          this.updateDropoff(dropoff);
          this.createOrder = false;
          this.confirmOrder = true;
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
<style scoped>
.user-main {
  border-top: 3px solid #3c8dbc;
}
.create-order--btn {
  margin: 0px 0px 30px 15px;
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
