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
        setter: 'fulfilment/fetchOutboundBatchedOrders',
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
        tag: 'package_no',
        width: '',
      },
      {
        name: 'Batch No',
        tag: 'batch_no',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '150',
      },
      {
        name: 'Pickup',
        tag: 'pick_up',
        width: '130',
      },
      {
        name: 'Destination',
        tag: 'destination',
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
