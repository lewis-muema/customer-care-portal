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
        setter: 'fulfilment/getDeliveryHistory',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Order Number',
        tag: 'order_id',
        width: '',
      },
      {
        name: 'Cost of goods',
        tag: 'order_amount',
        width: '',
      },
      {
        name: 'Fulfilment fee',
        tag: 'fulfilment_fee',
        width: '',
      },
      {
        name: 'Creation date',
        tag: 'created_date',
        width: '',
      },
      {
        name: 'Fulfilment date',
        tag: 'completed_date',
        width: '',
      },
      {
        name: 'Payment status',
        tag: 'order_status',
        width: '150',
      },
    ];

    this.setTableProps(tableProps);
  },
  computed: {
    ...mapGetters({
      getSellerInfo: 'fulfilment/getSellerInfo',
    }),
  },
  methods: {
    ...mapActions({
      setTableProps: 'fulfilment/setTableProps',
    }),
  },
};
</script>

<style lang="css" scoped></style>
