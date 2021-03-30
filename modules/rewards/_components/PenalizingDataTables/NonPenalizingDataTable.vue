<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex';
import penalties_datatable_mixin from '@/mixins/penalties_datatable_mixin';

export default {
  name: 'NonPenalizingDataTable',
  mixins: [penalties_datatable_mixin],
  data() {
    return {
      penaltiesData: [],
    };
  },
  created() {
    this.getNonPenalizingData();
  },
  methods: {
    ...mapActions({
      fetchNonPenalizingData: 'fetch_non_penalizing_data',
    }),
    async getNonPenalizingData() {
      const results = await this.fetchNonPenalizingData();
      if (results.status) this.penaltiesData = results.data;
      console.log('>>>', this.penaltiesData);
    },
  },
};
</script>

<style scoped></style>
