<template>
  <div class="request-transport">
    <section class="vehicle-type">
      <label>Recommended vehicle type</label>
      <div v-if="vehicleTypeImage()">
        <img :src="`${webImages}${vehicleTypeImage().image}`" />
        <span>{{ vehicleTypeImage().name }}</span>
      </div>
      <div v-else>
        No recommended vehicle
      </div>
    </section>
    <section>
      <label> Do you have a preferred driver at the pick up location?</label>
      <el-select v-model="preferredDriver">
        <el-option label="Yes" value="yes"></el-option>
        <el-option label="No" value="no"></el-option>
      </el-select>
    </section>
    <section v-if="preferredDriver === 'yes'">
      <label>Enter their phone number or the number plate</label>
      <FindPartnerInput />
    </section>
    <section>
      <el-button class="submit-blue" type="primary"
        >Request for Transport</el-button
      >
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import FindPartnerInput from '../FindPartnerInput.vue';

export default {
  name: 'RequestTransport',
  components: { FindPartnerInput },
  props: ['rowData'],
  data() {
    return {
      preferredDriver: 'no',
    };
  },
  computed: {
    ...mapGetters({
      vehicles: 'fulfilment/getVehicles',
    }),
  },
  methods: {
    vehicleTypeImage() {
      if (this.rowData.shipping_agent_vehicle_type === null) return false;
      const vehicleType = this.vehicles.filter(element => {
        return element.value === this.rowData.shipping_agent_vehicle_type;
      });
      return vehicleType[0];
    },
  },
};
</script>

<style scoped>
.request-transport {
  padding: 10px 16px;
}
.request-transport section {
  margin-bottom: 10px;
}
.vehicle-type img {
  width: 20px;
  margin-right: 5px;
  margin-top: -10px;
}
label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
  display: block;
}
.el-select,
.el-input {
  width: 50%;
}
button.submit-blue.el-button.el-button--primary {
  background-color: #528bb8;
  border: none;
  outline: none;
}
</style>
