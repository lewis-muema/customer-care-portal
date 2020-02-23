<template>
  <div>
    <div class="driver-assign-inputs" v-if="ActiveTab">
      <OwnerDetails @ownerDetails="ownerData" :id="vehicle.owner_id" />
      <VehicleDetails
        @vehiclesDetails="vehicleData"
        :id="owner.owner_id"
        :ownername="owner.name"
      />
      <DriverDetails @driverDetails="driverData" :order="order" />
      <button
        v-if="!assigned"
        class="assign-order-button"
        :class="[
          readyStatus ? 'inactive-assign-button' : '',
          loading ? 'sending-status-button' : '',
        ]"
        :disabled="readyStatus"
        @click="createPayload()"
      >
        Assign Order
        <i class="fa fa-spinner fa-spin loading-spinner" v-if="loading"></i>
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
      loading: false,
      assigned: false,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
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
        return true;
      }
      return false;
    },
  },
  beforeDestroy() {
    this.$root.$off(`Allocate Driver ${this.order.order_details.order_no}`);
  },
  mounted() {
    this.rootListener();
  },
  methods: {
    ownerData(data) {
      if (data) {
        this.owner = data;
        this.vehicle.owner_id = this.owner.owner_id;
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
      };
      if (!this.newVehicle) {
        payload.vehicle_details = this.existingVehiclePayload();
      } else {
        payload.vehicle_details = this.newVehiclePayload();
      }
      if (!this.newRider) {
        payload.rider_details = this.existingRiderPayload();
        this.partnerReallocation(payload);
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
        owner_id: this.owner.owner_id,
        vehicle_id: this.vehicle.vehicle_id,
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
        trailer_no: this.vehicle.trailer,
        kwartos_code: this.vehicle.kwartos,
        new_vehicle: true,
      };
      return payload;
    },
    existingRiderPayload() {
      const payload = {
        new_rider: false,
        rider_id: this.driver.rider_id,
      };
      return payload;
    },
    newRiderPayload() {
      const payload = {
        vendor_type: 25,
        real_owner_id: this.owner.owner_id,
        closed: 1,
        driver_name: this.driver.name,
        phone_no: this.driver.phone_no,
        owner_phone: this.owner.owner_id,
        dl_no: this.driver.dl_no,
        id_no: this.driver.id_no,
        new_rider: true,
      };
      return payload;
    },
    rootListener() {
      this.$root.$on(
        `Allocate Driver ${this.order.order_details.order_no}`,
        () => {
          this.partnerReallocation(this.payload);
        },
      );
    },
    ...mapActions({
      allocate_order: 'allocate_order',
      allocate_rider_vehicle: 'allocate_rider_vehicle',
    }),
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    async partnerReallocation(orderPayload) {
      this.loading = true;
      const payload = {
        app: 'NODE_PARTNER_API',
        endpoint: 'management/partner_reallocation/',
        params: orderPayload,
      };
      try {
        const data = await this.allocate_rider_vehicle(payload);
        if (data.data.status) {
          this.allocateOrder(data.data);
        } else {
          this.loading = false;
          this.updateClass('danger');
          this.updateErrors([
            `Failed to reallocate rider, ${data.data.message}`,
          ]);
          setTimeout(() => {
            this.updateErrors([]);
          }, 5000);
        }
        return (this.response = data);
      } catch (error) {
        handleError(error);
      }
    },
    async allocateOrder(rider) {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/freight/assign',
        params: {
          _user_email: this.userData.payload.data.email,
          _user_id: this.userData.payload.data.admin_id,
          action_user: this.userData.payload.data.name,
          channel: 'operations',
          data_set: 'cc_actions',
          driver_rate: this.driver.rate,
          sim_card_sn: rider.rider_serial_number,
          rider_phone: rider.rider_phone_no,
          order_no: this.order.order_details.order_no,
        },
      };
      try {
        const data = await this.allocate_order(payload);
        this.loading = false;
        if (!data.data.status) {
          this.updateClass('danger');
          this.updateErrors([`Failed to allocate order, ${data.data.reason}`]);
          setTimeout(() => {
            this.updateErrors([]);
          }, 5000);
        }
        this.updateClass('success');
        this.updateErrors(['Order has been assigned']);
        this.assigned = true;
        return (this.response = data);
      } catch (error) {
        handleError(error);
      }
    },
  },
};
</script>

<style>
.loading-spinner {
  color: white;
}
.sending-status-button {
  pointer-events: none !important;
  cursor: not-allowed !important;
  background: #bdbdbd !important;
  border-color: #bdbdbd !important;
}
</style>
