<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="" label="" width="100">
        <template slot-scope="scope">
          <img
            :src="scope.row.itemImg"
            alt=""
            class="fulfillment-tab-info-items-img"
          />
        </template>
      </el-table-column>
      <el-table-column prop="itemName" label="" width="180"> </el-table-column>
      <el-table-column prop="unitPrice" label="Unit price"> </el-table-column>
      <el-table-column prop="quantity" label="Quantity" width="180">
      </el-table-column>
      <el-table-column prop="totalPrice" label="Total Price" width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          itemImg:
            'https://s3.eu-west-1.amazonaws.com/images.sendyit.com/mission_control/shea.png',
          itemName: 'Shea Butter',
          unitPrice: 'KES 1300',
          quantity: '1',
          totalPrice: 'KES 1300',
        },
        {
          itemImg:
            'https://s3.eu-west-1.amazonaws.com/images.sendyit.com/mission_control/mango.png',
          itemName: 'Mango Butter',
          unitPrice: 'KES 1000',
          quantity: '1',
          totalPrice: 'KES 1000',
        },
        {
          itemImg: '',
          itemName: '',
          unitPrice: '',
          quantity: 'Total',
          totalPrice: 'KES 2300',
        },
      ],
    };
  },
};
</script>

<style></style>
