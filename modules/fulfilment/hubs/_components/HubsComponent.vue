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
        tag: 'hub_location.description',
        width: '',
      },
      {
        name: 'Type of hub',
        tag: 'hub_type',
        width: '',
      },
      {
        name: 'Status',
        tag: 'hub_status',
        width: '130',
      },
      {
        name: 'Actions',
        tag: 'activated',
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
