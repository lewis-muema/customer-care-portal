<template>
  <td>
    <span
      class="twitter-typeahead"
      style="position: relative;display: inline-block;"
      ><input
        class="typeahead tt-hint"
        type="text"
        style="font-size: 18px; position: absolute; top: 0px; left: 0px; border-color: transparent; box-shadow: none; opacity: 1; background: none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255);"
        readonly=""
        autocomplete="off"
        spellcheck="false"
        tabindex="-1"
        dir="ltr"/><input
        class="typeahead tt-input"
        type="text"
        placeholder="Search for Order No/Customer name/User phone"
        style="font-size: 18px; position: relative; vertical-align: top; background-color: transparent;"
        autocomplete="off"
        spellcheck="false"
        dir="auto"/>
      <pre
        aria-hidden="true"
        style='position: absolute; visibility: hidden; white-space: pre; font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 18px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;'
      ></pre>
      <div
        class="tt-menu"
        style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none;"
      >
        <div class="tt-dataset tt-dataset-data"></div></div
    ></span>

    <a
      title="Click to search if Search didnt return any results"
      class="button button-primary"
      onclick="byPassSolrSearch();"
      ><span
        class="glyphicon glyphicon-search"
        style=" #3c8dbc; font-size: x-large;vertical-align: text-top;padding: 10px;"
      ></span
    ></a>
  </td>
</template>
<script>
export default {
  name: 'TheSearchBar',
};
</script>
