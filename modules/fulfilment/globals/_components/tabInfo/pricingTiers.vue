<template>
  <div>
    <div class="fulfillment-tab-info-description tiers-container">
      <div class="tiers-inner">
        Industry
      </div>
      <div class="tiers-inner">
        {{ order_details.pricing.industry }}
      </div>
    </div>
    <div class="fulfillment-tab-info-description tiers-container">
      <div class="tiers-inner">
        Total product cost
      </div>
      <div class="tiers-inner">
        {{ order_details.pricing.currency }}
        {{ order_details.pricing.total_product_cost }}
      </div>
    </div>
    <div class="fulfillment-tab-info-description tiers-container">
      <div class="tiers-inner">
        % cost
      </div>
      <div class="tiers-inner">
        {{ order_details.pricing.fulfilment_rate }} %
      </div>
    </div>
    <div class="fulfillment-tab-info-description tiers-container">
      <div class="tiers-inner">
        Fulfilment cost
      </div>
      <div class="tiers-inner">
        {{ order_details.pricing.currency }}
        {{ order_details.pricing.fulfilment_cost }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      order_details: {},
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.order_details = this.getTableDetails;
  },
};
</script>

<style></style>
