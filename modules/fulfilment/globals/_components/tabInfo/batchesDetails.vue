<template lang="html">
  <div class="">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td width="50%">Estimated Weight</td>
          <td>
            {{ order_detail.batch_summary.estimated_measure[0].value }}
            {{ order_detail.batch_summary.estimated_measure[0].value_type }}
          </td>
        </tr>
        <tr>
          <td width="50%">Total Volume</td>
          <td>
            {{ order_detail.batch_summary.estimated_measure[1].value }}
            {{ order_detail.batch_summary.estimated_measure[1].value_type }}
          </td>
        </tr>
        <tr>
          <td width="50%">Region</td>
          <td>{{ order_detail.hub.hub_name }}</td>
        </tr>
        <tr>
          <td width="50%">Total Units</td>
          <td>{{ order_detail.batch_summary.total_ordered_items_count }}</td>
        </tr>
        <tr>
          <td width="50%">Waypoints</td>
          <td>{{ order_detail.batch_summary.waypoints }} locations</td>
        </tr>
        <tr>
          <td width="50%">Delivery Cost</td>
          <td>
            {{ order_detail.batch_summary.total_fulfilment_fee }}
          </td>
        </tr>
        <tr>
          <td width="50%">Shipping Order Number</td>
          <td>
            <span @click.prevent="showMore">
              <NuxtLink to="/">{{
                order_detail.assigned_shipping_agent.tracking_reference
              }}</NuxtLink>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'BatchesDetails',
  data() {
    return {
      order_detail: {},
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
      getSession: 'getSession',
      getEnvironmentVariables: 'getEnvironmentVariables',
    }),
    solarBase() {
      return this.config.SOLR_BASE;
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    userCountries() {
      const staffCountry = JSON.parse(
        this.getSession.payload.data.country_codes.toLowerCase(),
      );
      return staffCountry;
    },
    src() {
      return `${this.solarBase}select?q=(order_no:*${this.order_detail.assigned_shipping_agent.tracking_reference}&wt=json&indent=true&row=10&sort=order_id%20desc&jwt=${this.solarToken}`;
    },
  },
  beforeMount() {
    this.order_detail = this.getTableDetails;
  },
  methods: {
    ...mapMutations({
      updateSearchedOrder: 'setSearchedOrder',
      updateSearchState: 'setSearchState',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    async showMore() {
      this.updateSearchState(true);
      const orderNo = this.order_detail.assigned_shipping_agent
        .tracking_reference;
      await this.singleOrderRequest(orderNo);
    },
    async singleOrderRequest(orderNo) {
      if (!orderNo) return;
      orderNo = orderNo.trim();
      try {
        const data = await this.request_single_order(orderNo);
        const filtered = this.userCountries.includes(data.country_code)
          ? data
          : {};
        this.updateSearchedOrder(filtered);
        return (this.order = filtered);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    prepareResponseData(data) {
      return data.response.docs;
    },
  },
};
</script>

<style lang="css" scoped>
.el-table td {
  border: 1px solid #ebeef5 !important;
}
.el-table tr {
  height: 35px !important;
}
</style>