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
        setter: 'fulfilment/fetchBatchedOrders',
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
        tag: 'package_no',
        width: '',
      },
      {
        name: 'Batch No',
        tag: 'batch_id',
        width: '',
      },
      {
        name: 'Time',
        tag: 'scheduled_date',
        width: '150',
      },
      {
        name: 'Pickup',
        tag: 'hub_id',
        width: '130',
      },
      {
        name: 'Destination',
        tag: 'direction',
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
