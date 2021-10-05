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
        setter: 'fulfilment/fetchOrders',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Order Number',
        tag: 'order_no',
        width: '130',
      },
      {
        name: 'Status',
        tag: 'status',
        width: '130',
      },
      {
        name: 'Seller',
        tag: 'seller_name',
        width: '',
      },
      {
        name: 'Recipient',
        tag: 'recipient_name',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '150',
      },
      {
        name: 'Destination',
        tag: 'destination_location',
        width: '120',
      },
      {
        name: 'Assigned Batch',
        tag: 'assigned_batch_no',
        width: '130',
      },
      {
        name: 'Rider',
        tag: 'rider_name',
        width: '',
      },
      {
        name: 'Region',
        tag: 'city_name',
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
