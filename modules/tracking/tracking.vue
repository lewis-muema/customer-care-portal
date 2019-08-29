<template>
  <div>
    <span v-if="order === null"> loading ....</span>
    <span v-else>
      <TheMapHolderComponent :order="order" />
    </span>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import TheMapHolderComponent from '@/modules/tracking/_components/TheMapHolderComponent.vue';

import tracking_store from './_store';
import RegisterStoreModule from '@/mixins/register_store_module';

export default {
  components: {
    TheMapHolderComponent,
  },
  props: {
    orderno: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      order: null,
    };
  },
  created() {
    this.registerOrdersStore();
  },
  mounted() {
    this.singleOrderRequest();
  },
  methods: {
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    async singleOrderRequest() {
      const data = await this.request_single_order(this.orderno);
      return (this.order = data);
    },
    registerOrdersStore() {
      // eslint-disable-next-line no-underscore-dangle
      const moduleIsRegistered =
        // eslint-disable-next-line no-underscore-dangle
        this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_tracking', tracking_store);
      }
    },
  },
};
</script>
