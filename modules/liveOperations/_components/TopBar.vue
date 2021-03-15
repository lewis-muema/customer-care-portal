<template>
  <div>
    <BreadCrumbs />
    <ReportsBar :meta-data="metaData" />
    <FilterBar
      :is-admin="isAdmin"
      :filters="filters"
      @searchedOrder="handleOrderSearch"
    />
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  components: {
    BreadCrumbs: () => import('./BreadCrumbs'),
    ReportsBar: () => import('./ReportsBar'),
    FilterBar: () => import('./FilterBar'),
  },
  props: ['isAdmin', 'metaData'],
  computed: {
    reports() {
      const data = [
        {
          title: 'Problematic Orders',
          total: this.metaData === null ? null : this.metaData.total,
          name: 'problematic-orders',
          isFilter: true,
          filterTitle: 'All',
          code: null,
        },
        {
          title: 'Unresolved Orders',
          total: this.metaData === null ? null : this.metaData.unresolved,
          name: 'unresolved-orders',
          isFilter: true,
          filterTitle: 'Unresolved',
          code: 0,
        },
        {
          title: 'Resolved Orders',
          total: this.metaData === null ? null : this.metaData.resolved,
          name: 'resolved-orders',
          isFilter: true,
          filterTitle: 'Resolved',
          code: 1,
        },
        {
          title: 'Avg. Resolution Time',
          total: '12m 10sec',
          name: 'resolution-time',
          isFilter: false,
          filterTitle: 'Avg. Resolution Time',
        },
      ];
      return data;
    },
    filters() {
      // eslint-disable-next-line func-names
      const data = this.reports.filter(function(report) {
        return report.isFilter;
      });
      return data;
    },
  },
  methods: {
    handleOrderSearch(searchedOrder) {
      this.$emit('searchedOrder', searchedOrder);
    },
  },
};
</script>

<style></style>
