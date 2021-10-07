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
        setter: 'fulfilment/fetchReturnOrders',
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
        name: 'Order Number',
        tag: 'order_no',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '',
      },
      {
        name: 'Recipient’s location',
        tag: 'recipient_location',
        width: '',
      },
      {
        name: 'Return location',
        tag: 'hub_location',
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
