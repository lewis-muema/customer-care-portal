<template lang="html">
  <div class="">
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
        setter: 'fulfilment/fetchInBoundBatchedOrders',
      },
    };
  },
  computed: {
    params() {
      const data = {
        direction: 'INBOUND',
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
        name: 'Orders',
        tag: 'order_count',
        width: '130',
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
        name: 'Destination',
        tag: 'hub_name',
        width: '',
      },

      {
        name: 'Rider',
        tag: 'shipping_agent_name',
        width: '',
      },
      {
        name: 'Region',
        tag: 'region',
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
