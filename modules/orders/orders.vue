<template>
  <div class="box box-info">
    <div class="box-body">
      <hr />
      <table id="" class="table  table-bordered table-hover">
        <thead>
          <tr>
            <th v-for="column in orderColumns" :key="column">
              {{ column }}
            </th>
          </tr>
        </thead>
        <TheRowComponent />
        <tfoot>
          <tr>
            <th v-for="column in orderColumns" :key="column">
              {{ column }}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import TheRowComponent from './_components/OrdersPage/OrdersMainBit/TheRowComponent';

export default {
  name: 'TheOrdersComponent',
  components: {
    TheRowComponent,
  },
};
</script>
