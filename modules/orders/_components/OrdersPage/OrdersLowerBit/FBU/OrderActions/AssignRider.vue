<template>
  <div>
    <div class="driver-assign-inputs" v-if="ActiveTab">
      <OwnerDetails @ownerDetails="ownerData" :id="vehicle.owner_id" />
      <VehicleDetails
        @vehiclesDetails="vehicleData"
        :id="owner.owner_id"
        :ownername="owner.name"
      />
      <DriverDetails @driverDetails="driverData" />
      <button
        class="assign-order-button"
        :class="readyStatus ? 'inactive-assign-button' : ''"
        :disabled="readyStatus"
        @click="createPayload()"
      >
        Assign Order
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import DriverDetails from './DriverDetails';
import OwnerDetails from './OwnerDetails';
import VehicleDetails from './VehicleDetails';

export default {
  name: 'AssignRider',
  components: {
    DriverDetails,
    OwnerDetails,
    VehicleDetails,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ActiveClass: 'active-driver-assign-tabs',
      ActiveTab: true,
      owner: {
        owner_id: 0,
        name: '',
      },
      driver: {},
      vehicle: {
        owner_id: 0,
      },
      response: '',
      payload: '',
    };
  },
  computed: {
    readyStatus() {
      if (this.owner.owner_id > 0 && this.riderCheck && this.vehicleCheck) {
        return false;
      }
      return true;
    },
    newRider() {
      if (Object.prototype.hasOwnProperty.call(this.driver, 'rider_id')) {
        return false;
      }
      return true;
    },
    newVehicle() {
      if (Object.prototype.hasOwnProperty.call(this.vehicle, 'vehicle_id')) {
        return false;
      }
      return true;
    },
    riderCheck() {
      if (this.newRider) {
        if (
          Object.prototype.hasOwnProperty.call(this.driver, 'id_no') &&
          this.driver.id_no &&
          this.driver.id_no.length >= 6 &&
          this.driver.name &&
          this.driver.name.length >= 2 &&
          this.driver.dl_no &&
          this.driver.dl_no.length >= 4 &&
          this.driver.phone_no &&
          this.driver.phone_no.length >= 13 &&
          this.driver.rate &&
          this.driver.rate > 0
        ) {
          return true;
        }
      } else if (!this.newRider) {
        if (
          Object.prototype.hasOwnProperty.call(this.driver, 'rate') &&
          this.driver.rate &&
          this.driver.rate > 0
        ) {
          return true;
        }
      }
      return false;
    },
    vehicleCheck() {
      if (this.newVehicle) {
        if (
          Object.prototype.hasOwnProperty.call(
            this.vehicle,
            'registration_no',
          ) &&
          this.vehicle.registration_no &&
          this.vehicle.registration_no.length >= 3 &&
          this.vehicle.owner_id &&
          this.vehicle.insurance_no &&
          this.vehicle.insurance_no.length >= 3 &&
          this.vehicle.trailer &&
          this.vehicle.trailer.length >= 3 &&
          this.vehicle.kwartos
        ) {
          return true;
        }
      } else if (!this.newVehicle) {
        if (
          Object.prototype.hasOwnProperty.call(this.vehicle, 'trailer') &&
          this.vehicle.trailer &&
          this.vehicle.kwartos
        ) {
          return true;
        }
      }
      return false;
    },
  },
  mounted() {
    this.rootListener();
  },
  methods: {
    ownerData(data) {
      if (data) {
        this.owner = data;
      } else {
        this.owner = {
          owner_id: 0,
          name: '',
        };
      }
    },
    vehicleData(data) {
      if (data) {
        this.vehicle = data;
      } else {
        this.vehicle = {
          owner_id: 0,
        };
      }
    },
    driverData(data) {
      if (data) {
        this.driver = data;
      } else {
        this.driver = {};
      }
    },
    createPayload() {
      const payload = {
        vehicle_details: '',
        rider_details: '',
        order_details: {
          rider_phone: this.driver.phone_no,
          order_no: this.order.order_details.order_no,
          destination: { lat: -1.23, lng: 38.45 },
          distance: 9,
          polyline: 'encoded_string',
        },
      };
      if (!this.newVehicle) {
        payload.vehicle_details = this.existingVehiclePayload();
      } else {
        payload.vehicle_details = this.newVehiclePayload();
      }
      if (!this.newRider) {
        payload.rider_details = this.existingRiderPayload();
        this.allocateOrder(payload);
      } else {
        payload.rider_details = this.newRiderPayload();
        this.$root.$emit(
          `Save Driver ${this.order.order_details.order_no}`,
          true,
        );
      }
      this.payload = payload;
    },
    existingVehiclePayload() {
      const payload = {
        new_vehicle: false,
        vehicle_id: this.vehicle.vehicle_id,
        owner_id: this.owner.owner_id,
      };
      return payload;
    },
    newVehiclePayload() {
      const payload = {
        registration_no: this.vehicle.registration_no,
        box: 0,
        vendor_type: 25,
        owner_id: this.owner.owner_id,
        closed: 1,
        insurance_no: this.vehicle.insurance_no,
        new_vehicle: true,
      };
      return payload;
    },
    existingRiderPayload() {
      const payload = {
        new_rider: false,
        rider_id: this.driver.rider_id,
        vendor_type: 25,
        owner_id: this.owner.owner_id,
      };
      return payload;
    },
    newRiderPayload() {
      const payload = {
        registration_no: this.vehicle.registration_no,
        box: 0,
        vendor_type: 25,
        real_owner_id: this.owner.owner_id,
        closed: 1,
        driver_name: this.driver.name,
        phone_no: this.driver.phone_no,
        vendor_id: 25,
        owner_phone: this.owner.owner_id,
        dl_no: this.driver.dl_no,
        id_no: this.driver.id_no,
        refrigerated: 0,
        new_rider: true,
      };
      return payload;
    },
    rootListener() {
      this.$root.$on(
        `Allocate Driver ${this.order.order_details.order_no}`,
        () => {
          this.allocateOrder(this.payload);
        },
      );
    },
    ...mapActions({
      allocate_order: 'allocate_order',
    }),
    ...mapMutations({
      updateErrors: 'setErrors',
    }),
    async allocateOrder(orderPayload) {
      const payload = {
        app: 'AUTH',
        endpoint: 'v1/complete_partner_order/',
        params: orderPayload,
      };
      try {
        const data = await this.allocate_order(payload);
        if (!data.data.status) {
          this.updateErrors([
            `Failed to assign the order. ${
              Object.prototype.hasOwnProperty.call(data.data, 'reason')
                ? data.data.reason
                : ''
            }`,
          ]);
          setTimeout(() => {
            this.updateErrors([]);
          }, 2000);
        }
        return (this.response = data);
      } catch {
        this.updateErrors(['Failed to allocate order, Please try again']);
        setTimeout(() => {
          this.updateErrors([]);
        }, 2000);
      }
    },
  },
};
</script>

<style></style>
