<template lang="html">
  <div class="">
    <div class="">
      <div class="">
        <FiltersBar />
      </div>
      <div class="mc-seller-table-container">
        <Table :data-props="dataProps" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import FiltersBar from '../../globals/_components/FiltersBar.vue';
import Table from '../../globals/_components/Table';

export default {
  name: 'SellerList',
  components: { FiltersBar, Table },
  data() {
    return {
      dataProps: {
        setter: 'fulfilment/getSellerList',
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
  mounted() {
    const tableProps = [
      {
        name: 'Business name',
        tag: 'business_name',
        width: '',
      },
      {
        name: 'Client name',
        tag: 'client_name',
        width: '',
      },
      {
        name: 'Email address',
        tag: 'business_email',
        width: '',
      },
      {
        name: 'Phone number',
        tag: 'business_phone_no',
        width: '',
      },
      {
        name: 'Account creation date',
        tag: 'account_created_date',
        width: '',
      },
      {
        name: '',
        tag: 'seller_redirect',
        width: '50',
      },
    ];

    this.setTableProps(tableProps);
    this.updateSellerSearchedEntity(null);
  },
  methods: {
    ...mapActions({
      setTableProps: 'fulfilment/setTableProps',
    }),
    ...mapMutations({
      setSellerPage: 'fulfilment/setSellerPage',
      setSellerInfo: 'fulfilment/setSellerInfo',
      updateSellerSearchedEntity: 'fulfilment/updateSellerSearchedEntity',
    }),
  },
};
</script>
