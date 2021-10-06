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
        setter: 'fulfilment/fetchOutboundPickUpRequests',
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
        name: 'Client',
        tag: 'recipient_name',
        width: '',
      },
      {
        name: 'Order No',
        tag: 'order_no',
        width: '',
      },
      {
        name: 'Time',
        tag: 'time_placed',
        width: '',
      },
      {
        name: 'PickUp',
        tag: 'pickup_location',
        width: '',
      },
      {
        name: 'Delivery',
        tag: 'delivery',
        width: '',
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
