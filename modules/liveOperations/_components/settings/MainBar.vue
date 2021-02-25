<template>
  <div class="col-md-9 main-bar">
    <div class="main-content-holder">
      <h3 class="main-bar-header">
        {{ activeVendor === null ? 'Bike' : activeVendor.vendorType }}
      </h3>
      <h4 class="main-sub-header">
        {{
          activeVendor === null
            ? 'Merchant Business Unit'
            : activeVendor.businessUnitname
        }}
      </h4>
      <div
        v-for="(setting, index) in criteriaData"
        :key="index"
        class="criteria-holder"
      >
        <div>{{ setting.criteria }}</div>
        <div class="criteria-value">{{ setting.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'SettingsMainBar',
  data() {
    return {
      activeVendor: null,
    };
  },

  computed: {
    ...mapGetters(['getActiveLiveOpsVendor']),

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
      this.activeVendor = data;
    },
  },
};
</script>

<style></style>
