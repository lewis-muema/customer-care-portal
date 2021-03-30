<template>
  <div class="reports-holder">
    <div
      class="col-md-3 col-xs-6 text-center"
      :class="`${report.name}`"
      v-for="(report, index) in reports"
      :key="index"
    >
      <div
        class="reports-container"
        :class="
          index === Object.keys(reports).length - 1 ? 'last-report-item' : ''
        "
      >
        <div class="reports-header">{{ report.title }}</div>
        <div class="reports-subheader">
          {{ !report.total ? 'N/A' : report.total }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportBar',
  props: ['metaData'],
  computed: {
    reports() {
      const data = [
        {
          title: 'Problematic Orders',
          total: this.metaData === null ? null : this.metaData.total,
          name: 'problematic-orders',
        },
        {
          title: 'Unresolved Orders',
          total: this.metaData === null ? null : this.metaData.unresolved,
          name: 'unresolved-orders',
        },
        {
          title: 'Resolved Orders',
          total: this.metaData === null ? null : this.metaData.resolved,
          name: 'resolved-orders',
        },
        {
          title: 'Avg. Resolution Time',
          total:
            this.metaData === null
              ? null
              : this.determineDuration(this.metaData.averageResolutionTime),
          name: 'resolution-time',
        },
      ];
      return data;
    },
  },
};
</script>
