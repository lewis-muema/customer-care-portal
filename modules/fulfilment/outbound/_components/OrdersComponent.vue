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
        setter: 'fulfilment/fetchDeliveryRequests',
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
        name: 'Seller',
        tag: 'business_name',
        width: '140',
      },
      {
        name: 'Order Number',
        tag: 'order_id',
        width: '150',
      },

      {
        name: 'Recipient',
        tag: 'order_recipient_name',
        width: '',
      },
      {
        name: 'Time',
        tag: 'scheduled_date',
        width: '150',
      },
      {
        name: 'Destination',
        tag: 'destination_description',
        width: '140',
      },
      {
        name: 'Assigned Batch',
        tag: 'most_recent_batch_id',
        width: '150',
      },
      {
        name: 'Rider',
        tag: 'shipping_agent_name',
        width: '',
      },
      {
        name: 'Region',
        tag: 'destination_region',
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
