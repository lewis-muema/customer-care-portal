<template>
  <div>
    <div v-if="loading">
      <div class="mc-seller-invoice-data">
        <el-table :data="invoiceData" style="width: 100%">
          <el-table-column prop="order_no" width="100" label="Order No.">
          </el-table-column>
          <el-table-column prop="description" label="Description">
          </el-table-column>
          <el-table-column prop="shipping_date" label="Shipment date">
          </el-table-column>
          <el-table-column prop="quantity" width="50" label="Qty">
          </el-table-column>
          <el-table-column prop="unit_of_measure" label="Unit of Measure">
          </el-table-column>
          <el-table-column prop="seller_unit_price" label="Seller Unit Price">
          </el-table-column>
          <el-table-column
            prop="fulfillment_unit_price"
            label="Fulfillment Unit Price"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="text-center">
      <strong>Fetching data...</strong>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'InvoiceDetails',
  components: {},
  mixins: [NotificationMxn],
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      invoiceData: [],
    };
  },
  computed: {
    ...mapGetters({
      getActivePage: 'getActivePage',
    }),
  },
  watch: {},
  beforeMount() {
    this.fetchInvoiceData();
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      fetchInvoiceDetails: 'fulfilment/fetchInvoiceDetails',
    }),
    async fetchInvoiceData() {
      let data = [];
      const response = await this.fetchInvoiceDetails({});

      if (response.length > 0) {
        data = response;
      }

      this.invoiceData = data;
      this.loading = true;
    },
  },
};
</script>
