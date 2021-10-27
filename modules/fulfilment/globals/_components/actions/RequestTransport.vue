<template>
  <div class="request-transport">
    <section class="vehicle-type">
      <label class="request-transport-label">Recommended vehicle type</label>
      <div v-if="vehicleTypeImage()">
        <img :src="`${webImages}${vehicleTypeImage().image}`" />
        <span>{{ vehicleTypeImage().name }}</span>
      </div>
      <div v-else>
        No recommended vehicle
      </div>
    </section>
    <section>
      <label class="request-transport-label">
        Do you have a preferred driver at the pick up location?</label
      >
      <el-select v-model="preferredDriver">
        <el-option label="Yes" value="yes"></el-option>
        <el-option label="No" value="no"></el-option>
      </el-select>
    </section>
    <section v-if="preferredDriver === 'yes'">
      <label class="request-transport-label"
        >Enter their phone number or the number plate</label
      >
      <FindPartnerInput
        @changeSelectedPartner="updateSelectedPartner($event)"
      />
    </section>
    <section>
      <el-button
        class="submit-blue request-transport-btn"
        type="primary"
        :loading="loading"
        :disabled="
          preferredDriver === 'yes' &&
            typeof selectedPartner.phone_no === 'undefined'
        "
        @click="requestForTransport"
        >Request for Transport</el-button
      >
    </section>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import FindPartnerInput from '../FindPartnerInput.vue';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'RequestTransport',
  components: { FindPartnerInput },
  mixins: [NotificationMxn],
  data() {
    return {
      preferredDriver: 'no',
      selectedPartner: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      vehicles: 'fulfilment/getVehicles',
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  methods: {
    ...mapActions({
      requestForTransportAction: 'fulfilment/requestForTransport',
    }),
    vehicleTypeImage() {
      if (this.getTableDetails.batch_summary.recommended_vehicle_type === null)
        return false;
      const vehicleType = this.vehicles.filter(element => {
        return (
          element.value ===
          this.getTableDetails.batch_summary.recommended_vehicle_type
        );
      });
      return vehicleType[0];
    },
    updateSelectedPartner(partner) {
      this.selectedPartner = partner;
    },
    async requestForTransport() {
      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: `missioncontrol/batches/${this.getTableDetails.batch_id}/assign-shippingagent`,
        apiKey: false,
        params: {
          shipping_request_type:
            this.preferredDriver === 'no' ? 'DISPATCH' : 'DIRECT_ASSIGNMENT',
          shipping_provider: 'SENDY',
          vehicle_type:
            this.getTableDetails.batch_summary.recommended_vehicle_type ?? null,
          shipping_agent_id: this.selectedPartner.phone_no ?? null,
          direction: this.getTableDetails.direction,
          hub_id: this.getTableDetails.hub.hub_id,
        },
      };
      this.loading = true;
      const response = await this.requestForTransportAction(payload);
      this.loading = false;
      if (response.errors.length > 0) {
        // TODO: Error Mapping
        let errorMessage;
        const errors = response.errors[0];
        switch (errors.source) {
          case 'assignShippingAgent.requestModel.vehicleType':
            errorMessage = 'There is no recommended vehicle for this batch';
            break;
          default:
            errorMessage = 'We could not request for transport for this batch';
        }
        this.doNotification(2, 'Request for transport error', errorMessage);
      } else {
        this.doNotification(
          1,
          'Request for transport success',
          'Process completed successfully!',
        );
      }
      this.$emit('closeDialog', false);
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
.vehicle-type > div {
  margin-top: 10px;
}
label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
  display: block;
}
.el-select,
.el-input {
  width: 100%;
}
button.submit-blue.el-button.el-button--primary {
  background-color: #528bb8;
  border: none;
  outline: none;
}
.request-transport-label {
  font-weight: 500;
  margin-bottom: 3%;
  color: #000000;
}
.request-transport-btn {
  width: 100%;
  margin-top: 3%;
}
</style>
