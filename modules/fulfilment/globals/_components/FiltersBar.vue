<template>
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
              <Search />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="9"><div class="grid-content bg-white"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: 'FiltersBar',
  components: {
    StatusFilter: () => import('./filters/StatusFilter'),
    Search: () => import('./filters/Search'),
  },
};
</script>

<style scoped>
.fulfilment-search-holder {
  border: 0.878146px solid #9e9e9e;
  box-sizing: border-box;
  border-radius: 6px;
  height: 40px;
}
.fulfilment-status-filter {
  border-right: 0.878146px solid #9e9e9e;
  height: 39px;
}
.fulfilment-search-filter {
  height: 39px;
}
</style>
