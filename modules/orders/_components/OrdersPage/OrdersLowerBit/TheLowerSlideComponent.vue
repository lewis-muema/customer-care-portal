<template>
  <td
    colspan="9"
    class="order_view_lower_cell"
    :id="`order_view_lower${orderNo}`"
    style="padding:0px; background-color: rgba(245, 245, 245, 0.56) !important; font-size: 13px;"
  >
    <div class="lower_slide_bit" :id="`bumba_${orderNo}`">
      <div class="row" v-if="order === null">
        loading ....
      </div>
      <div class="row" v-else>
        <TheSideComponent :order="order" />
        <TheMainComponent :order="order" />
      </div>
    </div>
  </td>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import TheSideComponent from './LowerSideBar/TheSideComponent';
import TheMainComponent from './LowerMainBar/TheMainComponent';

export default {
  name: 'TheLowerSlideComponent',
  components: {
    TheSideComponent,
    TheMainComponent,
  },
  props: {
    orderno: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.orderno,
      order: null,
      sampleOrder: null,
    };
  },
  computed: {},

  mounted() {
    this.sampleOrder = this.singleOrder();
  },
  created() {
    this.singleOrderRequest();
  },
  methods: {
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    async singleOrderRequest() {
      const data = await this.request_single_order(this.orderNo);
      return (this.order = data);
    },
  },
};
// getOrder
</script>
