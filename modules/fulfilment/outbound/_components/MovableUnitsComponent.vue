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
        setter: 'fulfilment/getOrders',
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
        name: 'Batches',
        tag: 'batches_no',
        width: '',
      },
      {
        name: 'Movable Unit No',
        tag: 'movable_unit_id',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '',
      },
      {
        name: 'Pickup',
        tag: 'hub_pickup',
        width: '',
      },
      {
        name: 'Destination',
        tag: 'hub_destination',
        width: '',
      },
      {
        name: 'Driver',
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
