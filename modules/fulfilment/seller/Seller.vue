<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="mc-fulfilment-header">Seller</h1>

      <div class="">
        <ol class="mc-seller-breadcrumb">
          <li
            @click="setPage('seller-dash')"
            :class="page === 'seller-dash' ? 'mc-inactive' : ''"
          >
            Dashboard
          </li>
          <li
            class="mc-list-next"
            v-if="page === 'all-sellers'"
            :class="page === 'all-sellers' ? 'mc-inactive' : ''"
            @click="setPage('all-sellers')"
          >
            > All Sellers
          </li>
        </ol>
      </div>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs" :key="componentKey">
          <SellerStats v-if="page === 'seller-dash'" />
          <SellerList v-if="page === 'all-sellers'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

import SellerStats from './_components/SellerStats.vue';
import SellerList from './_components/SellerList.vue';

export default {
  name: 'SellerView',
  components: { SellerStats, SellerList },
  data() {
    return {
      mode: 'SellerView',
      componentKey: 0,
      page: 'seller-dash',
    };
  },
  computed: {
    ...mapGetters({
      getSellerPage: 'fulfilment/getSellerPage',
    }),
  },
  watch: {
    getSellerPage(val) {
      if (val) {
        this.page = val;
      } else {
        this.page = 'seller-dash';
      }
    },
  },
  mounted() {
    const page = 'seller-dash';
    this.handleClick(page);
  },
  methods: {
    ...mapMutations({
      setSellerPage: 'fulfilment/setSellerPage',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      this.setSellerPage(tab);
      this.handleTab();
    },
    setPage(page) {
      this.setSellerPage(page);
    },
  },
};
</script>
