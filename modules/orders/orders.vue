<template>
  <div class="box box-info">
    <div class="box-body">
      <hr />
      <table id="" class="table  table-bordered table-hover">
        <thead>
          <tr>
            <th>Status</th>
            <th>Client</th>
            <th>Rider</th>
            <th>Time</th>
            <th>Pick up</th>
            <th>Delivery</th>
            <th>Amount</th>
            <th>Rider Amount</th>
          </tr>
        </thead>
        <tbody id="table_body_geg">
          <tr id="initial_data_request_show">
            <td colspan="9">
              <div id="initial_load_box">Requesting for orders ...</div>
            </td>
          </tr>
          <tr>
            {{
              orderDetails
            }}
          </tr>
          <TheMainRowComponent />
          <TheLowerSlideComponent :order-details="orderDetails" />
        </tbody>
        <tfoot>
          <tr>
            <th>Status</th>
            <th>Client</th>
            <th>Rider</th>
            <th>Time</th>
            <th>Pick up</th>
            <th>Delivery</th>
            <th>Amount</th>
            <th>Rider Amount</th>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- /.box-body -->
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import order_store from './_store';
import RegisterStoreModule from '@/mixins/register_store_module';
import TheMainRowComponent from './_components/OrdersPage/OrdersMainBit/TheMainRowComponent';
import TheLowerSlideComponent from './_components/OrdersPage/OrdersLowerBit/TheLowerSlideComponent';

export default {
  name: 'TheOrdersComponent',
  components: {
    TheMainRowComponent,
    TheLowerSlideComponent,
  },
  computed: {
    ...mapGetters({ orderDetails: '$_orders/orderDetails' }),
    value: {
      get() {
        return this.$store.getters.value;
      },
      set(value) {
        return this.$store.dispatch('updateValue', value);
      },
    },
  },
  created() {
    this.registerOrdersStore();
  },
  methods: {
    registerOrdersStore() {
      // eslint-disable-next-line no-underscore-dangle
      const moduleIsRegistered =
        // eslint-disable-next-line no-underscore-dangle
        this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_orders', order_store);
      }
    },
    updatevalue(event) {
      this.store.dispatch('updateValue', event.target.value);
    },
  },
};
</script>
