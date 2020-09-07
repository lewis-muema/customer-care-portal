<template>
  <div class="auxilliary-services-container">
    <div class="auxilliary-services-filters">
      <filters />
    </div>
    <div class="auxilliary-services-tabs">
      <div class="auxilliary-services-search">
        <input
          type="text"
          placeholder="Enter partner name"
          class="auxilliary-services-search-input"
        />
        <i class="fa fa-search text-grey auxilliary-services-search-icon"></i>
      </div>
      <div class="auxilliary-services-menu">
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClass = 'overview'"
          :class="activeClass === 'overview' ? 'auxilliary-active-tab' : ''"
        >
          Overview
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClass = 'pending'"
          :class="activeClass === 'pending' ? 'auxilliary-active-tab' : ''"
        >
          Pending Requests
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClass = 'approved'"
          :class="activeClass === 'approved' ? 'auxilliary-active-tab' : ''"
        >
          Approved Requests
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClass = 'declined'"
          :class="activeClass === 'declined' ? 'auxilliary-active-tab' : ''"
        >
          Declined Requests
        </div>
      </div>
      <div class="auxilliary-services-tab-containers">
        <pending v-if="activeClass === 'pending'" />
        <overview v-if="activeClass === 'overview'" />
        <approved v-if="activeClass === 'approved'" />
        <declined v-if="activeClass === 'declined'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import order_store from './_store';
import RegisterStoreModule from '@/mixins/register_store_module';
import filters from './filters';
import pending from './pending';
import overview from './overview';
import declined from './declined';
import approved from './approved';

export default {
  name: 'TheAuxilliaryServicesComponent',
  components: {
    filters,
    pending,
    overview,
    approved,
    declined,
  },
  data() {
    return {
      activeClass: 'overview',
      data: [],
    };
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
        this.$store.registerModule('$_auxilliary', order_store);
      }
    },
  },
};
</script>

<style>
.auxilliary-services-container {
  display: flex;
  background: white;
  height: 698px;
  overflow-y: scroll;
}
.auxilliary-services-filters {
  width: 20%;
}
.auxilliary-services-tabs {
  width: 80%;
}
.auxilliary-services-search {
  display: flex;
  justify-content: flex-end;
  height: 70px;
  align-items: center;
  padding: 30px 75px 30px 50px;
}
.auxilliary-services-search-input {
  border: 1px solid #dcdfe6;
  height: 50px;
  width: 250px;
  padding: 20px;
  border-radius: 7px;
}
.auxilliary-services-menu {
  display: flex;
  height: 60px;
  align-items: center;
}
.auxilliary-services-menu-tab {
  width: 20%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}
.auxilliary-services-search-icon {
  position: absolute;
  margin: auto;
}
.auxilliary-active-tab {
  color: #c9531b !important;
}
</style>
