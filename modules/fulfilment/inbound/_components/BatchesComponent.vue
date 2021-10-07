<template lang="html">
  <div class="">
    <Table :data-props="dataProps" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Table from '../../globals/_components/Table';

export default {
  components: { Table },
  data() {
    return {
      dataProps: {
        setter: 'fulfilment/fetchInboundBatchedOrders',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Status',
        tag: 'status',
        width: '130',
      },
      {
        name: 'Orders',
        tag: 'package_no',
        width: '130',
      },
      {
        name: 'Batch No',
        tag: 'batch_no',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '',
      },
      {
        name: 'Region',
        tag: 'region',
        width: '',
      },
      {
        name: 'Rider',
        tag: 'rider_name',
        width: '',
      },
    ];
    this.setTableProps(tableProps);
  },

  methods: {
    ...mapActions({
      setTableProps: 'fulfilment/setTableProps',
    }),
  },
};
</script>

<style lang="css" scoped></style>
