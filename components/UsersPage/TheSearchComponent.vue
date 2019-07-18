<template>
  <div class="row">
    <div class="col-sm-3"></div>
    <div class="col-sm-6 text-center ">
      <div id="searchRider" style="display:inline-block">
        <input
          class="typeahead"
          id="solr_search_rider_input"
          type="text"
          placeholder="Search for Rider Name /Phone "
        />
      </div>
      <a
        title="Click to search using the rider phone number"
        class="button button-primary"
        onclick="byPassSolrSearchRider();"
      >
        <i class="fa fa-search user-search" aria-hidden="true" style=" "></i>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheSearchComponent',
};
</script>
<style>
.user-search {
  font-size: x-large;
  vertical-align: text-top;
  padding: 0 10px;
}
</style>

f
