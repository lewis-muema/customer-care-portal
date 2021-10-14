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
        setter: 'fulfilment/fetchOutboundDeliveryRequests',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Status',
        tag: 'order_status',
        width: '130',
      },
      {
        name: 'Order Number',
        tag: 'order_id',
        width: '150',
      },
      {
        name: 'Seller',
        tag: 'business.business_name',
        width: '140',
      },
      {
        name: 'Recipient',
        tag: 'destination.name',
        width: '',
      },
      {
        name: 'Time',
        tag: 'scheduled_date',
        width: '150',
      },
      {
        name: 'Destination',
        tag: 'destination.delivery_location.description',
        width: '140',
      },
      {
        name: 'Assigned Batch',
        tag: 'batches[0]',
        width: '150',
      },
      {
        name: 'Rider',
        tag: 'destination.delivery_location.region',
        width: '',
      },
      {
        name: 'Region',
        tag: 'destination.delivery_location.region',
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
