<template>
  <section class="content">
    <div class="row content-body">
      <div class="col-xs-12">
        <div id="searchOrder">
          <table width="100%;">
            <tbody>
              <tr>
                <TheSearchBar />
                <TheStatusButtonsBar />
                <TheCitiesBar />
                <TheReorganizeBar />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(order).length !== 0">
      <div
        v-if="order.length !== 0"
        class="col-md-12 box box-info"
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
          <div class="box-body">
            <TheRowHolder :order="order" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import TheSearchBar from '@/components/TopBar/TheSearchBar';
import TheStatusButtonsBar from '@/components/TopBar/TheStatusButtonsBar';
import TheCitiesBar from '@/components/TopBar/TheCitiesBar';
import TheReorganizeBar from '@/components/TopBar/TheReorganizeBar';

export default {
  name: 'TheTopBar',
  components: {
    TheSearchBar,
    TheStatusButtonsBar,
    TheCitiesBar,
    TheReorganizeBar,
    TheRowHolder: () => import('@/components/UI/TheRowHolder'),
  },
  data() {
    return {
      order: {},
      columns: null,
    };
  },

  computed: {
    ...mapGetters(['getSearchedOrder', 'getOrderColumns']),
    ...mapState(['orderColumns']),
  },
  watch: {
    getSearchedOrder(order) {
      return (this.order = order);
    },
    getOrderColumns(columns) {
      return (this.columns = columns);
    },
  },
};
</script>
