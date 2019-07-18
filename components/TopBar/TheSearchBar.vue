<template>
  <!-- use typehead here -->
  <td>
    <input
      class="typeahead search_bar"
      type="text"
      placeholder="Search for Order No/Customer name/User phone"
    />

    <a
      title="Click to search if Search didnt return any results"
      class="button button-primary"
      onclick="byPassSolrSearch();"
    >
      <i class="fa fa-search" aria-hidden="true"></i
    ></a>
  </td>
</template>
<script>
export default {
  name: 'TheSearchBar',
};
</script>
