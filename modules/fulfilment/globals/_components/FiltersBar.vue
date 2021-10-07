<template>
  <div>
    <el-row type="flex" class="row-bg filtersBar" justify="space-between">
      <el-col :span="9">
        <div class="grid-content fulfilment-search-holder">
          <el-row type="flex" class="">
            <el-col :span="7">
              <div class="grid-content fulfilment-status-filter">
                <StatusFilter />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content fulfilment-search-filter">
                <Search :page="getActivePage" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="grid-content bg-white">
          <el-row type="flex" class="" justify="space-between">
            <el-col :span="7">
              <div class="grid-content">
                <HubsFilter />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <RegionsFilter />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <BatchActions :page="getActivePage" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg mb-2" v-if="searched">
      <div v-if="searching" justify="center" class="search-header text-center">
        Fetching results ...
      </div>
      <div v-else class="search-header text-right back-btn">
        <span @click="goBack()"
          ><i class="fa fa-arrow-left"></i> Back to all {{ title }} List
        </span>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'FiltersBar',
  components: {
    StatusFilter: () => import('./filters/StatusFilter'),
    Search: () => import('./filters/Search'),
    HubsFilter: () => import('./filters/HubFilter'),
    RegionsFilter: () => import('./filters/RegionFilter'),
    BatchActions: () => import('./filters/BatchActions'),
  },
  data() {
    return {
      searching: false,
      searched: false,
      title: '',
      page: '',
    };
  },
  computed: {
    ...mapGetters({
      getActivePage: 'getActivePage',
      getSearchingStatus: 'fulfilment/getSearchingStatus',
      getSearchState: 'fulfilment/getSearchState',
    }),

    pageTitle() {
      const data = {
        Outbound_ordersView: 'Delivery Requests',
        Outbound_batchesView: 'Batched Orders',
        Outbound_movableUnitsView: 'Movable Units',
      };
      return data;
    },
  },
  watch: {
    getSearchingStatus(status) {
      this.searching = status;
    },
    getSearchState(status) {
      this.searched = status;
      this.title = this.pageTitle[this.getActivePage];
    },
    getActivePage(page) {
      this.page = page;
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedEntity: 'fulfilment/setSearchedEntity',
      updateSearchState: 'fulfilment/setSearchState',
      isSearching: 'fulfilment/setSearchingStatus',
    }),
    goBack() {
      this.updateSearchedEntity(null);
      this.updateSearchState(false);
    },
  },
};
</script>

<style scoped>
.fulfilment-search-holder {
  border: 0.878146px solid #9e9e9e;
  box-sizing: border-box;
  border-radius: 6px;
  height: 40px;
  margin-top: 6%;
}
.fulfilment-status-filter {
  border-right: 0.878146px solid #9e9e9e;
  height: 39px;
}
.fulfilment-search-filter {
  height: 39px;
}
.search-header {
  color: #518bb8;
  font-weight: 700;
  letter-spacing: 0.05em;
  width: 100%;
}
.back-btn {
  margin-right: 1em;
}
.back-btn span {
  cursor: pointer;
}
</style>