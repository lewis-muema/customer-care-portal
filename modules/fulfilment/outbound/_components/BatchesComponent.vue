<template>
  <div class="fulfilment-outbound-batches">
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
        name: 'Status',
        tag: 'status',
        width: '130',
      },
      {
        name: 'Packages',
        tag: 'seller_name',
        width: '',
      },
      {
        name: 'Batch No',
        tag: 'recipient_name',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '150',
      },
      {
        name: 'Pickup',
        tag: 'assigned_batch_no',
        width: '130',
      },
      {
        name: 'Destination',
        tag: 'destination_location',
        width: '120',
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
