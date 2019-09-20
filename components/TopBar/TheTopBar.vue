<template>
  <section class="content">
    <div class="row content-body">
      <table width="99%;">
        <tbody>
          <tr>
            <TheSearchBar />
            <TheStatusButtonsBar :orders="storedData" />
            <TheCitiesBar :orders="storedData" />
            <TheReorganizeBar />
            <rabbitMQcomponent @pushedSomething="handlePushInParent" />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="Object.keys(order).length !== 0" class="search-window">
      <div
        v-if="order.length !== 0"
        class="box box-info"
        id="new_serach_window"
      >
        <div class="box-header" style="">
          <i class="fa fa-search"></i>
          <h3 class="box-title" id="new_serach_window_head">Search Results</h3>
          <div class="pull-right box-tools">
            <button
              class="btn btn-info btn-sm"
              data-widget="remove"
              data-toggle="tooltip"
              title="Remove"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div class="box-body">
          <TheRowHolder :order="order" :key="componentKey" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
// import PouchDB from 'pouchdb-browser';
// import PouchFind from 'pouchdb-find';

import TheSearchBar from '@/components/TopBar/TheSearchBar';
import TheStatusButtonsBar from '@/components/TopBar/TheStatusButtonsBar';
import TheCitiesBar from '@/components/TopBar/TheCitiesBar';
import TheReorganizeBar from '@/components/TopBar/TheReorganizeBar';
import rabbitMQcomponent from '@/modules/rabbitMQ/rabbitMQComponent';

// PouchDB.plugin(PouchFind);

export default {
  name: 'TheTopBar',
  components: {
    TheSearchBar,
    TheStatusButtonsBar,
    TheCitiesBar,
    TheReorganizeBar,
    rabbitMQcomponent,
    TheRowHolder: () => import('@/components/UI/TheRowHolder'),
  },
  data() {
    return {
      order: {},
      storedData: [],
      componentKey: 0,
      // ordersDB: process.browser ? new PouchDB('orders') : '',
    };
  },

  computed: {
    ...mapGetters(['getSearchedOrder']),
  },
  watch: {
    getSearchedOrder(order) {
      this.forceRerender();
      return (this.order = order);
    },
  },
  async created() {
    // await this.fetchOrders();
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    async fetchOrders() {
      const res = await this.ordersDB.allDocs({ include_docs: true });
      const data = res.rows;
      return (this.storedData = data[0].doc.data);
    },
    handlePushInParent(pushobj) {
      const index = _.findIndex(this.storedData, [
        'order_no',
        `${pushobj.order_no}`,
      ]);

      if (index >= 0) {
        this.storedData.splice(index, 1);
        this.storedData.unshift(pushobj);
      } else {
        this.storedData.unshift(pushobj);
      }
    },
  },
};
</script>
<style scoped>
.fa-search {
  padding: 0 !important;
  color: #212529 !important;
}
</style>
