<template>
  <div class="box box-info">
    <div class="box-body">
      <hr />
      <table id="" class="table  table-bordered table-hover">
        <thead>
          <tr>
            <th v-for="column in orderColumns" :key="column">
              {{ column }}
            </th>
          </tr>
        </thead>
        <TheRowComponent />
        <tfoot>
          <tr>
            <th v-for="column in orderColumns" :key="column">
              {{ column }}
            </th>
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
import TheRowComponent from './_components/OrdersPage/OrdersMainBit/TheRowComponent';

import TheLowerSlideComponent from './_components/OrdersPage/OrdersLowerBit/TheLowerSlideComponent';

export default {
  name: 'TheOrdersComponent',
  components: {
    TheRowComponent,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      orderColumns: '$_orders/getOrderColumns',
      columns: '$_orders/getOrderColumns',
    }),
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
  },
};
</script>
