<template>
  <div class="box box-info">
    <div class="box-body">
      <input type="text" v-model="value" />
      <p>{{ value }}</p>
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
import { mapGetters } from 'vuex';

import TheMainRowComponent from '@/components/OrdersPage/TheMainRowComponent';
import TheLowerSlideComponent from '@/components/OrdersPage/TheLowerSlideComponent';

export default {
  name: 'TheOrdersComponent',
  components: {
    TheMainRowComponent,
    TheLowerSlideComponent,
  },
  computed: {
    ...mapGetters(['orderDetails']),
    value: {
      get() {
        return this.$store.getters.value;
      },
      set(value) {
        return this.$store.dispatch('updateValue', value);
      },
    },
  },
  methods: {
    updatevalue(event) {
      this.store.dispatch('updateValue', event.target.value);
    },
  },
};
</script>
