<template>
  <div>
    <el-table
      :data="tableData"
      class="pricing-tiers-table"
      style="width: max-content"
    >
      <el-table-column prop="field" label="" width="150"></el-table-column>
      <el-table-column prop="val" label="" width="150"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          field: 'Industry',
          val: 'Fashion',
        },
        {
          field: 'Total product cost',
          val: 'Kes 2,300',
        },
        {
          field: '% cost',
          val: '13%',
        },
        {
          field: 'Fulfilment cost',
          val: 'KES 299',
        },
      ],
    };
  },
};
</script>

<style></style>
