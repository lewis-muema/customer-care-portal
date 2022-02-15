<template lang="html">
  <div class="mc-seller-table-container">
    <Table :data-props="dataProps" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Table from '../../globals/_components/Table';

export default {
  components: { Table },
  data() {
    return {
      dataProps: {
        setter: 'fulfilment/getInvoiceList',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Invoice no.',
        tag: 'invoice_id',
        width: '',
      },
      {
        name: 'Date',
        tag: 'created_date',
        width: '',
      },
      {
        name: 'Invoice amount',
        tag: 'amount',
        width: '',
      },
      {
        name: 'Total Deliveries',
        tag: 'total_deliveries',
        width: '',
      },
    ];

    this.setTableProps(tableProps);
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      setTableProps: 'fulfilment/setTableProps',
    }),
  },
};
</script>

<style lang="css" scoped></style>
