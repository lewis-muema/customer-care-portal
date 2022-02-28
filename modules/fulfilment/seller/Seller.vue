<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header">
      <h1 class="mc-fulfilment-header">Seller</h1>

      <div class="mc-seller-header-highlight">
        <ol class="mc-seller-breadcrumb">
          <li
            @click="setPage('seller-dash')"
            :class="page === 'seller-dash' ? 'mc-inactive' : ''"
          >
            Dashboard
          </li>
          <li
            class="mc-list-next"
            v-if="page === 'all-sellers' || page === 'single-seller'"
            :class="page === 'all-sellers' ? 'mc-inactive' : ''"
            @click="setPage('all-sellers')"
          >
            > All Sellers
          </li>
          <li
            class="mc-list-next"
            v-if="page === 'single-seller'"
            :class="page === 'single-seller' ? 'mc-inactive' : ''"
            @click="setPage('single-seller')"
          >
            > {{ getSellerInfo.business_name }}
          </li>
        </ol>
      </div>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container mc-seller-main-container">
        <div class="fulfilment-tabs" :key="componentKey">
          <SellerStats v-if="page === 'seller-dash'" />
          <SellerList v-if="page === 'all-sellers'" />
          <SingleSeller v-if="page === 'single-seller'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

import SellerStats from './_components/SellerStats.vue';
import SellerList from './_components/SellerList.vue';
import SingleSeller from './_components/SingleSeller.vue';

export default {
  name: 'SellerView',
  components: { SellerStats, SellerList, SingleSeller },
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
      getSellerInfo: 'fulfilment/getSellerInfo',
      getSellerSearchedEntity: 'fulfilment/getSellerSearchedEntity',
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
    getSellerSearchedEntity(val) {
      if (!val) {
        this.handleClick('all-sellers');
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
      setSingleSellerPage: 'fulfilment/setSingleSellerPage',
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
      setTableData: 'fulfilment/setTableData',
      setSelectedCountry: 'fulfilment/setSelectedCountry',
      setSelectedStatus: 'fulfilment/setSelectedStatus',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      this.setPage(tab);
      this.handleTab();
    },
    setPage(page) {
      this.setTableData([]);
      this.setSellerPage(page);
      this.setSingleSellerPage(page);
      this.updateActivePage(page);
      this.setFulfilmentType(page);
      this.setSelectedCountry(null);
      this.setSelectedStatus(null);
    },
  },
};
</script>
