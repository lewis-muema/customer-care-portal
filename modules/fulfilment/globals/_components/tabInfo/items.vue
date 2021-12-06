<template>
  <div>
    <el-table :data="order_details.items" style="width: 100%">
      <el-table-column prop="" label="" width="100">
        <template slot-scope="scope">
          <img
            :src="scope.row.product_variant_image_link"
            alt=""
            class="fulfillment-tab-info-items-img"
          />
        </template>
      </el-table-column>
      <el-table-column prop="product_description" label="" width="180">
        <template slot-scope="props">
          {{ props.row.product_description }}
        </template>
      </el-table-column>
      <el-table-column label="Unit price" width="180">
        <template slot-scope="props">
          {{ props.row.currency }} {{ props.row.unit_price }}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="Quantity" width="180">
      </el-table-column>
      <el-table-column label="Total Price" width="180">
        <template slot-scope="props">
          {{ props.row.currency }}
          {{ props.row.unit_price * props.row.quantity }}
        </template>
      </el-table-column>
    </el-table>
    <div class="items-total-container">
      <div class="items-divider"></div>
      <div class="items-total-label">
        Total
      </div>
      <div class="items-total-quantity">
        {{ order_details.currency }} {{ order_details.total }}
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
    this.order_details = this.getTableDetails.order_items;
  },
};
</script>

<style></style>
