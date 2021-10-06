<template>
  <div class="fulfilment-multiselect">
    <label class="typo__label fulfilment-filter-header">Filter Region</label>
    <multiselect
      v-model="checkedOptions"
      placeholder="Search Hubs"
      label="name"
      track-by="code"
      :options="options"
      :multiple="true"
      :taggable="true"
      select-label=""
      selected-label=""
      deselect-label=""
      :custom-label="customLabel"
      :close-on-select="true"
      class="multiselect"
      @input="submitMethod"
      @select="onSelect($event)"
      @remove="onRemove($event)"
    >
      <span
        class="checkbox-label"
        slot="option"
        slot-scope="scope"
        @click.self="select(scope.option)"
      >
        <input
          class="test"
          type="checkbox"
          v-model="scope.option.checked"
          @focus.prevent
        />
        <span class="ml-2">
          {{ scope.option.name }}
        </span>
      </span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'RegionsFilter',
  components: {
    Multiselect,
  },
  data() {
    return {
      checkedOptions: [{ code: 'all', name: 'All Regions', checked: true }],
      regions: [],
      options: [{ code: 'all', name: 'All Regions', checked: true }],
      selectedRegions: [],
    };
  },
  computed: {
    ...mapGetters({
      getRegions: 'fulfilment/getRegions',
    }),
  },
  watch: {
    getRegions(regions) {
      this.options = [{ code: 'all', name: 'All Regions', checked: true }];
      regions.forEach(region => {
        this.options.push({
          code: region.region_id,
          name: region.region,
          checked: false,
        });
        this.regions.push(region.region_id);
      });
    },
  },
  mounted() {
    this.fetchRegions();
  },

  methods: {
    ...mapMutations({
      updateSelectedRegions: 'fulfilment/setSelectedRegions',
    }),
    ...mapActions({
      fetchRegions: 'fulfilment/fetchRegions',
    }),

    customLabel(option) {
      return `${option.name}`;
    },
    onSelect(option) {
      const index = this.options.findIndex(item => item.code === option.code);
      this.options[index].checked = true;

      if (option.code !== 'all') {
        const indexAll = this.checkedOptions.findIndex(
          item => item.code === 'all',
        );
        this.options[0].checked = false;
        // eslint-disable-next-line prettier/prettier
        this.checkedOptions = indexAll > -1 ?  this.checkedOptions.splice(indexAll) : this.checkedOptions;
      }
    },
    onRemove(option) {
      const index = this.options.findIndex(item => item.code === option.code);

      this.options[index].checked = false;
    },
    select(data) {
      return data;
    },
    submitMethod() {
      const arr = [];
      this.checkedOptions.forEach(element => {
        arr.push(element.code);
      });
      this.selectedRegions = arr.includes('all') ? this.regions : arr;
      this.updateSelectedRegions(this.selectedRegions);
    },
  },
};
</script>
