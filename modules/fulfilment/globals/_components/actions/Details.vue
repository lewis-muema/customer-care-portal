<template>
  <div>
    <div class="fulfillment-tab-info-top">
      <div class="fulfillment-tab-info-seller">
        <div class="fulfillment-tab-info-titles">Recommended vehicle</div>
        <div>
          <!-- <div class="fulfillment-tab-info-description">
            <i class="fa fa-user fulfillment-tab-info-description-icon"></i>
            <div>--</div>
          </div> -->
        </div>
      </div>
      <div class="fulfillment-tab-info-recipient">
        <div class="fulfillment-tab-info-titles">Deliveries</div>
        <div>
          <div class="deliveries-chart-container">
            <vc-donut
              background="white"
              foreground="grey"
              :size="80"
              unit="px"
              :thickness="30"
              :sections="sections"
              :total="orders_count"
              :start-angle="0"
              :auto-adjust-text-size="true"
            >
            </vc-donut>
            <div class="flex-stats-layout">
              <span class="cdc-legend-item">
                <span class="cdc-legend-item-color stats-pending-color"></span>
                <span>Pending {{ batch_stats.ORDER_IN_PROCESSING }}</span>
              </span>
              <span class="cdc-legend-item">
                <span
                  class="cdc-legend-item-color stats-delivered-color"
                ></span>
                <span>Delivered {{ batch_stats.ORDER_COMPLETED }}</span>
              </span>
              <span class="cdc-legend-item">
                <span class="cdc-legend-item-color stats-failed-color"></span>
                <span>Failed {{ batch_stats.ORDER_FAILED }} </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);

export default {
  name: 'Details',
  data() {
    return {
      sections: [
        { label: 'Pending', value: 0, color: '#E7A03C' },
        {
          label: 'Delivered',
          value: 0,
          color: '#4AA361',
        },
        { label: 'Failed', value: 0, color: '#CD5642' },
      ],
      batch_stats: {},
      orders_count: 0,
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  watch: {
    batch_stats(val) {
      this.handleStatsCount();
    },
  },
  beforeMount() {
    this.batch_stats = this.getTableDetails.order_status_ratios;
    this.orders_count = this.getTableDetails.orders.length;
    this.handleStatsCount();
  },
  methods: {
    handleStatsCount() {
      this.sections[0].value = parseInt(
        this.getTableDetails.order_status_ratios.ORDER_IN_PROCESSING /
          this.orders_count,
        10,
      );
      this.sections[1].value = parseInt(
        this.getTableDetails.order_status_ratios.ORDER_COMPLETED /
          this.orders_count,
        10,
      );
      this.sections[2].value = parseInt(
        this.getTableDetails.order_status_ratios.ORDER_FAILED /
          this.orders_count,
        10,
      );
    },
  },
};
</script>

<style>
.deliveries-chart-container {
  display: flex;
  align-items: center;
  font-size: 13px;
}
.flex-stats-layout {
  flex-direction: column;
  margin: 0px 0px 0px 1em;
  display: flex;
  font-size: 13px;
}
.stats-pending-color {
  background-color: #e7a03c;
}
.stats-delivered-color {
  background-color: rgb(74, 163, 97);
}
.stats-failed-color {
  background-color: #cd5642;
}
</style>
