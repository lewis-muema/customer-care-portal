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
        setter: 'fulfilment/getHubList',
      },
    };
  },

  mounted() {
    const tableProps = [
      {
        name: 'Name',
        tag: 'hub_name',
        width: '',
      },
      {
        name: 'Country',
        tag: 'country',
        width: '',
      },
      {
        name: 'Location',
        tag: 'location',
        width: '',
      },
      {
        name: 'Type of hub',
        tag: 'type',
        width: '',
      },
      {
        name: 'Status',
        tag: 'status',
        width: '130',
      },
      {
        name: 'Actions',
        tag: 'action',
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
