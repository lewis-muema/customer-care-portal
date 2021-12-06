<template>
  <section class="content">
    <div class="row ">
      <div class="col-4">
        <TheSearchBar class="" />
      </div>
      <div class="marginTop pl-0 ml-auto mr-2">
        <div class="float-right ml-3">
          <BusinessUnitFilter />
        </div>
        <div class="float-right ml-3">
          <TheCitiesBar />
        </div>
        <div class="float-right">
          <FilterComponent />
        </div>
      </div>
    </div>
    <div class="row mt-1  ml-0 pr-0">
      <div class="ml-4">
        <TheStatusButtonsBar :orders="storedData" />
      </div>
      <div class="col-5 ml-auto">
        <TheReorganizeBar class="float-right" />
      </div>
    </div>
    <div>
      <rabbitMQcomponent @pushedSomething="handlePushInParent" />
    </div>
    <div v-if="searchState" class="search-window">
      <div class="box box-info" id="new_serach_window">
        <div class="box-header" style="">
          <i class="fa fa-search"></i>
          <h3 class="box-title" id="new_serach_window_head">Search Results</h3>
          <div class="pull-right box-tools">
            <button
              class="btn btn-info btn-sm"
              data-widget="remove"
              data-toggle="tooltip"
              title="Remove"
              @click="remove"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div class="box-body">
          <TheRowHolder v-if="order" :order="order" :key="componentKey" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import moment from 'moment';

import TheSearchBar from '@/components/TopBar/TheSearchBar';
import TheStatusButtonsBar from '@/components/TopBar/TheStatusButtonsBar';
import TheCitiesBar from '@/components/TopBar/TheCitiesBar';
import TheReorganizeBar from '@/components/TopBar/TheReorganizeBar';
import rabbitMQcomponent from '@/modules/rabbitMQ/rabbitMQComponent';

export default {
  name: 'TheTopBar',
  components: {
    TheSearchBar,
    TheStatusButtonsBar,
    TheCitiesBar,
    TheReorganizeBar,
    BusinessUnitFilter: () => import('./BusinessUnitFilter'),
    FilterComponent: () => import('./FilterComponent'),
    rabbitMQcomponent,
    TheRowHolder: () => import('@/components/UI/TheRowHolder'),
  },
  data() {
    return {
      storedData: [],
      componentKey: 0,
    };
  },

  computed: {
    ...mapGetters(['getSearchedOrder', 'getSearchState']),
    searchState() {
      return this.getSearchState;
    },
    order() {
      return this.getSearchedOrder;
    },
  },
  watch: {
    getSearchedOrder(order) {
      this.forceRerender();
    },
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setSearchState',
    }),
    remove() {
      this.updateSearchState(false);
    },
    forceRerender() {
      this.componentKey += 1;
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
<style>
@import './_assets/style/multiselect.css';
</style>
<style scoped>
.fa-search {
  padding: 0 !important;
  color: #212529 !important;
}
.content {
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
}
.pass {
  margin-left: 50px;
}
.all {
  color: #527cbd;
}
.pending {
  color: #ce5642;
}
.confirmed {
  color: #e89f3c;
}
.transit {
  color: #4aa261;
}
.marginTop {
  margin-top: -20px;
  float: right;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}
</style>
