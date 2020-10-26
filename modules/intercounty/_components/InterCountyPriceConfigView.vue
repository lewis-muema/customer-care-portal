<template lang="html">
  <div class="">
    <div class="inter-county-tabs">
      <div
        class="inter-county-tabs-titles"
        :class="mode === 'priceConfig' ? 'active-price-configs-tab' : ''"
        @click="mode = 'priceConfig'"
      >
        Price configuration
      </div>
      <div
        class="inter-county-tabs-titles"
        :class="mode === 'setPickup' ? 'active-price-configs-tab' : ''"
        @click="mode = 'setPickup'"
      >
        Pickup locations
      </div>
      <div
        class="inter-county-tabs-titles"
        :class="mode === 'setDestination' ? 'active-price-configs-tab' : ''"
        @click="mode = 'setDestination'"
      >
        Destinations
      </div>
    </div>

    <div class="inter-county-component">
      <PriceConfig :key="componentKey" v-if="mode === 'priceConfig'" />
      <PickupConfig :key="componentKey" v-if="mode === 'setPickup'" />
      <DestinationConfig :key="componentKey" v-if="mode === 'setDestination'" />
    </div>
  </div>
</template>

<script>
import PriceConfig from './PriceConfigComponent.vue';
import PickupConfig from './PickupConfigComponent.vue';
import DestinationConfig from './DestinationConfigComponent.vue';

export default {
  name: 'InterCountyPriceConfigView',
  components: { PriceConfig, PickupConfig, DestinationConfig },
  data() {
    return {
      mode: 'priceConfig',
      componentKey: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleTab() {
      this.componentKey += 1;
    },
  },
};
</script>

<style lang="css">
.inter-county-tabs {
  display: flex;
  margin-bottom: -1px;
}
.inter-county-tabs-titles {
  padding: 15px;
  color: #1b7fc3;
  font-size: 14px;
}
.active-price-configs-tab {
  border-top: 2px solid #1b7fc3;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  border-bottom: 1px solid white;
}
.inter-county-component {
  border: 1px solid #ebebeb;
  padding: 30px;
}
</style>
