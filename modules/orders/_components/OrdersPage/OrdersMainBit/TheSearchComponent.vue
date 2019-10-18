<template>
  <div class="box box-info" style="display: none;" id="new_serach_window">
    <div class="box-header" style="">
      <i class="fa fa-search"></i>
      <h3 class="box-title" id="new_serach_window_head">Search Results</h3>
      <!-- tools box -->
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
      <!-- /. tools -->
    </div>
    <div class="box-body">
      <table id="" class="table  table-bordered table-hover">
        <tbody id="table_body_geg_search">
          <tr id="search_content_gegeg">
            <td colspan="9"><div id="initial_load_box">Searching ...</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheSearchComponent',
};
</script>
