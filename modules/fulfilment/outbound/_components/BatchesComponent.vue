<template>
  <div class="fulfilment-outbound-batches">
    <Table :data-props="dataProps" :params="params" />
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
  computed: {
    params() {
      const data = {
        direction: 'OUTBOUND',
      };
      return data;
    },
  },
  mounted() {
    const tableProps = [
      {
        name: 'Status',
        tag: 'batch_status',
        width: '130',
      },
      {
        name: 'Packages',
        tag: 'order_count',
        width: '100',
      },
      {
        name: 'Batch No',
        tag: 'batch_id',
        width: '',
      },
      {
        name: 'Time',
        tag: 'scheduled_date',
        width: '',
      },
      {
        name: 'Pickup',
        tag: 'hub_name',
        width: '',
      },
      {
        name: 'Rider',
        tag: 'shipping_agent_name',
        width: '',
      },
      {
        name: 'Country',
        tag: 'country',
        width: '130',
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
