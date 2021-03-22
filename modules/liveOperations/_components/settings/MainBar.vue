<template>
  <div class="col-md-7 main-bar">
    <div class="main-content-holder" v-if="activeAlert !== null">
      <h4 class="main-sub-header">
        {{ activeAlert === null ? 'N/A' : activeAlert.alert_type_name }}
      </h4>
      <div class="criteria-holder" v-if="activeAlert.times_reallocated">
        <div>
          Times Reallocated
        </div>
        <div class="criteria-value">{{ activeAlert.times_reallocated }}</div>
      </div>
      <div class="criteria-holder" v-if="activeAlert.max_mins_to_arrival">
        <div>
          Maximum time to arrival (minutes)
        </div>
        <div class="criteria-value">
          {{ activeAlert.max_mins_to_arrival }}
        </div>
      </div>
      <div class="criteria-holder" v-if="activeAlert.time_since_confirmation">
        <div>
          Time since confirmation (minutes)
        </div>
        <div class="criteria-value">
          {{ activeAlert.time_since_confirmation }}
        </div>
      </div>
      <div class="criteria-holder" v-if="activeAlert.pending_time">
        <div>
          Pending Time (Minutes)
        </div>
        <div class="criteria-value">{{ activeAlert.pending_time }}</div>
      </div>
      <div class="criteria-holder">
        <div>
          Is this a cash order?
        </div>
        <div class="criteria-value">
          {{ activeAlert.cash_order ? 'Yes' : 'No' }}
        </div>
      </div>
      <div class="criteria-holder" v-if="activeAlert.vendor_types">
        <div>
          Associated vendor types
        </div>
        <div
          class="criteria-value"
          v-for="(vendor, index) in activeAlert.vendor_types"
          :key="index"
        >
          {{ singleVendorType(vendor) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'SettingsMainBar',
  props: ['criteria'],
  data() {
    return {
      activeAlert: null,
    };
  },

  computed: {
    ...mapGetters(['getActiveLiveOpsVendor', 'getVendorTypes']),

    criteriaData() {
      const data = [
        {
          criteria: 'Order placement to order confirmation time (minutes)',
          value: 10,
        },
        {
          criteria: 'Order confirmation to order pickup time (minutes)',
          value: 15,
        },
        {
          criteria: 'Order pickup arrival to order pickup time (minutes)',
          value: 5,
        },
        {
          criteria: 'Order pickup to Destination offline time (minutes)',
          value: 25,
        },
        {
          criteria: 'Destination arrival to Delivery time (minutes)',
          value: 10,
        },
        {
          criteria: 'Orders reallocated more than X times',
          value: 3,
        },
      ];
      return data;
    },
  },
  watch: {
    getActiveLiveOpsVendor(data) {
      this.activeAlert = data;
    },
  },
  methods: {
    singleVendorType(id) {
      // eslint-disable-next-line func-names
      const vendorType = this.getVendorTypes.filter(function(e) {
        return e.vendor_type_id === id;
      });
      const name =
        typeof vendorType[0] === 'undefined'
          ? ''
          : vendorType[0].vendor_disp_name;
      return id === 4 || id === 7
        ? `${vendorType[0].vendor_type_name} ${name}`
        : name;
    },
  },
};
</script>

<style></style>
