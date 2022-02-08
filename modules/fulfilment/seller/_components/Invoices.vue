<template lang="html">
  <div class="mc-seller-table-container">
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
        setter: 'fulfilment/getInvoiceList',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Invoice no.',
        tag: 'invoice_no',
        width: '',
      },
      {
        name: 'Date',
        tag: 'creation_date',
        width: '',
      },
      {
        name: 'Invoice amount',
        tag: 'invoice_amount',
        width: '',
      },
      {
        name: 'Total Deliveries',
        tag: 'total_deliveries',
        width: '',
      },
      {
        name: '',
        tag: 'invoice_download',
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
