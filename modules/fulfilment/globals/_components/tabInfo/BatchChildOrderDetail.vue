<template lang="html">
  <div class="">
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-map-location" />
        {{ batch_info.destination_description }}
      </div>
      <div class="fulfilment-summary-details-info">
        {{ formatTime(batch_info.scheduled_date) }} |
        {{ formatDate(batch_info.scheduled_date) }}
      </div>
    </div>
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-truck" /> Recommened Vehicle
      </div>
      <div class="fulfilment-summary-details-info transform-vehicle-name">
        {{ getVendorType(batch_info.shipping_agent_vehicle_type) }}
      </div>
    </div>
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-s-claim" /> Assigned Batch
      </div>
      <div class="fulfilment-summary-details-info">
        {{ batch_info.most_recent_batch_id }}
      </div>
    </div>
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-s-shop" /> Seller Information
      </div>
      <div class="fulfilment-summary-details-info">
        {{ batch_info.business_name }}
      </div>
    </div>
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-user" /> Recipient Information
      </div>
      <div class="fulfilment-summary-details-info">
        {{ batch_info.order_recipient_name }}
      </div>
    </div>
    <div class="">
      <div class="fulfilment-summary-details-header">
        <i class="el-icon-user-solid" /> Rider Information
      </div>
      <div class="fulfilment-summary-details-info">
        {{
          !batch_info.shipping_agent_name
            ? 'Not available'
            : batch_info.shipping_agent_name
        }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      batch_info: [],
    };
  },
  computed: {
    ...mapGetters({
      getBatchChildOrderDetails: 'fulfilment/getBatchChildOrderDetails',
    }),
  },
  watch: {
    getBatchChildOrderDetails(val) {
      this.batch_info = val;
    },
  },
  beforeMount() {
    this.batch_info = this.getBatchChildOrderDetails;
  },
  methods: {
    formatTime(date) {
      return moment(date).format('hh:mm A');
    },
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY ');
    },
    getVendorType(val) {
      const string = !val ? 'N/A' : val.replace(/_/g, ' ').toLowerCase();

      return string;
    },
  },
};
</script>

<style lang="css" scoped>
.fulfilment-summary-details-header {
  color: #000000;
  margin: 2% 0;
}
.fulfilment-summary-details-info {
  font-size: 12px;
  margin: 2% 0%;
}
</style>
